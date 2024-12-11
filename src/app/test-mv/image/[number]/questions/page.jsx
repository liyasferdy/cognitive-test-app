"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardBody } from "@nextui-org/card";
import { FaTasks } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { Image } from "@nextui-org/image";
import { Radio, RadioGroup } from "@nextui-org/radio";
import { Button } from "@nextui-org/button";
import { imageData } from "../../../image"; // Adjusted import path
import axios from "axios"; // Import axios for HTTP requests

export default function QuestionMV() {
  const router = useRouter();
  const params = useParams();
  const imageNumber = parseInt(params.number, 10) - 1; // Convert to 0-based index
  const [timeLeft, setTimeLeft] = useState(500);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate image number
  if (imageNumber < 0 || imageNumber >= imageData.length) {
    return <div>Invalid image number</div>;
  }

  const currentImageData = imageData[imageNumber];

  // Timer countdown logic
  useEffect(() => {
    if (timeLeft === 0) {
      // End of test or redirect
      router.push(`/test-mv/image/${imageNumber + 2}`);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, router, imageNumber]);

  // Format time to mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // Handle answer selection
  const handleAnswerChange = (value) => {
    setSelectedAnswer(value);
  };

  // Handle showing the modal when "Submit" is clicked
  const handleSubmit = async () => {
    if (imageNumber < imageData.length - 1) {
      // If not the last question, move to the next one
      const newAnswers = [
        ...answers,
        {
          questionNumber: imageNumber, // Use 0-based index for question number
          selectedAnswer,
        },
      ];
      setAnswers(newAnswers);
      router.push(`/test-mv/image/${imageNumber + 2}`);
    } else {
      // If it's the last question, add the final answer and show the modal
      const finalAnswers = [
        ...answers,
        {
          questionNumber: imageNumber,
          selectedAnswer,
        },
      ];
      setAnswers(finalAnswers);
      setShowModal(true);
    }
  };

  // Handle modal close (Cancel)
  const closeModal = () => {
    setShowModal(false); // Hide the modal
  };

  // Handle modal confirm (Finish the test)
  const confirmSubmit = async () => {
    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true);

    try {
      // Send answers to the backend
      const response = await axios.post("http://localhost:8000/submit", {
        answers: answers.map((answer) => ({
          questionNumber: answer.questionNumber,
          selectedAnswer: answer.selectedAnswer,
        })),
      });

      // Handle response from the backend
      if (response.status === 200) {
        router.push("/test-ms/instruction");
      } else {
        console.error("Failed to submit answers");
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
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="w-full flex justify-center items-center">
        <div className="flex flex-col justify-center items-center absolute -mt-10 top-[400px] -right-40 transform -translate-x-1/2 -translate-y-1/2">
          <Card className="w-[1000px]">
            <CardBody className="flex flex-col justify-center items-center p-6">
              <h2 className="text-xl font-semibold text-center mb-10">
                Pilih salah satu
              </h2>
              <RadioGroup
                orientation="horizontal"
                className="flex flex-row justify-center items-center space-x-4"
                value={selectedAnswer}
                onValueChange={handleAnswerChange}
              >
                {currentImageData.options.map((option) => (
                  <Radio
                    key={option.value}
                    value={option.value}
                    className="flex justify-center items-center"
                  >
                    <Card className="h-fit px-10 py-5 flex justify-center items-center">
                      <CardBody className="flex justify-center items-center">
                        <Image
                          width={150}
                          height={150}
                          alt={`Option ${option.value}`}
                          src={option.image}
                          className="object-contain"
                        />
                      </CardBody>
                    </Card>
                  </Radio>
                ))}
              </RadioGroup>
            </CardBody>
          </Card>
        </div>

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
                  <p className="text-lg text-left mt-1 ml-16">Memory Visual</p>
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
          <div className="flex justify-start absolute items-center bottom-60">
            <Button
              color="primary"
              variant="ghost"
              size="lg"
              onClick={handleSubmit}
              disabled={!selectedAnswer}
            >
              {imageNumber < imageData.length - 1 ? "Next" : "Submit"}
            </Button>
          </div>
        </div>
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
                onClick={confirmSubmit}
                size="lg"
                className="w-full text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Mengirim..." : "Akhiri dan Selesaikan"}
              </Button>
            </div>
            <div className="flex justify-center mt-4">
              <Button
                color="danger"
                onClick={closeModal}
                size="lg"
                variant="bordered"
                className="w-full text-red-600"
                disabled={isSubmitting}
              >
                Batal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
