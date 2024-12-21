"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardBody } from "@nextui-org/card";
import { FaTasks } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { Image } from "@nextui-org/image";
// import { Button } from "@nextui-org/button";
import { imageData } from "../../image"; // Sesuaikan path sesuai dengan struktur proyek Anda

export default function TestVZ() {
  const router = useRouter();
  const params = useParams();
  const imageNumber = parseInt(params.number, 10); // Convert to 0-based index
  const [timeLeft, setTimeLeft] = useState(10); // Sesuaikan waktu sesuai kebutuhan

  // Validasi imageNumber
  const isValidImageNumber = imageNumber >= 0 && imageNumber < imageData.length;
  let currentImageData = null;
  if (isValidImageNumber) {
    currentImageData = imageData[imageNumber];
  }

  // Timer countdown logic
  useEffect(() => {
    if (!isValidImageNumber) return; // Jika tidak valid, skip logic time

    if (timeLeft === 0) {
      // Jika waktu habis, pindah ke halaman pertanyaan untuk image selanjutnya
      router.push(`/test-vz/image/${imageNumber + 1}/questions`);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, router, imageNumber, isValidImageNumber]);

  // Format waktu ke mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // Fungsi untuk ke halaman pertanyaan selanjutnya (opsional, jika diperlukan)
  const handleNextQuestion = () => {
    router.push(`/test-vz/image/${parseInt(params.number, 10)}/questions`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      {/* Jika imageNumber tidak valid, tampilkan pesan error */}
      {!isValidImageNumber ? (
        <div>Invalid image number</div>
      ) : (
        // Jika valid, tampilkan konten utama
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
                  <p className="text-lg text-left mt-1 ml-16">Memory Visual</p>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="absolute top-40 left-20 w-[270px] ml-20">
            <Card>
              <IoMdTime className="text-6xl absolute top-3 left-2" />
              <CardBody>
                <div className="flex text-left items-start justify-center">
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

          <div className="flex justify-center mb-8">
            <Card className="w-full max-w-[600px]">
              <CardBody className="flex justify-center items-center">
                <Image
                  width={400}
                  height={400}
                  alt={`Question ${currentImageData.number}`}
                  src={currentImageData.image}
                  className="object-contain"
                />
              </CardBody>
            </Card>
          </div>

          {/* Tombol untuk ke pertanyaan, jika diperlukan */}
          {/* <div className="flex justify-center">
            <Button
              color="primary"
              variant="solid"
              size="lg"
              onClick={handleNextQuestion}
            >
              Next to Questions
            </Button>
          </div> */}
        </div>
      )}
    </div>
  );
}
