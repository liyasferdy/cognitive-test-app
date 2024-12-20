"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import Link from "next/link";
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
import { audioData } from "../../../audio"; // Import your audio data
import axios from "axios"; // Import axios

export default function QuestionsMW() {
  const router = useRouter();
  const { id } = useParams();
  const [timeLeft, setTimeLeft] = useState(10); // Contoh: 10 detik untuk pengujian
  const [isModalOpen, setIsModalOpen] = useState(true); // Warning modal
  const [isEndModalOpen, setIsEndModalOpen] = useState(false); // End modals
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showModal, setShowModal] = useState(false);
  // New state to track submitted answers
  const [submittedAnswers, setSubmittedAnswers] = useState([]);

  const nextId = parseInt(id, 10) + 1; // Increment the ID by 1
  const isLastQuestion = parseInt(id, 10) === audioData.length; // Cek apakah ini soal terakhir

  // Find the current audio data based on the ID
  useEffect(() => {
    const audio = audioData.find(
      (audioItem) => audioItem.id === parseInt(id, 10)
    );
    if (audio) {
      setCurrentAudio(audio);
    } else {
      // Jika audio dengan id ini tidak ditemukan, langsung balik ke /home
      router.push("/home");
    }
  }, [id, router]);

  // Timer countdown logic
  useEffect(() => {
    if (timeLeft <= 0) {
      // Jika waktunya habis
      if (isLastQuestion) {
        // Jika soal terakhir, langsung ke halaman home
        router.push("/home");
      } else {
        // Jika bukan soal terakhir, langsung ke soal berikutnya
        router.push(`/test-mw/player/${nextId}`);
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, router, nextId, isLastQuestion]);

  // Format time to mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // Modified function to submit individual question answers
  const submitAnswer = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : "";

      const processedAnswer = selectedAnswer.trim().toUpperCase();

      const response = await axios.post(
        "https://cognitive-dev-734522323885.asia-southeast2.run.app/submit/testMW",
        {
          answers: [
            {
              questionNumber: currentAudio?.id,
              selectedAnswer: processedAnswer,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Track submitted answer
        setSubmittedAnswers((prev) => [
          ...prev,
          {
            questionNumber: currentAudio?.id,
            selectedAnswer: processedAnswer,
          },
        ]);

        // For non-last questions, move to next question
        if (!isLastQuestion) {
          router.push(`/test-mw/player/${nextId}`);
          setSelectedAnswer("");
        }
      } else {
        throw new Error("Gagal mengirim jawaban");
      }
    } catch (error) {
      console.error(
        "Error submitting answers:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.message ||
          "Terjadi kesalahan saat mengirim jawaban. Silakan coba lagi."
      );
      throw error; // Rethrow to be caught by the caller
    } finally {
      setIsSubmitting(false);
    }
  };

  // Button click handler
  const handleButtonClick = async () => {
    if (!selectedAnswer) {
      alert("Harap masukkan jawaban terlebih dahulu.");
      return;
    }

    // Submit the last question's answer first
    await submitAnswer();

    // If it's the last question, proceed with final submission
    if (isLastQuestion) {
      await handleFinalAnswerSubmit();
    }
  };

  // Modified final submission function
  const handleFinalAnswerSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : "";

      const response = await axios.post(
        "https://cognitive-dev-734522323885.asia-southeast2.run.app/answers/savetoDB",
        {
          answers: submittedAnswers, // Send all previously submitted answers
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        router.push("/home");
      } else {
        alert("Gagal menyimpan jawaban. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error finalizing answers:", error);
      alert("Terjadi kesalahan saat menyimpan jawaban. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                    <p>Apakah Anda yakin ingin melanjutkan?</p>
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
                      onPress={() => {
                        setIsEndModalOpen(false);
                        router.push(`/test-mw/player/${nextId}`);
                      }}
                    >
                      Lanjutkan
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        )}

        {/* Modal for final submission */}
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
                  onClick={handleFinalAnswerSubmit}
                  size="lg"
                  className="w-full text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
              <div className="flex justify-center mt-4">
                <Button
                  color="danger"
                  onClick={() => setShowModal(false)}
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

        {/* Warning Message */}
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
              <div className="flex w-full flex-wrap md:flex-nowrap gap-4 bg-white p-6 rounded-lg ">
                <Input
                  type="text"
                  placeholder="Input jawaban disini"
                  className="w-full"
                  value={selectedAnswer}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
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
                <div className="flex text-left items-start justify-center ">
                  <h2 className="text-xl font-semibold text-left mr-20">
                    Test
                  </h2>
                </div>
                <div className="flex items-center justify-start">
                  <p className="text-lg text-left mt-1 ml-16">MW</p>
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
            <Button
              color="primary"
              size="lg"
              onPress={handleButtonClick}
              className="mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Mengirim..."
                : isLastQuestion
                ? "Lanjutkan"
                : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
