"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { IoMdTime } from "react-icons/io";
import { FaTasks } from "react-icons/fa";
import { Input } from "@nextui-org/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import AuthWrapper from "../../../../authWrapper";
import { CiWarning } from "react-icons/ci";

export default function QuestionTrialMS() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(10); // 15 seconds countdown
  const [isModalOpen, setIsModalOpen] = useState(true); // Warning modal
  const [isEndModalOpen, setIsEndModalOpen] = useState(false); // End test modal
  const [isResultModalOpen, setIsResultModalOpen] = useState(false); // Result modal
  const [answer, setAnswer] = useState(""); // User answer input
  const [correctAnswer] = useState("1EU2"); // Correct answer for comparison
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false); // Track answer correctness
  const [isTimeoutModalOpen, setIsTimeoutModalOpen] = useState(false); // Time out modal
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

  // Timer countdown logic
  useEffect(() => {
    if (timeLeft === 0) {
      setIsTimeoutModalOpen(true); // Show timeout modal instead of direct navigation
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [timeLeft, router]);

  // Format time to mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // Handle the 'Submit and Finish Test' button click
  const handleSubmitAndFinish = () => {
    if (timeLeft > 0) {
      // Check if the answer is correct or not
      const isCorrect = answer.toUpperCase() === correctAnswer;
      setIsAnswerCorrect(isCorrect);
      setIsResultModalOpen(true); // Open result modal
      setIsEndModalOpen(false); // Close end modal
    } else {
      setIsTimeoutModalOpen(true); // Show timeout modal
    }
  };

  // Handle continue action after result modal
  const handleContinue = () => {
    setIsResultModalOpen(false); // Close result modal
    setIsTimeoutModalOpen(false); // Close timeout modal

    // Only navigate to next page if answer is correct
    if (isAnswerCorrect) {
      router.push("/test-mw/player/1"); // Navigate to the next question
    } else {
      // Reset for retry
      setAnswer(""); // Clear previous answer
      setTimeLeft(15); // Reset timer
    }
  };

  return (
    <AuthWrapper>
      <div className="pt-20 flex flex-col justify-start items-center min-h-screen bg-gray-100 p-4">
        {/* Timeout Modal */}
        {isTimeoutModalOpen && (
          <Modal
            isOpen={true}
            onClose={() => {
              setIsTimeoutModalOpen(false);
              handleContinue();
            }}
            placement="center"
          >
            <ModalContent>
              <>
                <ModalHeader className="flex flex-col gap-1 justify-center items-center">
                  <h3 className="text-lg font-semibold text-red-500">
                    Waktu Habis!
                  </h3>
                </ModalHeader>
                <ModalBody>
                  <p className="text-center">
                    Waktu anda telah habis. Silakan coba lagi.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onPress={handleContinue}>
                    Coba Lagi
                  </Button>
                </ModalFooter>
              </>
            </ModalContent>
          </Modal>
        )}

        {/* End Modal */}
        {isEndModalOpen && (
          <Modal
            isOpen={true}
            onClose={() => setIsEndModalOpen(false)}
            placement="center"
          >
            <ModalContent>
              <>
                <ModalHeader className="flex flex-col gap-1 justify-center items-center">
                  <h3 className="text-lg font-semibold">Konfirmasi</h3>
                </ModalHeader>
                <ModalBody>
                  <p>Apakah Anda yakin ingin mealanjutkan?</p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="error"
                    onPress={() => setIsEndModalOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button color="primary" onPress={handleSubmitAndFinish}>
                    Lanjutkan
                  </Button>
                </ModalFooter>
              </>
            </ModalContent>
          </Modal>
        )}

        {/* Result Modal (Correct or Incorrect answer feedback) */}
        {isResultModalOpen && (
          <Modal
            isOpen={true}
            onClose={() => setIsResultModalOpen(false)}
            placement="center"
          >
            <ModalContent>
              <>
                <ModalHeader className="flex flex-col gap-1 justify-center items-center">
                  <h3 className="text-lg font-semibold">
                    {isAnswerCorrect ? "Jawaban Benar!" : "Jawaban Salah"}
                  </h3>
                </ModalHeader>
                <ModalBody>
                  <p>
                    {isAnswerCorrect
                      ? "Jawaban Anda benar!"
                      : "Jawaban anda masih salah. Silakan coba lagi"}
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onPress={handleContinue}>
                    {isAnswerCorrect ? "Lanjutkan" : "Coba Lagi"}
                  </Button>
                </ModalFooter>
              </>
            </ModalContent>
          </Modal>
        )}

        {/* Warning Card */}
        <div
          className={`mb-5 items-center text-center ${
            isMobile ? "w-full" : "w-[600px]"
          }`}
        >
          <Card className="border-solid border-2 border-red-400 bg-red-100 text-red-600 text-center items-center text-md flex flex-col">
            <CardBody>
              <div className="flex items-center justify-center space-x-2">
                <CiWarning className="text-xl" />
                <h1 className={`${isMobile ? "text-sm" : "text-md"}`}>
                  Jawab sesuai audio yang telah didengar
                </h1>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Questions */}
        <div
          className={`space-y-5 mt-10 ${
            isMobile ? "w-[350px]" : "w-[50rem] px-12 py-6"
          }`}
        >
          <Card className={`${isMobile ? "w-full px-6" : "px-12 py-6"}`}>
            <CardBody>
              <h2
                className={`text-center text-neutral-600 mb-4 ${
                  isMobile ? "text-sm" : "text-md"
                }`}
              >
                Jawab di kolom berikut
              </h2>
              {/* Input field */}
              <div
                className={`flex w-full flex-wrap gap-4 bg-white p-6 rounded-lg ${
                  isMobile ? "flex-col" : "md:flex-nowrap"
                }`}
              >
                <Input
                  type="text"
                  placeholder="Input jawaban disini"
                  className="w-full"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-7">
          {isMobile && (
            <div className="w-full flex flex-row gap-2 p-2 fixed top-0 left-0 z-50 shadow-md bg-gray-100">
              {/* Test Card */}
              <Card className="flex flex-row items-center p-2 w-1/2 shadow-sm">
                <FaTasks className="text-2xl mr-2" />
                <div>
                  <h2 className="text-sm font-semibold">Test</h2>
                  <p className="text-xs">MW</p>
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
                    <p className="text-lg text-left mt-1 ml-16">MW</p>
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

          <div className="flex justify-center items-center">
            <Button color="primary" size="lg" onPress={handleSubmitAndFinish}>
              Submit
            </Button>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
