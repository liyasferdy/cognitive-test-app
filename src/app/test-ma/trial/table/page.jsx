"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import the router
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/table";
import { Card, CardBody } from "@nextui-org/card";
import { FaTasks } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { CiWarning } from "react-icons/ci";
import { Button } from "@nextui-org/button";
import AuthWrapper from "../../../authWrapper";

const rows = [
  { key: "1", animal: "Bebek", character: "CEO", bodyPart: "Active" },
  { key: "2", animal: "Bebek", character: "CEO", bodyPart: "Active" },
  { key: "3", animal: "Bebek", character: "CEO", bodyPart: "Active" },
  { key: "4", animal: "Bebek", character: "CEO", bodyPart: "Active" },
];

const columns = [
  { key: "animal", label: "Hewan" },
  { key: "character", label: "Karakteristik" },
  { key: "bodyPart", label: "Anggota Tubuh" },
];

export default function TrialTestMA() {
  const router = useRouter();
  const [selectedColor] = useState("default");
  const [isModalOpen, setIsModalOpen] = useState(true); // Warning modal
  const [isEndModalOpen, setIsEndModalOpen] = useState(false); // End modal
  const [timeLeft, setTimeLeft] = useState(10); // Waktu dalam detik

  useEffect(() => {
    if (timeLeft === 0) {
      // Jika waktu habis, arahkan ke page berikutnya
      router.push("/test-ma/trial/table/questions");
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, router]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const handleModalAction = () => {
    setIsModalOpen(false);
  };

  const handleButtonClick = () => {
    if (timeLeft > 0) {
      setIsEndModalOpen(true);
    } else {
      router.push("/test-ma/trial/table/questions");
    }
  };

  const handleContinue = () => {
    setIsEndModalOpen(false);
    router.push("/test-ma/trial/table/questions");
  };

  return (
    <AuthWrapper>
      <div className="pt-40 flex justify-center mt-20 items-center p-5 absolute -space-x-20 w-full h-full">
        {/* Modal Pertama */}
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

        {/* Modal Konfirmasi Selesai */}
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

        <Card className="max-w-[60rem] px-30 py-15 relative bottom-40 min-h-[800px] w-full">
          <h2 className="text-center mt-10 text-xl">
            Perhatikan tabel berikut
          </h2>
          <CardBody>
            <Table
              color={selectedColor}
              selectionMode="single"
              aria-label="Example static collection table"
              className="text-sm  mx-auto overflow-x-auto top-5"
            >
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn
                    key={column.key}
                    className="px-2 py-1 text-center text-lg"
                  >
                    {column.label}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody items={rows}>
                {(item) => (
                  <TableRow key={item.key}>
                    {(columnKey) => (
                      <TableCell className="px-2 py-3 text-center text-lg">
                        {getKeyValue(item, columnKey)}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        <div className="">
          <div className="absolute top-0 left-20 w-[270px] ml-20">
            <Card>
              <FaTasks className="text-5xl absolute top-4 left-2" />
              <CardBody>
                <div className="flex text-left items-start justify-center">
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

          <div className="absolute top-40 -mt-12 left-20 w-[270px] ml-20">
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

          {/* Tombol 'Selesai dan lanjutkan' dapat dikembalikan jika diperlukan */}
          {/* 
          <div className="absolute bottom-[100px] left-0 w-full flex justify-center">
            <Button color="primary" size="lg" onPress={handleButtonClick}>
              <h2 className="items-center text-center">
                Selesai dan lanjutkan
              </h2>
            </Button>
          </div> 
          */}
        </div>
      </div>
    </AuthWrapper>
  );
}
