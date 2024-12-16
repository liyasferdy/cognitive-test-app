"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@nextui-org/card";
import { IoMdTime } from "react-icons/io";
import { FaTasks } from "react-icons/fa";
import { FaCirclePlay } from "react-icons/fa6";
import { HiSpeakerWave } from "react-icons/hi2";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { CiWarning } from "react-icons/ci";
import { Button } from "@nextui-org/button";
import AuthWrapper from "../../../authWrapper";

export default function TrialTestMS() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(10); // set time left
  const audioRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(true); // Warning modal
  const [isEndModalOpen, setIsEndModalOpen] = useState(false); // End modal
  const [timerActive, setTimerActive] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false); // Menyimpan status apakah audio sudah diputar
  const [isPlaying, setIsPlaying] = useState(false); // Menyimpan status apakah audio sedang diputar
  const [hasFinished, setHasFinished] = useState(false); // Menyimpan status apakah audio sudah selesai

  // Timer countdown logic
  useEffect(() => {
    if (timeLeft === 0) {
      router.replace("/test-ms/trial/player/questions");
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

  // Handle the audio end event to prevent replay
  const handleAudioEnd = () => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0; // Reset to the beginning
    }
    setIsPlaying(false);
  };

  // Handle play button click
  const handlePlay = () => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.play();
      setIsPlaying(true); // Menandakan audio sedang diputar
      setHasPlayed(true); // Menandakan audio sudah diputar
      audioElement.onended = () => {
        // Ketika audio selesai diputar
        setIsPlaying(false); // Mengubah status menjadi tidak sedang diputar
        setHasFinished(true); // Menandakan audio sudah selesai
      };
    }
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
      router.push("/test-ms/trial/player/questions"); // If time is up, navigate directly
    }
  };

  // Handle 'Continue' action on the end modal
  const handleContinue = () => {
    setIsEndModalOpen(false);
    router.push("/test-ms/trial/player/questions"); // Proceed to next page
  };

  return (
    <AuthWrapper>
      <div className="pt-20 flex flex-col justify-start items-center min-h-screen bg-gray-100 p-4">
        {/* First Modal */}
        {isModalOpen && (
          <Modal
            isOpen={true}
            onClose={handleModalAction}
            placement="top-center"
          >
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
                    <p className="text-justify">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Nullam pulvinar risus non risus hendrerit venenatis.
                      Pellentesque sit amet hendrerit risus, sed porttitor quam.
                    </p>
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
                    <Button color="primary" onPress={handleContinue}>
                      Lanjutkan
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        )}
        <div className="mb-5 items-center text-center">
          <Card className="border-solid border-2 border-amber-400 bg-amber-100 text-amber-600 text-center items-center text-md flex flex-col w-[600px]">
            <CardBody>
              <div className="text-center">
                <h1>
                  Dengarkan audio dibawah ini untuk menjawab soal berikutnya
                </h1>
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="mb-5 items-center text-center">
          <Card className="border-solid border-2 border-red-400 bg-red-100 text-red-600 text-center items-center text-md flex flex-col w-[600px]">
            <CardBody>
              <div className="flex items-center justify-center space-x-2">
                {" "}
                {/* Flexbox dengan jarak antar elemen */}
                <CiWarning className="text-xl" />{" "}
                {/* Ikon dengan ukuran yang sedikit lebih besar */}
                <h1 className="text-md">
                  Audio hanya diputar sekali dan tidak dapat diulang
                </h1>
              </div>
            </CardBody>
          </Card>
        </div>
        {/* Questions */}
        <div className="p-6 mt-5">
          <Card className="w-[600px] h-[160px]">
            <CardBody>
              <h2 className="text-lg text-center mt-5 mb-4">
                Klik untuk mendengarkan audio
              </h2>
              <div className="relative space-y-5">
                <audio
                  ref={audioRef}
                  className="w-full rounded-lg"
                  onEnded={handleAudioEnd}
                  controlsList="nodownload noplaybackrate noseek"
                  disablePictureInPicture
                >
                  <source src="/assets/audio/2UE1.mp3" type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
                {/* Menampilkan tombol Play Audio jika belum diputar */}
                {!isPlaying && !hasPlayed && (
                  <button
                    onClick={handlePlay}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white p-3 rounded-lg flex items-center space-x-2"
                  >
                    <FaCirclePlay />
                    <span>Play Audio</span>
                  </button>
                )}

                {/* Menampilkan status audio sedang diputar */}
                {isPlaying && (
                  <div className="">
                    <Card className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center border-solid border-2 bg-emerald-100 border-emerald-400 text-emerald-600">
                      <CardBody>
                        <div className="flex items-center justify-center space-x-2">
                          <HiSpeakerWave className="text-xl" />
                          <h2 className="text-md">Audio sedang dimainkan</h2>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                )}

                {/* Menampilkan card dengan tulisan 'Jawab soal berikutnya' setelah audio selesai */}
                {hasFinished && !isPlaying && (
                  <div className="">
                    <Card className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center border-solid border-2 bg-yellow-100 border-yellow-400 text-yellow-600">
                      <CardBody>
                        <div className="flex items-center justify-center space-x-2">
                          <h2 className="text-md">Jawab soal berikutnya</h2>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                )}
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
          {/* Button positioned at the absolute bottom
          <div className="absolute bottom-[400px] left-0 w-full flex justify-center">
            <Button
              color="primary"
              // className="bg-cyan-500 text-white hover:bg-cyan-700 hover:text-slate-100"
              size="lg"
              onPress={handleButtonClick}
            >
              <h2 className="items-center text-center">
                Selesai dan lanjutkan
              </h2>
            </Button>
          </div> */}
        </div>
      </div>
    </AuthWrapper>
  );
}
