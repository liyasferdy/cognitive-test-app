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
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes countdown in seconds
  const [article, setArticle] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  // Load timeLeft from localStorage on component mount
  useEffect(() => {
    const savedTime = localStorage.getItem("timeLeft");
    if (savedTime) {
      setTimeLeft(parseInt(savedTime, 10));
    }
  }, []);

  // Save timeLeft to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("timeLeft", timeLeft);
  }, [timeLeft]);

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
        router.push("/test-ma/instruction");
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
      const answers = Object.keys(selectedAnswers).map((questionNumber) => ({
        articleId: article.id,
        questionNumber: parseInt(questionNumber),
        selectedAnswer: selectedAnswers[questionNumber],
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
    router.push("/test-ma/instruction");

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
        <div className="space-y-5">
          {article.questions.map((question) => (
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
        </div>

        <div className="flex justify-center items-center mt-10 mb-20">
          <Button
            color="primary"
            size="lg"
            className="mt-4"
            onClick={() => submitAnswers(false)} // Handle submission without final submission flag
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
                  Akhiri
                </Button>
              </div>
            </div>
          </div>
        )}

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
      </div>
    </AuthWrapper>
  );
}
