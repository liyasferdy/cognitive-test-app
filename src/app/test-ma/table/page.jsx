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
  const [timeLeft, setTimeLeft] = useState(420); // atur waktu dalam second
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
      <div className="pt-20 flex flex-col items-center p-4 bg-gray-50 min-h-screen relative">
        {/* Desktop View */}
        {!isMobile && (
          <Card className="max-w-[60rem] px-10 py-10 relative min-h-[800px] w-full shadow-md">
            <h2 className="text-center mt-5 text-xl font-semibold">
              Perhatikan tabel berikut
            </h2>
            <CardBody>
              <Table
                color={selectedColor}
                selectionMode="single"
                aria-label="Example static collection table"
                className="text-sm mx-auto overflow-x-auto mt-5"
              >
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn
                      key={column.key}
                      className="px-2 py-1 text-center text-lg font-semibold bg-gray-100"
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
        )}

        {/* Mobile View */}
        {isMobile && (
          <div className="flex flex-col justify-start items-center p-4 w-full">
            <Card className="w-full px-4 py-6 bg-white shadow-md">
              <h2 className="text-center text-md font-semibold mb-4">
                Perhatikan tabel berikut
              </h2>
              <CardBody>
                <div className="overflow-x-auto">
                  <Table
                    color={selectedColor}
                    selectionMode="single"
                    aria-label="Example static collection table"
                    className="text-xs w-full"
                  >
                    <TableHeader columns={columns}>
                      {(column) => (
                        <TableColumn
                          key={column.key}
                          className="px-2 py-2 text-center text-xs font-semibold bg-gray-100"
                        >
                          {column.label}
                        </TableColumn>
                      )}
                    </TableHeader>
                    <TableBody items={rows}>
                      {(item) => (
                        <TableRow key={item.key}>
                          {(columnKey) => (
                            <TableCell className="px-2 py-2 text-center text-xs">
                              {getKeyValue(item, columnKey)}
                            </TableCell>
                          )}
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Sidebar for Mobile */}
        {isMobile && (
          <div className="w-full flex flex-row gap-2 p-2 fixed top-0 left-0 z-10 shadow-md bg-white">
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
            <Card className="w-[270px]">
              <FaTasks className="text-5xl absolute top-4 left-2" />
              <CardBody>
                <div className="flex text-left items-start justify-center">
                  <h2 className="text-xl font-semibold text-left">Test</h2>
                </div>
                <div className="flex items-center justify-start">
                  <p className="text-lg text-left mt-1 ml-16">
                    Meaningful Memory
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card className="w-[270px]">
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
      </div>
    </AuthWrapper>
  );
}
