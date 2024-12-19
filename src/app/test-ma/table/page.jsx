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
import AuthWrapper from "../../authWrapper";

const rows = [
  { key: "1", animal: "Gajah", character: "Lucu", bodyPart: "Telinga" },
  { key: "2", animal: "Kucing", character: "Manja", bodyPart: "Cakar" },
  { key: "3", animal: "Anjing", character: "Loyal", bodyPart: "Gigi" },
  { key: "4", animal: "Cheetah", character: "Gesit", bodyPart: "Mulut" },
  { key: "5", animal: "Elang", character: "Akurat", bodyPart: "Sayap" },
  { key: "6", animal: "Buaya", character: "Ganas", bodyPart: "Sisik" },
  { key: "7", animal: "Kukang", character: "Malas", bodyPart: "Cakar" },
  { key: "8", animal: "Landak", character: "Tajam", bodyPart: "Duri" },
  { key: "9", animal: "Ular", character: "Licik", bodyPart: "Sisik" },
  { key: "10", animal: "Hiu", character: "Seram", bodyPart: "Gigi" },
  { key: "11", animal: "Katak", character: "Lembab", bodyPart: "Lidah" },
  { key: "12", animal: "Nyamuk", character: "Rakus", bodyPart: "Mulut" },
  { key: "13", animal: "Kera", character: "Cerdas", bodyPart: "Telinga" },
  { key: "14", animal: "Semut", character: "Kokoh", bodyPart: "Antena" },
  { key: "15", animal: "Capung", character: "Lincah", bodyPart: "Sayap" },
];

const columns = [
  {
    key: "animal",
    label: "Hewan",
  },
  {
    key: "character",
    label: "Karakteristik",
  },
  {
    key: "bodyPart",
    label: "Anggota Tubuh",
  },
];

export default function TestMA() {
  const router = useRouter(); // Initialize the router
  const [selectedColor, setSelectedColor] = React.useState("default");
  const [timeLeft, setTimeLeft] = useState(10); // atur waktu dalam second

  // Load timeLeft from localStorage on component mount
  useEffect(() => {
    const savedTime = localStorage.getItem("timeLeft");
    if (savedTime) {
      setTimeLeft(parseInt(savedTime, 10));
    }
  }, []);

  // Save timeLeft to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("timeLeft", timeLeft);
  }, [timeLeft]);

  // Timer countdown logic
  useEffect(() => {
    if (timeLeft === 0) {
      // Redirect to the questions page when time runs out
      router.push("/test-ma/table/questions");
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

  return (
    <AuthWrapper>
      <div className="pt-40 flex justify-center mt-20 items-center p-5 absoulte -space-x-20">
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
        </div>
      </div>
    </AuthWrapper>
  );
}
