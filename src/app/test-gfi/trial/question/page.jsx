"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { RadioGroup, Radio } from "@nextui-org/radio";
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
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { AiOutlineReload } from "react-icons/ai";
import AuthWrapper from "../../../authWrapper";

export default function TrialQuestionsVLS() {
  const [isModalOpen, setIsModalOpen] = useState(true); // Warning modal
  const [isEndModalOpen, setIsEndModalOpen] = useState(false); // End modals
  const [isCorrectModalOpen, setIsCorrectModalOpen] = useState(false); // Correct answer modal
  const [isIncorrectModalOpen, setIsIncorrectModalOpen] = useState(false); // Incorrect answer modal
  const [isMissingAnswerModalOpen, setIsMissingAnswerModalOpen] =
    useState(false); // Missing answer modal
  const [isTimeUpModalOpen, setIsTimeUpModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // set time left
  const [timerId, setTimerId] = useState(null); // Track interval ID
  const router = useRouter(); // Inisialisasi useRouter
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
      setIsTimeUpModalOpen(true); // Show time-up modal
      if (timerId) {
        clearInterval(timerId); // Clear timer if time reaches 0
        setTimerId(null);
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000); // Update every second

    setTimerId(interval); // Store interval ID

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [timeLeft]);

  // Format time to mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // Handle the 'Submit' button click
  const handleButtonClick = () => {
    // Stop the timer
    if (timerId) {
      clearInterval(timerId); // Clear the interval to stop the timer
      setTimerId(null); // Reset the timerId state
    }

    if (timeLeft > 0) {
      setIsEndModalOpen(true); // Show the end modal if time is not expired
    } else {
      router.push("/test-gfi/trial/questions/"); // If time is up, navigate directly
    }
  };

  const handleNavigation = () => {
    router.push("/test-gfi/questions");
  };

  const handleReset = () => {
    router.push("/test-gfi/instruction");
  };

  // Close initial modal and start timer
  const handleModalAction = () => {
    setIsModalOpen(false);
    setTimerActive(true);
  };

  // Handle 'Continue' action on the end modal
  const handleContinue = () => {
    setIsEndModalOpen(false);
    router.push("/"); // Proceed to next page
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

  // Handle the 'Batal' button click
  const handleCancel = () => {
    setIsEndModalOpen(false); // Close modal
    if (!timerId) {
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setTimerId(null);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      setTimerId(interval); // Restart timer
    }
  };

  // Define questions
  const questions = [
    {
      number: 1,
      options: [
        {
          value: "a",
          image: "/assets/soal-GFI/Contoh Gf-I/a.png",
        },
        {
          value: "b",
          image: "/assets/soal-GFI/Contoh Gf-I/b.png",
        },
        {
          value: "c",
          image: "/assets/soal-GFI/Contoh Gf-I/c.png",
        },
        {
          value: "d",
          image: "/assets/soal-GFI/Contoh Gf-I/d.png",
        },
        {
          value: "e",
          image: "/assets/soal-GFI/Contoh Gf-I/e.png",
        },
      ],
      correctAnswer: "e",
    },
    // Add more questions as needed
  ];

  return (
    <AuthWrapper>
      <div className="pt-20 flex flex-col justify-start items-center min-h-screen bg-gray-100 p-4">
        {/* Correct Answer Modal */}
        {isCorrectModalOpen && (
          <Modal
            isOpen={true}
            onClose={() => setIsCorrectModalOpen(false)}
            placement="center"
          >
            <ModalContent>
              <ModalHeader className="flex flex-col gap-1 justify-center items-center">
                <h3 className="text-lg font-semibold">Benar!</h3>
              </ModalHeader>
              <ModalBody>
                <div className="flex items-center gap-2">
                  <FaCheck className="text-green-500 text-xl" />
                  <p>Semua jawaban Anda benar!</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="warning"
                  className="text-amber-50"
                  onClick={handleReset}
                  // onPress={() => setIsCorrectModalOpen(false)}
                >
                  <AiOutlineReload className="text-xl" />
                  Ulangi latihan
                </Button>
                <Button
                  color="success"
                  className="text-emerald-50"
                  onClick={handleNavigation}
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
            placement="center"
          >
            <ModalContent>
              <ModalHeader className="flex flex-col gap-1 justify-center items-center">
                <h3 className="text-lg font-semibold">Salah!</h3>
              </ModalHeader>
              <ModalBody>
                <div className="flex items-center gap-2">
                  <RxCross2 className="text-red-500 text-xl" />
                  <p className="text-md">
                    Jawaban anda masih salah. Silahkan coba lagi
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  onPress={() => {
                    setIsIncorrectModalOpen(false);
                    handleReset();
                  }}
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
            placement="center"
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
            onClose={() => {
              setIsTimeUpModalOpen(false);
              handleReset(); // Pastikan handleReset dipanggil
            }}
            placement="center"
          >
            <ModalContent>
              <ModalHeader className="flex flex-col gap-1 justify-center items-center">
                <h3 className="text-lg font-semibold">Waktu Anda Habis</h3>
              </ModalHeader>
              <ModalBody className="text-center">
                <p>Mohon perhatikan waktu tersisa saat mengerjakan soal</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="warning"
                  className="text-amber-50"
                  onClick={() => {
                    handleReset(); // Jalankan handleReset langsung
                    setIsTimeUpModalOpen(false);
                  }}
                >
                  <AiOutlineReload className="text-xl" />
                  Ulangi
                </Button>
              </ModalFooter>
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
              {() => (
                <>
                  <ModalHeader className="flex flex-col gap-1 justify-center items-center">
                    <h3 className="text-lg font-semibold">Konfirmasi</h3>
                  </ModalHeader>
                  <ModalBody>
                    <p>Apakah Anda yakin ingin malanjutkan ?</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="error" onPress={handleCancel}>
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

        {/* Questions */}
        <div className="w-full max-w-4xl space-y-10">
          <div className="flex justify-center">
            <Card
              className={`border-solid border-2 border-amber-400 bg-amber-100 text-amber-600 text-center items-center text-md flex flex-col ${
                isMobile ? "w-[350px]" : "w-[600px]"
              }`}
            >
              <CardBody>
                <div className="text-center items-center justify-center">
                  <h1 className={`${isMobile ? "text-sm" : "text-lg"}`}>
                    Kerjakan contoh soal di bawah ini untuk menjawab soal
                    berikutnya
                  </h1>
                </div>
              </CardBody>
            </Card>
          </div>

          {questions.map((question) => (
            <div
              key={question.number}
              className="w-full flex flex-col items-center"
            >
              <Card className="space-y-3 p-10">
                <CardBody className="flex justify-center items-center p-5">
                  <img
                    width={300}
                    height={300}
                    alt={`Question ${question.number}`}
                    src="/assets/soal-GFI/Contoh Gf-I/Contoh .png"
                    className="object-contain"
                  />
                </CardBody>
                <RadioGroup
                  orientation="horizontal"
                  value={selectedAnswers[question.number] || ""}
                  onValueChange={(value) =>
                    handleAnswerSelect(question.number, value)
                  }
                  className="flex flex-row justify-center items-center space-x-4"
                >
                  {question.options.map((option) => (
                    <Radio key={option.value} value={option.value}>
                      <Card className="h-fit px-10 py-5 flex justify-center items-center">
                        <CardBody className="flex justify-center items-center">
                          <img
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

        <div className="flex justify-center items-center mt-10 mb-20">
          {/* Finish Test Button */}
          <Button
            color="primary"
            onPress={handleButtonClick}
            size="lg"
            className="mt-4"
          >
            Submit
          </Button>
        </div>

        {/* Sidebar */}

        {/* Sidebar for Mobile */}
        {isMobile && (
          <div className="w-full flex flex-row gap-2 p-2 fixed top-0 left-0 z-10 shadow-sm mb-4">
            {/* Test Card */}
            <Card className="flex flex-row items-center p-2 w-1/2 shadow-sm">
              <FaTasks className="text-2xl mr-2" />
              <div>
                <h2 className="text-sm font-semibold">Test</h2>
                <p className="text-xs">A3</p>
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

        {/* Sidebar for Dekstop */}
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
                    <p className="text-lg text-left mt-1 ml-16">A3</p>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Time Information */}
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
      </div>
    </AuthWrapper>
  );
}
