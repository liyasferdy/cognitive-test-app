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
  const [timeLeft, setTimeLeft] = useState(3);
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

        <Card className="max-w-[50rem] h-fit px-20 py-10">
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

        <div className="space-y-7">
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
                    Meaningful Memory
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
          <div>
            <div className="flex justify-center items-center">
              <Button color="primary" size="lg" onPress={handleButtonClick}>
                <h2 className="items-center text-center">
                  Selesai dan lanjutkan
                </h2>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
