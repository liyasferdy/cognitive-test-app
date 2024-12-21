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
  const [timeLeftArticle, setTimeLeftArticle] = useState(300);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [article, setArticleData] = useState(null);
  const [isFinalArticle, setIsFinalArticle] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Fetch the article data based on the URL
  useEffect(() => {
    const pathArray = pathname.split("/");
    const id = Number(pathArray[pathArray.length - 1]);

    // Find the article based on the id from the path
    const activeArticle = articleData.find((article) => article.id === id);

    if (activeArticle) {
      setArticleData(activeArticle);
      setTimeLeftArticle(300); // Reset timer when article changes
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
    if (timeLeftArticle === 0 && article?.id) {
      handleNextQuestions();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeftArticle((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeftArticle, article]);

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
      <div className="pt-20 flex flex-col justify-start items-center min-h-screen space-y-5">
        {/* Article Content */}
        <Card className="max-w-[50rem] h-fit px-20 py-10">
          <CardBody>
            <h1 className="text-slate-400 text-lg text-center">
              {article.title}
            </h1>
            {article.content.map((paragraph, index) => (
              <p
                key={index}
                className="text-justify mt-5 indent-8 leading-loose"
              >
                {paragraph}
              </p>
            ))}
          </CardBody>
        </Card>

        {/* Questions */}
        {article.questions &&
          article.questions.map((question) => (
            <Card key={question.number} className="w-[50rem] h-fit px-12 py-6">
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

        {/* Button Section */}
        <div className="flex justify-center items-center mt-10 mb-20">
          {isFinalArticle ? (
            <Button
              color="primary"
              size="lg"
              className="mt-4 text-white"
              onClick={handleFinalSubmit}
              isLoading={isSubmitting}
            >
              Submit
            </Button>
          ) : (
            <Button
              color="primary"
              size="lg"
              className="mt-4"
              onClick={() => submitAnswers(false)}
              isLoading={isSubmitting}
            >
              Lanjutkan
            </Button>
          )}
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
                  onClick={closeModal}
                  size="lg"
                  className="w-full text-white"
                >
                  Akhiri
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Timer Section */}
        <div className="space-y-10">
          <div className="absolute top-20 left-20 w-[270px] ml-20">
            <Card>
              <FaTasks className="text-5xl absolute top-4 left-2" />
              <CardBody>
                <div className="flex text-left items-start justify-center">
                  <h2 className="text-xl font-semibold text-left mr-20">
                    Test
                  </h2>
                </div>
                <div className="flex items-center justify-start">
                  <p className="text-lg text-left mt-1 ml-16">
                    Reading Comprehension
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="absolute top-40 left-20 w-[270px] ml-20">
            <Card>
              <IoMdTime className="text-6xl absolute top-3 left-2" />
              <CardBody>
                <div className="flex text-left items-start justify-center">
                  <h2 className="text-xl font-semibold text-left ml-4">
                    Waktu Tersisa
                  </h2>
                </div>
                <div className="flex items-center justify-start">
                  <p className="text-xl text-left mt-1 ml-16">
                    {formatTime(timeLeftArticle)}
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default ArticlePageRC;
