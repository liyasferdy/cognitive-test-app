"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  useDisclosure,
} from "@nextui-org/modal";
import AuthWrapper from "../../../../authWrapper";
import { CiWarning } from "react-icons/ci";

export default function questionTrialMW() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(15); // 5 minutes
  const [isModalOpen, setIsModalOpen] = useState(true); // Warning modal
  const [isEndModalOpen, setIsEndModalOpen] = useState(false); // End modals
  // const [selectedAnswers, setSelectedAnswers] = useState({
  //   1: null,
  //   2: null,
  //   3: null,
  //   4: null,
  // });

  // Timer countdown logic
  useEffect(() => {
    if (timeLeft === 0) {
      router.push("/test-mw/player/1");
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

  // Handle the 'Selesai dan lanjutkan' button click
  const handleButtonClick = () => {
    if (timeLeft > 0) {
      setIsEndModalOpen(true); // Show the end modal if time is not expired
    } else {
      router.push("/test-mw/player/1"); // If time is up, navigate directly
    }
  };

  // Handle 'Continue' action on the end modal
  const handleContinue = () => {
    setIsEndModalOpen(false);
    router.push("/test-mw/player/1"); // Proceed to next page
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

        <div className="mb-5 items-center text-center">
          <Card className="border-solid border-2 border-red-400 bg-red-100 text-red-600 text-center items-center text-md flex flex-col w-[600px]">
            <CardBody>
              <div className="flex items-center justify-center space-x-2">
                {" "}
                {/* Flexbox dengan jarak antar elemen */}
                <CiWarning className="text-xl" />{" "}
                {/* Ikon dengan ukuran yang sedikit lebih besar */}
                <h1 className="text-md">
                  Perhatikan format jawaban dan ditulis dalam huruf besar
                </h1>
                <h1 className="text-md font-semibold">(Contoh: XXXX)</h1>
                {/* Teks */}
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
                />
              </div>
            </CardBody>
            {/* <div className="flex justify-center items-center">
              <Link href="/test-ms/trial/player/questions">
                <Button
                  color="primary"
                  // className="border-solid border-2 border-red-500 bg-red-100 text-red-600"
                  size="lg"
                >
                  Selanjutnya
                </Button>
              </Link>
            </div> */}
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
            <Button
              color="primary"
              // className="border-solid border-2 border-red-500 bg-red-100 text-red-600"
              size="lg"
              onPress={handleButtonClick}
            >
              Submit dan Akhiri Test
            </Button>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
