"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@nextui-org/card";
import { FaTasks } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { Image } from "@nextui-org/image";
import { Radio, RadioGroup } from "@nextui-org/radio";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { AiOutlineReload } from "react-icons/ai";
import AuthWrapper from "../../../../authWrapper";

export default function QuestionTrialMV() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(10); // times left to answer
  const [isEndModalOpen, setIsEndModalOpen] = useState(false); // End modals
  const [isModalOpen, setIsModalOpen] = useState(true); // Warning modal
  const [isCorrectModalOpen, setIsCorrectModalOpen] = useState(false); // Correct answer modal
  const [isIncorrectModalOpen, setIsIncorrectModalOpen] = useState(false); // Incorrect answer modal
  const [isMissingAnswerModalOpen, setIsMissingAnswerModalOpen] =
    useState(false); // Missing answer modal
  const [isTimeUpModalOpen, setIsTimeUpModalOpen] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({
    1: null,
  });
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
      // Redirect to the questions page when time runs out
      // router.push("/");
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
      router.push("/test-mv/image/0"); // If time is up, navigate directly
    }
  };

  // Handle 'Continue' action on the end modal
  const handleContinue = () => {
    setIsEndModalOpen(false);
    router.push("/test-mv/image/0"); // Proceed to next page
  };

  // Handle radio selection
  const handleAnswerSelect = (questionNumber, value) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionNumber]: value,
    }));
  };

  // Check if all answers are correct
  const checkAnswers = () => {
    const allCorrect = Object.keys(selectedAnswers).every((questionNum) => {
      const selected = selectedAnswers[questionNum];
      const correctAnswer = questions.find(
        (q) => q.number === parseInt(questionNum)
      )?.correctAnswer;
      return selected === correctAnswer;
    });
    return allCorrect;
  };

  // Handle finish test and show modal
  const handleFinishTest = () => {
    // Check if there are unanswered questions
    const unansweredQuestions = Object.keys(selectedAnswers).filter(
      (questionNum) => selectedAnswers[questionNum] === null
    );

    if (unansweredQuestions.length > 0) {
      // If there are unanswered questions, show the warning modal
      setIsMissingAnswerModalOpen(true);
      setIsEndModalOpen(false);
    } else {
      const isAllCorrect = checkAnswers();
      if (isAllCorrect) {
        setIsCorrectModalOpen(true); // Show "Correct" modal
      } else {
        setIsIncorrectModalOpen(true); // Show "Incorrect" modal
      }
      setIsEndModalOpen(false);
    }
  };

  // Define questions
  const questions = [
    {
      number: 1,
      options: [
        {
          value: "a",
          image: "/assets/soal-MV/CONTOH - A.png",
        },
        {
          value: "b",
          image: "/assets/soal-MV/CONTOH - B.png",
        },
        {
          value: "c",
          image: "/assets/soal-MV/CONTOH - C.png",
        },
        {
          value: "d",
          image: "/assets/soal-MV/CONTOH - D (KEY).png",
        },
        {
          value: "e",
          image: "/assets/soal-MV/CONTOH - E.png",
        },
      ],
      correctAnswer: "d",
    },
    // Add more questions as needed
  ];

  return (
    <AuthWrapper>
      <div className="flex justify-center items-center min-h-screen px-4">
        {/* Correct Answer Modal */}
        {isCorrectModalOpen && (
          <Modal
            isOpen={true}
            onClose={() => setIsCorrectModalOpen(false)}
            placement="top-center"
          >
            <ModalContent>
              <ModalHeader className="flex flex-col gap-1 justify-center items-center">
                <h3 className="text-lg font-semibold">Benar!</h3>
              </ModalHeader>
              <ModalBody>
                <div className="flex items-center gap-2">
                  <FaCheck className="text-green-500 text-xl" />
                  <p>Jawaban Anda benar!</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="warning"
                  className="text-amber-50"
                  onPress={() => router.push("/test-mv/image/0")}
                >
                  <AiOutlineReload className="text-xl" />
                  Ulangi latihan
                </Button>
                <Button
                  color="primary"
                  className="text-emerald-50"
                  onPress={() => handleContinue()}
                >
                  Mulai Test
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}

        {/* Incorrect Answer Modal */}
        {isIncorrectModalOpen && (
          <Modal
            isOpen={true}
            onClose={() => setIsIncorrectModalOpen(false)}
            placement="top-center"
          >
            <ModalContent>
              <ModalHeader className="flex flex-col gap-1 justify-center items-center">
                <h3 className="text-lg font-semibold">Salah!</h3>
              </ModalHeader>
              <ModalBody>
                <div className="flex items-center gap-2">
                  <RxCross2 className="text-red-500 text-xl" />
                  <p className="text-md">
                    Jawaban anda masih salah. Silakan coba lagi!
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  onPress={() => setIsIncorrectModalOpen(false)}
                  color="warning"
                  className="text-amber-50"
                >
                  <AiOutlineReload className="text-xl" />
                  Ulangi
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}

        {/* Missing Answer Modal */}
        {isMissingAnswerModalOpen && (
          <Modal
            isOpen={true}
            onClose={() => setIsMissingAnswerModalOpen(false)}
            placement="top-center"
          >
            <ModalContent>
              <ModalHeader className="flex flex-col gap-1 justify-center items-center">
                <h3 className="text-lg font-semibold">Peringatan</h3>
              </ModalHeader>
              <ModalBody>
                <p>Silahkan jawab semua pertanyaan sebelum melanjutkan.</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="warning"
                  className="text-amber-50"
                  onPress={() => setIsMissingAnswerModalOpen(false)}
                >
                  OK
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}

        {/* Time up Modal */}
        {isTimeUpModalOpen && (
          <Modal
            isOpen={true}
            onClose={() => setIsTimeUpModalOpen(false)}
            placement="top-center"
          >
            <ModalContent>
              <ModalHeader className="flex flex-col gap-1 justify-center items-center">
                <h3 className="text-lg font-semibold">Waktu Anda Habis</h3>
              </ModalHeader>
              <ModalBody className="text-center">
                <p>Mohon perhatikan waktu tersisa saat mengerjakan soal</p>
              </ModalBody>
              <ModalFooter>
                <Link href="/test-mv/instruction">
                  <Button color="warning" className="text-amber-50">
                    <AiOutlineReload className="text-xl" />
                    Ulangi
                  </Button>
                </Link>{" "}
              </ModalFooter>
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
              {() => (
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
                    <Button
                      color=""
                      className="border-solid border-2 border-red-500 bg-red-100 text-red-600"
                      size="md"
                      onPress={handleFinishTest}
                    >
                      Lanjutkan
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        )}

        {/* Main content */}
        <div className="w-full flex justify-center items-center">
          {/* Main content */}
          <div
            className={`flex flex-col justify-center items-center ${
              isMobile
                ? "w-full px-4 top-[90px]"
                : "w-[1000px] -mt-10 top-[400px] -right-40 transform -translate-x-1/2 -translate-y-1/2"
            } absolute`}
          >
            <Card
              className={`w-full ${
                isMobile ? "max-w-[90%] px-4 py-6" : "w-[1000px]"
              }`}
            >
              <CardBody className="flex flex-col justify-center items-center p-6">
                <h2
                  className={`${
                    isMobile ? "text-lg mb-6" : "text-xl mb-10"
                  } font-semibold text-center`}
                >
                  Pilih salah satu yang sesuai dengan gambar sebelumnya
                </h2>

                {/* Render questions */}
                {questions.map((question) => (
                  <RadioGroup
                    key={question.number}
                    orientation={isMobile ? "vertical" : "horizontal"}
                    className={`${
                      isMobile
                        ? "flex flex-col space-y-4 items-center"
                        : "flex flex-row justify-center items-center space-x-4"
                    }`}
                  >
                    {question.options.map((option) => (
                      <Radio
                        key={option.value}
                        value={option.value}
                        onChange={() =>
                          handleAnswerSelect(question.number, option.value)
                        }
                        className="flex justify-center items-center"
                      >
                        <Card
                          className={`h-fit ${
                            isMobile ? "px-6 py-4" : "px-10 py-5"
                          } flex justify-center items-center`}
                        >
                          <CardBody className="flex justify-center items-center">
                            <Image
                              width={isMobile ? 80 : 150}
                              height={isMobile ? 80 : 150}
                              alt="Contoh Soal"
                              src={option.image}
                              className="object-contain"
                            />
                          </CardBody>
                        </Card>
                      </Radio>
                    ))}
                  </RadioGroup>
                ))}
              </CardBody>
            </Card>
            {/* Tombol Lanjutkan */}
            <div
              className={`w-full flex justify-center ${
                isMobile ? "mt-10 mb-5" : "fixed -bottom-20 left-0"
              }`}
            >
              <Button
                color="primary"
                size="lg"
                className="w-full max-w-[200px] mx-auto"
                onPress={handleButtonClick}
              >
                Lanjutkan ke Test
              </Button>
            </div>
          </div>

          {/* Side Panel */}
          {isMobile && (
            <div className="w-full flex flex-row gap-2 p-2 fixed top-0 left-0 z-10 shadow-md bg-gray-100">
              {/* Test Card */}
              <Card className="flex flex-row items-center p-2 w-1/2 shadow-sm">
                <FaTasks className="text-2xl mr-2" />
                <div>
                  <h2 className="text-sm font-semibold">Test</h2>
                  <p className="text-xs">Memory Visual</p>
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
            <div className="space-y-7 flex-grow">
              <div className="absolute top-20 left-20 w-[270px] ml-20">
                <Card>
                  <FaTasks className="text-5xl absolute top-4 left-2" />
                  <CardBody>
                    <div className="flex text-left items-start justify-center ">
                      <h2 className=" text-xl font-semibold text-left mr-20">
                        Test
                      </h2>
                    </div>
                    <div className="flex items-center justify-start">
                      <p className="text-lg text-left mt-1 ml-16">
                        Memory Visual
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
                      <h2 className=" text-xl font-semibold text-left ml-4">
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
        </div>
      </div>
    </AuthWrapper>
  );
}
