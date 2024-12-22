"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardBody } from "@nextui-org/card";
import { FaTasks } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { Image } from "@nextui-org/image";
// import { Button } from "@nextui-org/button";
import { imageData } from "../../image"; // Sesuaikan path sesuai dengan struktur proyek Anda
import AuthWrapper from "../../../authWrapper";

export default function TestMV() {
  const router = useRouter();
  const params = useParams();
  const imageNumber = parseInt(params.number, 10); // Convert to 0-based index
  const [timeLeft, setTimeLeft] = useState(15); // Sesuaikan waktu sesuai kebutuhan
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
      router.push(`/test-mv/imageEasy/${imageNumber}/questions`);
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

  // // Fungsi untuk ke halaman pertanyaan selanjutnya (opsional, jika diperlukan)
  // const handleNextQuestion = () => {
  //   router.push(`/test-mv/imageEasy/${parseInt(params.number, 10)}/questions`);
  // };

  return (
    <AuthWrapper>
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        {/* Jika imageNumber tidak valid, tampilkan pesan error */}
        {!isValidImageNumber ? (
          <div className="text-center text-lg font-semibold">
            Invalid image number
          </div>
        ) : (
          <>
            {/* Sidebar */}
            {/* Sidebar for Mobile */}
            {isMobile && (
              <div className="w-full flex flex-row gap-2 p-2 fixed top-0 left-0 z-10 shadow-md bg-gray-100">
                {/* Test Card */}
                <Card className="flex flex-row items-center p-2 w-1/2 shadow-sm">
                  <FaTasks className="text-2xl mr-2" />
                  <div>
                    <h2 className="text-sm font-semibold">Test</h2>
                    <p className="text-xs">Meaningful Memory</p>
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

            {/* Sidebar for Desktop */}
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
                        Mental Ability
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

            {/* Main Content */}
            <div className="flex justify-center mb-8 w-full px-4">
              <Card className="w-full max-w-[600px] overflow-hidden shadow-md">
                <CardBody className="flex justify-center items-center">
                  <Image
                    width={isMobile ? 300 : 400} // Sesuaikan ukuran gambar berdasarkan perangkat
                    height={isMobile ? 300 : 400}
                    alt={`Question ${currentImageData.number}`}
                    src={currentImageData.image}
                    className="object-contain"
                  />
                </CardBody>
              </Card>
            </div>
          </>
        )}
      </div>
    </AuthWrapper>
  );
}
