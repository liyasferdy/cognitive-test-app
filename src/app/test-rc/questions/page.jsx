"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody } from "@nextui-org/card";
import { FaTasks } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { articleData } from "../article";
import { Button } from "@nextui-org/button";
import AuthWrapper from "../../authWrapper";
import { RadioGroup, Radio } from "@nextui-org/radio";
import axios from "axios";
import { useRouter } from "next/navigation";

const ArticlePageRC = () => {
  const [timeLeft, setTimeLeft] = useState(900); // Timer for the entire test (15 minutes)
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // Detect screen size for mobile responsiveness
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Timer countdown logic
  useEffect(() => {
    if (timeLeft === 0) {
      submitAnswers();
      return;
    }

    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const handleAnswerSelect = (questionId, value) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const submitAnswers = async () => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("Anda belum login. Silakan login terlebih dahulu.");
        setIsSubmitting(false);
        return;
      }

      const answers = Object.entries(selectedAnswers).map(
        ([questionNumber, selectedAnswer]) => {
          const questionNum = parseInt(questionNumber, 10);
          const articleId = Math.floor((questionNum - 1) / 5); // Adjust logic if each article has exactly 5 questions
          return {
            articleId,
            questionNumber: questionNum,
            selectedAnswer,
          };
        }
      );

      if (answers.length === 0) {
        alert("Harap jawab setidaknya satu pertanyaan sebelum submit.");
        setIsSubmitting(false);
        return;
      }

      console.log("Submitting payload:", { answers });

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
        router.push("/submit");
      } else {
        alert("Gagal submit jawaban. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error submitting answers:", error);
      alert("Terjadi kesalahan saat submit jawaban.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthWrapper>
      <div
        className={`pt-20 flex flex-col items-center min-h-screen bg-gray-100 ${
          isMobile ? "p-2" : "p-4"
        }`}
      >
        <div
          className={`${isMobile ? "space-y-3" : "space-y-5"} w-full max-w-4xl`}
        >
          {articleData.map((article) => (
            <div key={article.id}>
              {/* Article Content */}
              <Card
                className={`${
                  isMobile
                    ? "max-w-full px-6 py-4"
                    : "max-w-[50rem] px-20 py-10"
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
              {article.questions.map((question) => (
                <Card
                  key={question.number}
                  className={`${
                    isMobile ? "w-full px-4 py-4" : "w-[50rem] px-12 py-6"
                  } h-fit`}
                >
                  <CardBody>
                    <RadioGroup
                      value={selectedAnswers[question.number] || ""}
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
            </div>
          ))}

          {/* Submit Button */}
          <div
            className={`flex justify-center items-center ${
              isMobile ? "mt-6 mb-10" : "mt-10 mb-20"
            }`}
          >
            <Button
              color="primary"
              size={`${isMobile ? "md" : "lg"}`}
              className={`${isMobile ? "w-full max-w-[200px]" : "mt-4"}`}
              // onClick={handleSubmit}
              onClick={() => setShowModal(true)}
              isLoading={isSubmitting}
            >
              Submit
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-7">
          {isMobile && (
            <div className="w-full flex flex-row gap-2 p-2 fixed top-0 left-0 z-50 shadow-md bg-gray-100">
              <Card className="flex flex-row items-center p-2 w-1/2 shadow-sm">
                <FaTasks className="text-2xl mr-2" />
                <div>
                  <h2 className="text-sm font-semibold">Test</h2>
                  <p className="text-xs">RC</p>
                </div>
              </Card>
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
                    <p className="text-lg text-left mt-1 ml-16">RC</p>
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

        {/* Modal Konfirmasi */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-96">
              <h2 className="text-center text-xl mb-4 font-semibold">
                Submit Jawaban
              </h2>
              <p className="text-center mb-6">
                Kamu masih punya waktu tersisa. Apakah kamu yakin ingin
                mengakhiri tes ini?
              </p>
              <div className="flex justify-center">
                <Button
                  color="primary"
                  onClick={() => {
                    setShowModal(false);
                    submitAnswers(true);
                  }}
                  size="lg"
                  className="w-full"
                >
                  Ya, Submit
                </Button>
              </div>
              <div className="flex justify-center mt-4">
                <Button
                  color="danger"
                  onClick={() => setShowModal(false)}
                  size="lg"
                  variant="bordered"
                  className="w-full"
                >
                  Batal
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthWrapper>
  );
};

export default ArticlePageRC;
