"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardBody } from "@nextui-org/card";
import { FaTasks } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import { imageData } from "../../image"; // Adjusted import path

export default function TestMV() {
  const router = useRouter();
  const params = useParams();
  const imageNumber = parseInt(params.number, 10) - 1; // Convert to 0-based index
  const [timeLeft, setTimeLeft] = useState(10); // Adjust time as needed

  // Validate image number
  if (imageNumber < 0 || imageNumber >= imageData.length) {
    return <div>Invalid image number</div>;
  }

  const currentImageData = imageData[imageNumber];

  // Timer countdown logic
  useEffect(() => {
    if (timeLeft === 0) {
      // If time runs out, move to the next set of questions for the current image
      router.push(`/test-mv/image/${imageNumber + 1}/questions`);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, router]);

  // Format time to mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // Handle moving to questions page
  const handleNextQuestion = () => {
    router.push(`/test-mv/image/${parseInt(params.number, 10)}/questions`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      {/* Side Panel */}
      <div className="space-y-7">
        <div className="absolute top-20 left-20 w-[270px] ml-20">
          <Card>
            <FaTasks className="text-5xl absolute top-4 left-2" />
            <CardBody>
              <div className="flex text-left items-start justify-center">
                <h2 className="text-xl font-semibold text-left mr-20">Test</h2>
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

        <div className="flex justify-center">
          {/* <Button
            color="primary"
            variant="solid"
            size="lg"
            onClick={handleNextQuestion}
          >
            Next to Questions
          </Button> */}
        </div>
      </div>
    </div>
  );
}
