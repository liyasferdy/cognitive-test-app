"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { RadioGroup, Radio } from "@nextui-org/radio";
import { IoMdTime } from "react-icons/io";
import { FaTasks } from "react-icons/fa";
import { articleData } from "../../../article";
import AuthWrapper from "../../../../authWrapper";
import axios from "axios";

export default function TestMM() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(30); // times countdown in seconds
  const [article, setArticle] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
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

  // Fetch article based on path parameter
  useEffect(() => {
    const pathArray = String(window.location.pathname).split("/");
    const id = Number(pathArray[pathArray.length - 2]); // Extract article id
    const activeArticle = articleData.find((article) => article.id === id);

    if (activeArticle) {
      setArticle(activeArticle);
    } else {
      setArticle(null);
    }
  }, []);

  // Timer countdown logic
  useEffect(() => {
    if (timeLeft === 0) {
      const currentArticleIndex = articleData.findIndex(
        (art) => art.id === article?.id
      );
      if (
        currentArticleIndex !== -1 &&
        currentArticleIndex + 1 < articleData.length
      ) {
        const nextArticle = articleData[currentArticleIndex + 1];
        router.push(`/test-mm/article/${nextArticle.id}`);
      } else {
        router.push("/test-vl-SA/instruction");
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, router, article]);

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
      const answers = article.questions.map((question) => ({
        articleId: article.id,
        questionNumber: question.number,
        selectedAnswer: selectedAnswers[question.number] || "9", // Default to "9" if no answer
      }));

      const response = await axios.post(
        "https://cognitive-dev-734522323885.asia-southeast2.run.app/submit/testMM",
        { answers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const currentArticleIndex = articleData.findIndex(
          (art) => art.id === article?.id
        );
        if (
          currentArticleIndex !== -1 &&
          currentArticleIndex + 1 < articleData.length
        ) {
          const nextArticle = articleData[currentArticleIndex + 1];
          router.push(`/test-mm/article/${nextArticle.id}`);
        } else {
          setShowModal(true); // Show modal if no more articles
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

  const handleFinalAnswerSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Directly navigate without sending the data to the backend
    router.push("/test-vl-SA/instruction");

    // Optionally, reset isSubmitting in the finally block
    setIsSubmitting(false);
  };

  const closeModal = () => {
    setShowModal(false);
    handleFinalAnswerSubmit();
  };

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <AuthWrapper>
      <div className="pt-20 flex flex-col justify-start items-center min-h-screen bg-gray-100 p-4">
        {/* Questions */}
        <div className="space-y-5 w-full max-w-4xl">
          {article.questions.map((question) => (
            <Card key={question.number} className="w-full px-4 py-6">
              <CardBody>
                <RadioGroup
                  value={selectedAnswers[question.number]}
                  onValueChange={(value) =>
                    handleAnswerSelect(question.number, value)
                  }
                  label={`Soal ${question.number}: ${question.text}`}
                  labelPlacement="outside"
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
        </div>

        <div className="flex justify-center items-center mt-10 mb-20">
          <Button
            color="primary"
            size="lg"
            className="mt-4"
            onClick={submitAnswers}
          >
            Lanjutkan
          </Button>
        </div>

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
                  onClick={closeModal}
                  size="lg"
                  className="w-full text-white"
                >
                  Submit
                </Button>
              </div>
              <div className="flex justify-center mt-4">
                <Button
                  color="danger"
                  onClick={() => setShowModal(false)}
                  size="lg"
                  variant="bordered"
                  className="w-full text-red-600"
                >
                  Batal
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar for Mobile */}
        {isMobile && (
          <div className="w-full flex flex-row gap-2 p-2 fixed top-0 left-0 z-10 shadow-md bg-gray-100 mb-4">
            {/* Test Card */}
            <Card className="flex flex-row items-center p-2 w-1/2 shadow-sm">
              <FaTasks className="text-2xl mr-2" />
              <div>
                <h2 className="text-sm font-semibold">Test</h2>
                <p className="text-xs">Meaningful Memory</p>
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

        {/* Sidebar for Dekstop */}
        {!isMobile && (
          <div className="space-y-7">
            <div className="absolute top-20 left-20 w-[270px] ml-20">
              <Card>
                <FaTasks className="text-5xl absolute top-4 left-2" />
                <CardBody>
                  <div className="flex text-left items-start justify-center ">
                    <h2 className="text-xl font-semibold text-left mr-20">
                      Test
                    </h2>
                  </div>
                  <div className="flex items-center justify-start">
                    <p className="text-lg text-left mt-1 ml-16">
                      Meaningful Memory
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>

            <div className="absolute top-40 left-20 w-[270px] ml-20">
              <Card>
                <IoMdTime className="text-6xl absolute top-3 left-2" />
                <CardBody>
                  <div className="flex text-left items-start justify-center ">
                    <h2 className="text-xl font-semibold text-left ml-4">
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
          </div>
        )}
      </div>
    </AuthWrapper>
  );
}
