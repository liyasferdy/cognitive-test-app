"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@nextui-org/card";
import { FaTasks } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { CiWarning } from "react-icons/ci";
import AuthWrapper from "../../../authWrapper";

export default function TrialVZ() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(true); // Warning modal
  const [isEndModalOpen, setIsEndModalOpen] = useState(false); // End modal
  const [timeLeft, setTimeLeft] = useState(20);
  const [timerActive, setTimerActive] = useState(false);
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
    if (timerActive && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (timeLeft === 0) {
      // Redirect to the questions page when time runs out
      router.push("/test-vz/trial/picture/questions");
      setTimerActive(true);
    }
  }, [timeLeft, timerActive]);

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
      router.push("/test-vz/trial/picture/questions"); // If time is up, navigate directly
    }
  };

  // Handle 'Continue' action on the end modal
  const handleContinue = () => {
    setIsEndModalOpen(false);
    router.push("/test-vz/trial/picture/questions"); // Proceed to next page
  };

  // Soal
  return (
    <AuthWrapper>
      <div className="pt-20 flex flex-col justify-between items-center min-h-screen">
        {/* First Modal */}
        {isModalOpen && (
          <Modal isOpen={true} onClose={handleModalAction} placement="center">
            <ModalContent>
              {() => (
                <>
                  <ModalHeader className="flex flex-col gap-1 justify-center items-center">
                    <h3 className="text-lg font-semibold">Perhatian</h3>
                  </ModalHeader>
                  <ModalBody>
                    <Card className="border-solid border-2 border-amber-400 bg-amber-100 text-amber-600 text-center items-center text-md flex flex-col">
                      <CardBody className="flex justify-center items-center">
                        <div className="flex items-center gap-2">
                          <CiWarning className="text-2xl" />
                          <p>Bagian ini merupakan percobaan</p>
                        </div>
                      </CardBody>
                    </Card>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onPress={handleModalAction}>
                      Lanjutkan
                    </Button>
                  </ModalFooter>
                </>
              )}
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
                    <p>Apakah Anda yakin ingin melanjutkan?</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="error"
                      onPress={() => setIsEndModalOpen(false)}
                    >
                      Batal
                    </Button>
                    <Button color="primary" onPress={handleContinue}>
                      Lanjutkan
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        )}
        <div className={` ${isMobile ? "mt-[-10px]" : "mt-[10px]"}`}>
          <div className="mb-5 flex flex-col items-center justify-center text-center">
            <Card
              className={`border-solid border-2 border-amber-400 bg-amber-100 text-amber-600 text-center items-center text-md flex flex-col ${
                isMobile ? "w-full max-w-[90%] px-4 py-4" : "w-[800px]"
              }`}
            >
              <CardBody>
                <div className="text-center">
                  <h1 className={`${isMobile ? "text-sm" : "text-lg"}`}>
                    Perhatikan gambar dibawah ini untuk menjawab soal berikutnya
                  </h1>
                </div>
              </CardBody>
            </Card>
          </div>

          <div
            className={`flex justify-center ${
              isMobile ? "mt-[-10px]" : "mt-[10px]"
            }`}
          >
            <Card
              className={`${
                isMobile
                  ? "w-full max-w-[90%] px-4 py-6"
                  : "w-[50rem] px-20 py-10"
              } h-fit`}
            >
              <CardBody className="flex justify-center items-center">
                <Image
                  width={isMobile ? 300 : 500} // Responsif untuk ukuran gambar
                  height={isMobile ? 300 : 500} // Responsif untuk ukuran gambar
                  alt="Contoh Soal"
                  src="/assets/soal-VZ/Contoh Gv-Vz/Contoh.png"
                  className="object-contain"
                />
              </CardBody>
            </Card>
          </div>
        </div>

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

        <div
          className={`flex justify-center items-center absolute bottom-20 w-full${
            isMobile ? "mt-[-10px] bottom-10" : "mt-[10px] "
          }`}
        >
          <Button
            color="primary"
            // className="bg-cyan-500 text-white hover:bg-cyan-700 hover:text-slate-100"
            size="lg"
            onPress={handleButtonClick}
          >
            <h2 className="items-center text-center">Lanjutkan</h2>
          </Button>
        </div>
      </div>
    </AuthWrapper>
  );
}
