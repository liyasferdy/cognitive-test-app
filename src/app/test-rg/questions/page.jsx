"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { RadioGroup, Radio } from "@nextui-org/radio";
import { IoMdTime } from "react-icons/io";
import { FaTasks } from "react-icons/fa";
import { questionsData } from "../questions-RG"; // Pastikan path ini benar
import AuthWrapper from "../../authWrapper";
import axios from "axios";

export default function TestRG() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState(
    Array.from({ length: 30 }, (_, index) => ({
      [index + 1]: null,
    })).reduce((acc, curr) => ({ ...acc, ...curr }), {})
  );
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Ambil pertanyaan saat komponen mount
  useEffect(() => {
    const activeQuestions = questionsData[0]?.questions || [];
    setQuestions(activeQuestions);
  }, []);

  const handleFinalAnswerSubmit = useCallback(() => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    router.push("/test-a3/instruction");
    setIsSubmitting(false);
  }, [isSubmitting, router]);

  // Timer countdown logic
  useEffect(() => {
    if (timeLeft === 0) {
      handleFinalAnswerSubmit();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, handleFinalAnswerSubmit]);

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
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : "";

      const answers = Object.keys(selectedAnswers)
        .filter((key) => selectedAnswers[key] !== null)
        .map((questionNumber) => ({
          questionNumber: parseInt(questionNumber) - 1,
          selectedAnswer: selectedAnswers[questionNumber],
        }));

      const transformedAnswers = answers.map((answer) => ({
        ...answer,
        questionNumber: answer.questionNumber + 1,
      }));

      const response = await axios.post(
        "https://cognitive-dev-734522323885.asia-southeast2.run.app/submit/testRG", //WAJIB GANTI
        { answers: transformedAnswers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        router.push("/test-rq/instruction");
      } else {
        alert("Failed to finalize answers. Please try again.");
      }
    } catch (error) {
      console.log("Error submitting answers:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    handleFinalAnswerSubmit();
  };

  return (
    <AuthWrapper>
      <div className="pt-20 flex flex-col justify-start items-center min-h-screen bg-gray-100 p-4">
        {/* Questions */}
        <div className="space-y-5 w-full max-w-4xl">
          {questions.map((question) => (
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
        {/* Finish Test Button */}
        <div className="flex justify-center items-center mt-10 mb-20">
          <Button
            color="primary"
            size="lg"
            className="mt-4"
            // onClick={() => submitAnswers(true)}
            onClick={() => setShowModal(true)}
          >
            Submit
          </Button>
        </div>

        {/* Modal for finishing the test
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
        )} */}

        {/* Sidebar */}
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
                    <p className="text-lg text-left mt-1 ml-16">RG</p>
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
        {/* Sidebar for Mobile */}
        {isMobile && (
          <div className="w-full flex flex-row gap-2 p-2 fixed top-0 left-0 z-10 shadow-md bg-gray-100 mb-4">
            {/* Test Card */}
            <Card className="flex flex-row items-center p-2 w-1/2 shadow-sm">
              <FaTasks className="text-2xl mr-2" />
              <div>
                <h2 className="text-sm font-semibold">Test</h2>
                <p className="text-xs">RG</p>
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
}
