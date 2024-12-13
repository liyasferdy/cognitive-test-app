"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { RadioGroup, Radio } from "@nextui-org/radio";
import { IoMdTime } from "react-icons/io";
import { FaTasks } from "react-icons/fa";
import { questionsData } from "../../questions"; // Adjusted import
import AuthWrapper from "../../../authWrapper";

export default function TestMA() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes countdown
  const [article, setArticle] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState(
    Array.from({ length: 30 }, (_, index) => ({
      [index + 1]: null,
    })).reduce((acc, curr) => ({ ...acc, ...curr }), {})
  );
  const [showModal, setShowModal] = useState(false);

  // Update the useEffect to use questionsData
  useEffect(() => {
    // Since questionsData is a static array, we'll use the first item
    const activeQuestions = questionsData[0];

    if (activeQuestions) {
      setArticle(activeQuestions);
    } else {
      setArticle(null);
    }
  }, []);

  // Timer countdown logic
  useEffect(() => {
    if (timeLeft === 0) {
      router.push("/test-ma/instruction");
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, router]);

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

  if (!article) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  const handleNextArticle = () => {
    // For this version, we'll just show the modal
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    router.push("/test-mv/instruction");
  };

  return (
    <AuthWrapper>
      <div className="pt-20 flex flex-col justify-start items-center min-h-screen bg-gray-100 p-4">
        {/* Questions */}
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

        {/* Finish Test Button */}
        <div className="flex justify-center items-center mt-10 mb-20">
          <Button
            color="primary"
            size="lg"
            className="mt-4"
            onClick={handleNextArticle}
          >
            Selesaikan dan Lanjutkan
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
                  Akhiri dan Selesaikan
                </Button>
              </div>
              <div className="flex justify-center mt-4">
                <Button
                  color="danger"
                  onClick={closeModal}
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

        {/* Question List */}
        <div className="absolute top-[300px] left-20 w-50 ml-20">
          <Card>
            <CardBody>
              <h2 className="text-center text-xl font-semibold mb-2">
                Daftar Soal
              </h2>
              <div className="grid grid-cols-4 gap-4 w-full max-w-4xl justify-center items-center p-4 rounded-md">
                {Object.keys(selectedAnswers).map((questionNum) => (
                  <Card
                    key={questionNum}
                    hoverable
                    clickable
                    className={`px-4 py-2 transition-all ${
                      selectedAnswers[questionNum]
                        ? "bg-cyan-500 text-white"
                        : "hover:bg-cyan-500 hover:text-white"
                    }`}
                  >
                    <h4 className="text-center">{questionNum}</h4>
                  </Card>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </AuthWrapper>
  );
}
