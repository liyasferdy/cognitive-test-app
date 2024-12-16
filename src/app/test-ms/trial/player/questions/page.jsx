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
  const [correctAnswer] = useState("2UE1"); // Correct answer for comparison
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false); // Track answer correctness
  const [isTimeoutModalOpen, setIsTimeoutModalOpen] = useState(false); // Time out modal

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
      router.push("/test-ms/player/1"); // Navigate to the next question
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
            placement="top-center"
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
            placement="top-center"
          >
            <ModalContent>
              <>
                <ModalHeader className="flex flex-col gap-1 justify-center items-center">
                  <h3 className="text-lg font-semibold">Konfirmasi</h3>
                </ModalHeader>
                <ModalBody>
                  <p>Apakah Anda yakin ingin mengakhiri test ini?</p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="error"
                    onPress={() => setIsEndModalOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button color="primary" onPress={handleSubmitAndFinish}>
                    Akhiri Test
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
            placement="top-center"
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
        <div className="mb-5 items-center text-center">
          <Card className="border-solid border-2 border-red-400 bg-red-100 text-red-600 text-center items-center text-md flex flex-col w-[600px]">
            <CardBody>
              <div className="flex items-center justify-center space-x-2">
                <CiWarning className="text-xl" />
                <h1 className="text-md">
                  Perhatikan format jawaban dan ditulis dalam huruf besar
                </h1>
                <h1 className="text-md font-semibold">(Contoh: XXXX)</h1>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Questions */}
        <div className="space-y-5 mt-10">
          <Card className="w-[50rem] h-fit px-12 py-6">
            <CardBody>
              <h2 className="text-center text-neutral-600 mb-4 text-md">
                Jawab dikolom berikut
              </h2>
              {/* Input field for answer */}
              <div className="flex w-full flex-wrap md:flex-nowrap gap-4 bg-white p-6 rounded-lg ">
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
                  <p className="text-lg text-left mt-1 ml-16">MS</p>
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

          <div className="flex justify-center items-center">
            <Button color="primary" size="lg" onPress={handleSubmitAndFinish}>
              Submit dan Akhiri Test
            </Button>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
