"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { RadioGroup, Radio } from "@nextui-org/radio";
import Link from "next/link";
import { IoMdTime } from "react-icons/io";
import { FaTasks } from "react-icons/fa";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import AuthWrapper from "../../../../authWrapper";

export default function trialQuestionsMM() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(true); // Warning modal
  const [isEndModalOpen, setIsEndModalOpen] = useState(false); // End modals
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [selectedAnswers, setSelectedAnswers] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });

  // Timer countdown logic
  useEffect(() => {
    if (timeLeft === 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000); // Update every second

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

  // Close initial modal and start timer
  const handleModalAction = () => {
    setIsModalOpen(false);
    setTimerActive(true);
  };

  // Handle the 'Selesai dan lanjutkan' button click
  const handleButtonClick = () => {
    if (timeLeft > 0) {
      setIsEndModalOpen(true); // Show the end modal if time is not expired
    } else {
      router.push("/"); // If time is up, navigate directly
    }
  };

  // Handle 'Continue' action on the end modal
  const handleContinue = () => {
    setIsEndModalOpen(false);
    router.push("/test-ma/table"); // Proceed to next page
  };

  // Handle radio selection
  const handleAnswerSelect = (questionNumber, value) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionNumber]: value,
    }));
  };

  // Render questions
  const questions = [
    {
      number: 1,
      text: "Hewan apa yang memiliki ciri-ciri seram?",
      options: ["Hiu.", "Ular.", "Buaya.", "Anjing.", "Cheetah."],
    },
    {
      number: 2,
      text: "Mengapa sanksi seperti tilang sering kali tidak efektif dalam mengurangi parkir liar?",
      options: [
        "Memudahkan akses ke jalan raya.",
        "Mengurangi jumlah kendaraan di jalan.",
        "Membahayakan karena berjalan di jalan raya.",
        "Membuat pejalan kaki lebih disiplin.",
        "Menambah ruang publik bagi pejalan kaki.",
      ],
    },
    {
      number: 3,
      text: "Mengapa sanksi seperti tilang sering kali tidak efektif dalam mengurangi parkir liar?",
      options: [
        "Memudahkan akses ke jalan raya.",
        "Mengurangi jumlah kendaraan di jalan.",
        "Membahayakan karena berjalan di jalan raya.",
        "Membuat pejalan kaki lebih disiplin.",
        "Menambah ruang publik bagi pejalan kaki.",
      ],
    },
    {
      number: 4,
      text: "Mengapa sanksi seperti tilang sering kali tidak efektif dalam mengurangi parkir liar?",
      options: [
        "Memudahkan akses ke jalan raya.",
        "Mengurangi jumlah kendaraan di jalan.",
        "Membahayakan karena berjalan di jalan raya.",
        "Membuat pejalan kaki lebih disiplin.",
        "Menambah ruang publik bagi pejalan kaki.",
      ],
    },
  ];

  return (
    <AuthWrapper>
      <div className="pt-20 flex flex-col justify-start items-center min-h-screen bg-gray-100 p-4">
        {/* End Modal */}
        {isEndModalOpen && (
          <Modal
            isOpen={true}
            onClose={() => setIsEndModalOpen(false)}
            placement="top-center"
          >
            <ModalContent>
              {() => (
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
                    <Button
                      color=""
                      className="border-solid border-2 border-red-500 bg-red-100 text-red-600"
                      size="lg"
                      onPress={handleContinue}
                    >
                      Akhiri Test
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        )}

        {/* Questions */}
        <div className="space-y-5">
          {questions.map((question) => (
            <Card key={question.number} className="w-[50rem] h-fit px-12 py-6">
              <CardBody>
                <RadioGroup
                  className="space-y-2"
                  label={`Soal ${question.number}`}
                  labelPlacement="outside"
                  value={selectedAnswers[question.number]}
                  onValueChange={(value) =>
                    handleAnswerSelect(question.number, value)
                  }
                >
                  <p className="mb-3 text-justify">{question.text}</p>
                  {question.options.map((option, index) => (
                    <Radio key={index} value={String.fromCharCode(97 + index)}>
                      {option}
                    </Radio>
                  ))}
                </RadioGroup>
              </CardBody>
            </Card>
          ))}
        </div>

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
        <div className="flex justify-center items-center mt-10 mb-20">
          <Button
            color=""
            className="border-solid border-2 border-red-500 bg-red-100 text-red-600"
            size="lg"
            onPress={handleButtonClick}
          >
            Akhiri Test
          </Button>
        </div>
      </div>
    </AuthWrapper>
  );
}
