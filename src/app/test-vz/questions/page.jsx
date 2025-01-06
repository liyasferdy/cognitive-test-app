"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardBody } from "@nextui-org/card";
import { FaTasks } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import { imageData } from "../image"; // Pastikan path sesuai
import axios from "axios"; // Import axios
import { RadioGroup } from "@nextui-org/radio";
import { Radio } from "@nextui-org/radio";
import AuthWrapper from "../../authWrapper";

export default function QuestionVZ() {
  const router = useRouter();
  const params = useParams();
  const imageNumber = parseInt(params.number, 10);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isValidImageNumber = imageNumber >= 0 && imageNumber < imageData.length;
  const currentImageData = isValidImageNumber ? imageData[imageNumber] : null;

  useEffect(() => {
    if (timeLeft <= 0) {
      router.push("/test-vz/instruction");
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, router]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const handleAnswerChange = (questionNumber, value) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
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

      const answersToSubmit = Object.entries(selectedAnswers).map(
        ([questionNumber, selectedAnswer]) => ({
          questionNumber: parseInt(questionNumber, 10),
          selectedAnswer,
        })
      );

      const response = await axios.post(
        "https://cognitive-dev-734522323885.asia-southeast2.run.app/submit/testVZ",
        { answers: answersToSubmit },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        if (isFinalSubmission || imageNumber >= imageData.length - 1) {
          router.push("/test-vl-S/instruction");
        }
      } else {
        alert("There was an issue submitting your answers. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting answers:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthWrapper>
      <div className="flex flex-col items-center min-h-screen px-4 bg-gray-50 ">
        <div className="w-full flex flex-col justify-start items-center">
          {/* Sidebar */}
          {isMobile && (
            <div className="w-full flex flex-row gap-2 p-2 fixed top-0 left-0 z-50 shadow-md bg-gray-100">
              {/* Test Card */}
              <Card className="flex flex-row items-center p-2 w-1/2 shadow-sm">
                <FaTasks className="text-2xl mr-2" />
                <div>
                  <h2 className="text-sm font-semibold">Test</h2>
                  <p className="text-xs">VZ</p>
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
            <div className="absolute top-20 left-20 space-y-7 ">
              <Card className="w-[270px] shadow-md">
                <FaTasks className="text-5xl absolute top-4 left-2" />
                <CardBody>
                  <div className="flex text-left items-start justify-center">
                    <h2 className="text-xl font-semibold text-left">Test</h2>
                  </div>
                  <div className="flex items-center justify-start">
                    <p className="text-lg text-left mt-1 ml-16">VZ</p>
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

          {/* Konten utama */}
          <div className="w-full flex flex-col justify-start items-center mt-20">
            {isMobile && (
              <div className="w-full flex flex-row gap-2 p-2 fixed top-0 left-0 z-50 shadow-md bg-gray-100">
                {/* Mobile header */}
                <Card className="flex flex-row items-center p-2 w-1/2 shadow-sm">
                  <FaTasks className="text-2xl mr-2" />
                  <div>
                    <h2 className="text-sm font-semibold">Test</h2>
                    <p className="text-xs">VZ</p>
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
          </div>

          {/* Soal */}
          <div className="w-full max-w-4xl space-y-10">
            {imageData.map((question) => (
              <div
                key={question.number}
                className="w-full flex flex-col items-center"
              >
                <Card className="space-y-3 p-10">
                  <CardBody className="flex justify-center items-center p-5">
                    <Image
                      width={300}
                      height={300}
                      alt={`Question ${question.number}`}
                      src={question.image}
                      className="object-contain"
                    />
                  </CardBody>
                  <RadioGroup
                    orientation="horizontal"
                    value={selectedAnswers[question.number] || ""}
                    onValueChange={(value) =>
                      handleAnswerChange(question.number, value)
                    }
                    className="flex flex-row justify-center items-center space-x-4"
                  >
                    {question.options.map((option) => (
                      <Radio key={option.value} value={option.value}>
                        <Card className="h-fit px-10 py-5 flex justify-center items-center">
                          <CardBody className="flex justify-center items-center">
                            <Image
                              width={100}
                              height={100}
                              alt={`Option ${option.value}`}
                              src={option.image}
                              className="object-contain"
                            />
                          </CardBody>
                        </Card>
                      </Radio>
                    ))}
                  </RadioGroup>
                </Card>
              </div>
            ))}
          </div>

          {/* Tombol Submit */}
          <div className="w-full flex justify-center mt-10 mb-10">
            <Button
              color="primary"
              size="lg"
              className="w-full max-w-[200px]"
              onClick={() => setShowModal(true)}
            >
              Submit
            </Button>
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
      </div>
    </AuthWrapper>
  );
}
