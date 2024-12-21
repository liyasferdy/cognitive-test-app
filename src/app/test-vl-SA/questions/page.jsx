"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { RadioGroup, Radio } from "@nextui-org/radio";
import { IoMdTime } from "react-icons/io";
import { FaTasks } from "react-icons/fa";
import { questionsData } from "../questions_VL-SA"; // Pastikan path ini benar
import AuthWrapper from "../../authWrapper";
import axios from "axios";

export default function TestVLSentence() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(300);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState(
    Array.from({ length: 30 }, (_, index) => ({
      [index + 1]: null,
    })).reduce((acc, curr) => ({ ...acc, ...curr }), {})
  );
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ambil pertanyaan saat komponen mount
  useEffect(() => {
    const activeQuestions = questionsData[0]?.questions || [];
    setQuestions(activeQuestions);
  }, []);

  const handleFinalAnswerSubmit = useCallback(() => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    router.push("/test-gfi/instruction"); //GANTI ROUTES
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
        "https://cognitive-dev-734522323885.asia-southeast2.run.app/submit/testVLSA", //WAJIB GANTI, HANYA UNTUK CEK DB SEMENTARA
        { answers: transformedAnswers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        router.push("/test-gfi/instruction"); //GANTI ROUTES
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
        <div className="space-y-5">
          {questions.map((question) => (
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

        {/* Finish Test Button */}
        <div className="flex justify-center items-center mt-10 mb-20">
          <Button
            color="primary"
            size="lg"
            className="mt-4"
            onClick={() => submitAnswers(true)}
          >
            Submit
          </Button>
        </div>

        {/* Modal for finishing the test */}
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

        {/* Sidebar */}
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
                  <p className="text-lg text-left mt-1 ml-16">Mental Ability</p>
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
