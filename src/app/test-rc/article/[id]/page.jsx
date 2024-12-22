"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Card, CardBody } from "@nextui-org/card";
import { FaTasks } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { articleData } from "../../article";
import { Button } from "@nextui-org/button";
import AuthWrapper from "../../../authWrapper";
import { RadioGroup, Radio } from "@nextui-org/radio";
import axios from "axios";

const ArticlePageRC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [timeLeft, setTimeLeft] = useState(420);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [article, setArticleData] = useState(null);
  const [isFinalArticle, setIsFinalArticle] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size for mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Set mobile view for screen width <= 768px
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch the article data based on the URL
  useEffect(() => {
    const pathArray = pathname.split("/");
    const id = Number(pathArray[pathArray.length - 1]);

    // Find the article based on the id from the path
    const activeArticle = articleData.find((article) => article.id === id);

    if (activeArticle) {
      setArticleData(activeArticle);
      setTimeLeft(420); // Reset timer when article changes
      setSelectedAnswers({}); // Reset answers when article changes

      // Check if this is the final article
      const nextArticle = articleData.find((art) => art.id > activeArticle.id);
      setIsFinalArticle(!nextArticle);
    } else {
      setArticleData(null);
    }
  }, [pathname]);

  // Timer countdown logic
  useEffect(() => {
    if (timeLeft === 0 && article?.id) {
      handleNextQuestions();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, article]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const handleAnswerSelect = (questionNumber, value) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionNumber]: value,
    }));
  };

  const submitAnswers = async (isFinalSubmission = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("access_token");

      // Prepare data to match the backend schema
      const answers = Object.keys(selectedAnswers).map((questionNumber) => ({
        articleId: article.id,
        questionNumber: parseInt(questionNumber),
        selectedAnswer: selectedAnswers[questionNumber],
      }));

      const response = await axios.post(
        "https://cognitive-dev-734522323885.asia-southeast2.run.app/submit/testRC",
        { answers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        if (isFinalSubmission) {
          setShowModal(true);
        } else {
          handleNextQuestions();
        }
      } else {
        alert("There was an issue submitting your answers. Please try again.");
      }
    } catch (error) {
      console.log("Error submitting answers:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fungsi untuk mengakhiri test (menyimpan semua jawaban di memory ke DB)
  const handleFinalAnswerSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "https://cognitive-dev-734522323885.asia-southeast2.run.app/answers/savetoDB",
        {},
        {
          headers: {
            Authorization: `Bearer ${
              typeof window !== "undefined"
                ? localStorage.getItem("access_token")
                : ""
            }`,
          },
        }
      );

      if (response.status === 200) {
        router.push("/");
      } else {
        alert("Failed to finalize answers. Please try again.");
      }
    } catch (error) {
      console.log("Error finalizing answers:", error);
      alert("An error occurred while finalizing answers. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Submit final answers and navigate
    await submitAnswers(true);
    router.push("/");

    setIsSubmitting(false);
  };

  const handleNextQuestions = () => {
    if (!article) return;

    const currentId = article.id;
    const nextArticle = articleData.find((art) => art.id > currentId);

    if (nextArticle) {
      router.push(`/test-rc/article/${nextArticle.id}`);
    } else {
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    router.push("/");
  };

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <AuthWrapper>
      <div
        className={`pt-20 flex flex-col justify-start items-center min-h-screen bg-gray-100 ${
          isMobile ? "p-2" : "p-4"
        }`}
      >
        <div
          className={`${isMobile ? "space-y-3" : "space-y-5"} w-full max-w-4xl`}
        >
          {/* Article Content */}
          <Card
            className={`${
              isMobile ? "max-w-full px-6 py-4" : "max-w-[50rem] px-20 py-10"
            } h-fit`}
          >
            <CardBody>
              <h1
                className={`text-center ${
                  isMobile
                    ? "text-base text-slate-500"
                    : "text-lg text-slate-400"
                }`}
              >
                {article.title}
              </h1>
              {article.content.map((paragraph, index) => (
                <p
                  key={index}
                  className={`text-justify mt-5 indent-8 ${
                    isMobile ? "leading-normal" : "leading-loose"
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </CardBody>
          </Card>

          {/* Questions */}
          {article.questions &&
            article.questions.map((question) => (
              <Card
                key={question.number}
                className={`${
                  isMobile ? "w-full px-4 py-4" : "w-[50rem] px-12 py-6"
                } h-fit`}
              >
                <CardBody>
                  <RadioGroup
                    value={selectedAnswers[question.number]}
                    onValueChange={(value) =>
                      handleAnswerSelect(question.number, value)
                    }
                    label={`Soal ${question.number}: ${question.text}`}
                    labelPlacement="outside"
                    className={`${isMobile ? "text-sm" : "text-base"}`}
                  >
                    {question.options.map((option, index) => (
                      <Radio key={index} value={option.value}>
                        {option.text}
                      </Radio>
                    ))}
                  </RadioGroup>
                </CardBody>
              </Card>
            ))}

          {/* Button Section */}
          <div
            className={`flex justify-center items-center ${
              isMobile ? "mt-6 mb-10" : "mt-10 mb-20"
            }`}
          >
            {isFinalArticle ? (
              <Button
                color="primary"
                size={`${isMobile ? "md" : "lg"}`}
                className={`${
                  isMobile ? "w-full max-w-[200px]" : "mt-4 text-white"
                }`}
                onClick={handleFinalAnswerSubmit} // Panggil handleFinalAnswerSubmit langsung
                isLoading={isSubmitting}
              >
                Submit
              </Button>
            ) : (
              <Button
                color="primary"
                size={`${isMobile ? "md" : "lg"}`}
                className={`${isMobile ? "w-full max-w-[200px]" : "mt-4"}`}
                onClick={() => submitAnswers(false)}
                isLoading={isSubmitting}
              >
                Lanjutkan
              </Button>
            )}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-96">
              <h2 className="text-center text-xl mb-4 font-semibold">
                Submit Jawaban
              </h2>
              <p className="text-center mb-6">
                Kamu telah menyelesaikan sub-test ini, apakah kamu yakin untuk
                mengakhiri?
              </p>
              <div className="flex justify-center">
                <Button
                  color="primary"
                  onClick={async () => {
                    try {
                      // Panggil endpoint logout
                      const token = localStorage.getItem("access_token");
                      await axios.post(
                        "https://cognitive-dev-734522323885.asia-southeast2.run.app/logout",
                        {},
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );

                      // Hapus token dari localStorage setelah logout berhasil
                      localStorage.removeItem("access_token");

                      // Arahkan ke halaman login atau halaman lain setelah logout
                      closeModal();
                    } catch (error) {
                      console.error("Error during logout:", error);
                      alert("Gagal logout. Silakan coba lagi.");
                    }
                  }}
                  size="lg"
                  className="w-full text-white"
                >
                  Akhiri
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar */}
        <div className="space-y-7">
          {/* Sidebar */}
          {isMobile && (
            <div className="w-full flex flex-row gap-2 p-2 fixed top-0 left-0 z-50 shadow-md bg-gray-100">
              {/* Test Card */}
              <Card className="flex flex-row items-center p-2 w-1/2 shadow-sm">
                <FaTasks className="text-2xl mr-2" />
                <div>
                  <h2 className="text-sm font-semibold">Test</h2>
                  <p className="text-xs">Memory Visual</p>
                </div>
              </Card>

              {/* Time Card */}
              <Card className="flex flex-row items-center p-2 w-1/2 shadow-sm">
                <IoMdTime className="text-2xl mr-2" />
                <div>
                  <h2 className="text-sm font-semibold">Waktu Tersisa</h2>
                  <p className="text-xs">{formatTime(timeLeft)}</p>
                </div>
              </Card>
            </div>
          )}

          {!isMobile && (
            <div className="absolute top-20 left-20 space-y-7">
              <Card className="w-[270px] shadow-md">
                <FaTasks className="text-5xl absolute top-4 left-2" />
                <CardBody>
                  <div className="flex text-left items-start justify-center">
                    <h2 className="text-xl font-semibold text-left">Test</h2>
                  </div>
                  <div className="flex items-center justify-start">
                    <p className="text-lg text-left mt-1 ml-16">
                      Memory Visual
                    </p>
                  </div>
                </CardBody>
              </Card>

              <Card className="w-[270px] shadow-md">
                <IoMdTime className="text-6xl absolute top-3 left-2" />
                <CardBody>
                  <div className="flex text-left items-start justify-center">
                    <h2 className="text-xl font-semibold text-left">
                      Waktu Tersisa
                    </h2>
                  </div>
                  <div className="flex items-center justify-start">
                    <p className="text-xl text-left mt-1 ml-16">
                      {formatTime(timeLeft)}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
        </div>
      </div>
    </AuthWrapper>
  );
};

export default ArticlePageRC;
