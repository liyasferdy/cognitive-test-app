"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardBody } from "@nextui-org/card";
import { FaTasks } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { Image } from "@nextui-org/image";
// import { Button } from "@nextui-org/button";
import { imageData } from "../../../image"; // Pastikan path sesuai
import axios from "axios"; // Import axios
import { RadioGroup } from "@nextui-org/radio";
import { Radio } from "@nextui-org/radio";
import { Button } from "@nextui-org/button";
import AuthWrapper from "../../../../authWrapper";

export default function QuestionMV() {
  const router = useRouter();
  const params = useParams();
  const imageNumber = parseInt(params.number, 10);
  const [timeLeft, setTimeLeft] = useState(5);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Cek validitas imageNumber
  const isValidImageNumber = imageNumber >= 0 && imageNumber < imageData.length;
  let currentImageData = null;
  if (isValidImageNumber) {
    currentImageData = imageData[imageNumber];
  }

  // Timer
  useEffect(() => {
    // Jika tidak valid, jangan jalankan logika timer
    if (!isValidImageNumber) return;

    if (timeLeft === 0) {
      // Waktu habis, lanjut ke pertanyaan berikutnya atau akhiri
      if (imageNumber < imageData.length - 1) {
        router.push(`/test-mv/image/${imageNumber + 2}`);
      } else {
        // Jika ini pertanyaan terakhir, buka modal atau langsung akhiri
        setShowModal(true);
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, router, imageNumber, isValidImageNumber]);

  // Format waktu
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const handleAnswerChange = (value) => {
    setSelectedAnswer(value);
  };

  // Fungsi untuk mengirim jawaban saat ini ke backend
  const submitAnswers = async (isFinalSubmission = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : "";

      // Siapkan jawaban dengan nilai default jika kosong
      const answerToSubmit = selectedAnswer || "9"; // Default to "9" if no answer

      const response = await axios.post(
        "https://cognitive-dev-734522323885.asia-southeast2.run.app/submit/testMV",
        {
          answers: [
            {
              questionNumber: imageNumber,
              selectedAnswer: answerToSubmit,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Sertakan token dalam header
          },
        }
      );

      if (response.status === 200) {
        if (imageNumber < imageData.length - 1 && !isFinalSubmission) {
          // Pertanyaan berikutnya
          router.push(`/test-mv/image/${imageNumber + 2}`);
        } else if (isFinalSubmission) {
          // Jika final, tampilkan modal konfirmasi submit final
          setShowModal(true);
        } else {
          // Jika ini pertanyaan terakhir dan user menekan Submit
          // Langsung tampilkan modal konfirmasi akhir test
          setShowModal(true);
        }
      } else {
        alert("There was an issue submitting your answers. Please try again.");
      }
    } catch (error) {
      console.log("Error submitting answers:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // // Fungsi untuk mengakhiri test (menyimpan semua jawaban di memory ke DB)
  // const handleFinalAnswerSubmit = async () => {
  //   if (isSubmitting) return;
  //   setIsSubmitting(true);

  //   try {
  //     const response = await axios.post(
  //       "https://cognitive-dev-734522323885.asia-southeast2.run.app/answers/savetoDB",
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${
  //             typeof window !== "undefined"
  //               ? localStorage.getItem("access_token")
  //               : ""
  //           }`,
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       router.push("/test-ms/instruction");
  //     } else {
  //       alert("Failed to finalize answers. Please try again.");
  //     }
  //   } catch (error) {
  //     console.log("Error finalizing answers:", error);
  //     alert("An error occurred while finalizing answers. Please try again.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  return (
    <AuthWrapper>
      <div className="flex justify-center items-center min-h-screen px-4 bg-gray-50">
        {/* Jika imageNumber tidak valid, tampilkan pesan error */}
        {!isValidImageNumber ? (
          <div className="text-center text-lg font-semibold">
            Invalid image number
          </div>
        ) : (
          <div className="w-full flex flex-col justify-start items-center">
            {/* Sidebar */}
            {isMobile && (
              <div className="w-full flex flex-row gap-2 p-2 fixed top-0 left-0 z-50 shadow-md bg-gray-100">
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
              <div className="absolute top-20 left-20 space-y-7">
                <Card className="w-[270px] shadow-md">
                  <FaTasks className="text-5xl absolute top-4 left-2" />
                  <CardBody>
                    <div className="flex text-left items-start justify-center">
                      <h2 className="text-xl font-semibold text-left">Test</h2>
                    </div>
                    <div className="flex items-center justify-start">
                      <p className="text-lg text-left mt-1 ml-16">
                        Memory Visual
                      </p>
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

            {/* Konten Utama */}
            <div
              className={`flex flex-col justify-center items-center ${
                isMobile ? "w-full px-4 mt-20" : "w-[1000px] mt-20"
              }`}
            >
              <Card
                className={`w-full ${isMobile ? "max-w-[90%] mt-100" : ""}`}
              >
                <CardBody className="flex flex-col justify-center items-center p-6">
                  <h2
                    className={`${
                      isMobile ? "text-lg mb-6" : "text-xl mb-10"
                    } font-semibold text-center`}
                  >
                    Pilih salah satu
                  </h2>
                  <RadioGroup
                    orientation={isMobile ? "vertical" : "horizontal"}
                    className={`${
                      isMobile
                        ? "flex flex-col space-y-4 items-center"
                        : "flex flex-row justify-center items-center space-x-4"
                    }`}
                    value={selectedAnswer}
                    onValueChange={handleAnswerChange}
                  >
                    {currentImageData.options.map((option) => (
                      <Radio
                        key={option.value}
                        value={option.value}
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

            {/* Tombol Lanjutkan */}
            <div className="w-full flex justify-center mt-10 mb-10">
              <Button
                color="primary"
                size="lg"
                className="w-full max-w-[200px]"
                onClick={() => {
                  if (imageNumber < imageData.length - 1) {
                    submitAnswers(false); // Kirim jawaban saat ini
                    // router.push(`/test-mv/image/${imageNumber + 2}`); // Navigasi ke pertanyaan berikutnya
                  } else {
                    submitAnswers(true); // Final submit
                  }
                }}
                disabled={isSubmitting}
              >
                {imageNumber < imageData.length - 1 ? "Lanjutkan" : "Submit"}
              </Button>
            </div>
          </div>
        )}

        {/* Modals */}
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
                  onClick={() => router.push("/test-ms/instruction")}
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
      </div>
    </AuthWrapper>
  );
}
