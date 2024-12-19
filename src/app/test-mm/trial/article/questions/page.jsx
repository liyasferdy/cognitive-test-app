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
import AuthWrapper from "../../../../authWrapper";

export default function TrialQuestionsMM() {
  const [isModalOpen, setIsModalOpen] = useState(true); // Warning modal
  const [isEndModalOpen, setIsEndModalOpen] = useState(false); // End modals
  const [isCorrectModalOpen, setIsCorrectModalOpen] = useState(false); // Correct answer modal
  const [isIncorrectModalOpen, setIsIncorrectModalOpen] = useState(false); // Incorrect answer modal
  const [isMissingAnswerModalOpen, setIsMissingAnswerModalOpen] =
    useState(false); // Missing answer modal
  const [isTimeUpModalOpen, setIsTimeUpModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // set time left
  const [timerId, setTimerId] = useState(null); // Track interval ID
  const router = useRouter(); // Inisialisasi useRouter
  const [selectedAnswers, setSelectedAnswers] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
  });

  //SAVE TIME
  // Load timeLeft from localStorage on component mount
  useEffect(() => {
    const savedTime = localStorage.getItem("timeLeft");
    if (savedTime) {
      setTimeLeft(parseInt(savedTime, 10));
    }
  }, []);

  // Save timeLeft to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("timeLeft", timeLeft);
  }, [timeLeft]);

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
      router.push("/test-mm/trial/article/"); // If time is up, navigate directly
    }
  };

  const handleNavigation = () => {
    router.push("/test-mm/article/1");
  };

  const handleReset = () => {
    router.push("/test-mm/instruction");
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

  // // Handle time-up modal close and redirect
  // const handleTimeUpContinue = () => {
  //   setIsTimeUpModalOpen(false);
  //   router.push("/test-mm/trial/article/questions"); // Redirect to the desired page
  // };

  // Render questions
  const questions = [
    {
      number: 1,
      text: "Mengapa sanksi seperti tilang sering kali tidak efektif dalam mengurangi parkir liar?",
      options: [
        "Memudahkan akses ke jalan raya.",
        "Mengurangi jumlah kendaraan di jalan.",
        "Membahayakan karena berjalan di jalan raya.",
        "Membuat pejalan kaki lebih disiplin.",
        "Menambah ruang publik bagi pejalan kaki.",
      ],
      correctAnswer: "Membahayakan karena berjalan di jalan raya.",
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
      correctAnswer: "Membahayakan karena berjalan di jalan raya.",
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
      correctAnswer: "Membahayakan karena berjalan di jalan raya.",
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
      correctAnswer: "Membahayakan karena berjalan di jalan raya.",
    },
    {
      number: 5,
      text: "Mengapa sanksi seperti tilang sering kali tidak efektif dalam mengurangi parkir liar?",
      options: [
        "Memudahkan akses ke jalan raya.",
        "Mengurangi jumlah kendaraan di jalan.",
        "Membahayakan karena berjalan di jalan raya.",
        "Membuat pejalan kaki lebih disiplin.",
        "Menambah ruang publik bagi pejalan kaki.",
      ],
      correctAnswer: "Membahayakan karena berjalan di jalan raya.",
    },
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
                    Jawaban anda masih salah. Silakan coba lagi
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
                <p>Silakan jawab semua pertanyaan sebelum melanjutkan.</p>
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
                    <p>Apakah Anda yakin ingin mengakhiri test ini?</p>
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
                  onChange={(e) =>
                    handleAnswerSelect(question.number, e.target.value)
                  }
                >
                  <p className="mb-3 text-justify">{question.text}</p>
                  {question.options.map((option, idx) => (
                    <Radio key={idx} value={option}>
                      {option}
                    </Radio>
                  ))}
                </RadioGroup>
              </CardBody>
            </Card>
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
        {/* Test Information */}
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
