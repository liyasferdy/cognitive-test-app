"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@nextui-org/card";
import { FaTasks } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { CiWarning } from "react-icons/ci";
import AuthWrapper from "../../../authWrapper";

export default function TrialArticleMM() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(true); // Warning modal
  const [isEndModalOpen, setIsEndModalOpen] = useState(false); // End modal
  const [timeLeft, setTimeLeft] = useState(300);
  const [timerActive, setTimerActive] = useState(false);

  // Timer countdown logic
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (timeLeft === 0) {
      // Redirect to the questions page when time runs out
      router.push("/test-mm/trial/article/questions");
      setTimerActive(false);
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
      router.push("/test-mm/trial/article/questions"); // If time is up, navigate directly
    }
  };

  // Handle 'Continue' action on the end modal
  const handleContinue = () => {
    setIsEndModalOpen(false);
    router.push("/test-mm/trial/article/questions"); // Proceed to next page
  };

  return (
    <AuthWrapper>
      <div className="pt-20 flex flex-col justify-start items-center min-h-screen">
        {/* First Modal */}
        {isModalOpen && (
          <Modal
            isOpen={true}
            onClose={handleModalAction}
            placement="center"
            backdrop="blur"
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

        <Card className="max-w-[50rem] w-full h-fit px-4 py-10">
          <CardBody>
            <h1 className="text-slate-400 text-lg text-center">Wacana</h1>
            <p className="text-justify mt-5 indent-8 leading-loose">
              Kota-kota besar sering menghadapi masalah parkir liar yang semakin
              meresahkan. Parkir liar terjadi ketika pengendara memarkir
              kendaraan di lokasi yang tidak sesuai aturan, seperti trotoar atau
              bahu jalan.
            </p>
            <p className="text-justify mt-5 indent-8 leading-loose">
              Penegak hukum lalu lintas seringkali kesulitan menertibkan parkir
              liar. Banyak pengendara mengabaikan rambu-rambu dan memilih
              kenyamanan pribadi daripada mematuhi aturan.
            </p>
            <p className="text-justify mt-5 indent-8 leading-loose">
              Parkir liar juga menimbulkan kerugian bagi masyarakat secara
              keseluruhan. Ruang publik yang semestinya digunakan oleh pejalan
              kaki menjadi tidak aman dan sulit diakses.
            </p>
          </CardBody>
        </Card>

        {/* Information Card  */}
        <div className="space-y-7 w-full flex flex-col items-center ">
          {/* Card dengan ikon Tasks */}
          <div className="relative w-full sm:w-[270px] sm:absolute sm:top-20 sm:left-20 sm:ml-0 sm:mr-0">
            <Card className="left-5">
              <FaTasks className="text-5xl absolute top-4 left-2" />
              <CardBody>
                <div className="flex text-left items-start justify-center">
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

          {/* Card dengan ikon Waktu */}
          <div className="relative w-full sm:w-[270px] sm:absolute sm:top-40 sm:left-20 sm:ml-0 sm:mr-0 mt-8">
            <Card className="left-5">
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
        </div>

        {/* Tombol selesai */}
        <div className="w-full flex justify-center mt-10">
          <Button color="primary" size="lg" onPress={handleButtonClick}>
            <h2 className="items-center text-center">Lanjutkan</h2>
          </Button>
        </div>
      </div>
    </AuthWrapper>
  );
}
