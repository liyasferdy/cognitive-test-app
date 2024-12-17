"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@nextui-org/card";
import { FaTasks } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { articleData } from "../../article";
import Link from "next/link";
import { Button } from "@nextui-org/button";
// import {Button} from "@nextui-org/button";
// import Link from "next/link";
import AuthWrapper from "../../../authWrapper";

const ArticlePage = () => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(5);
  const [article, setArticleData] = useState({
    content: ["Loading..."],
  });

  useEffect(() => {
    const pathArray = String(window.location.pathname).split("/");
    const id = Number(pathArray[pathArray.length - 1]);

    // Ensure the article exists before setting state
    const activeArticle = articleData.find((article) => article.id === id);

    if (activeArticle) {
      setArticleData({
        title: activeArticle.title,
        content: activeArticle.content,
        id: activeArticle.id, // Corrected: use activeArticle.id, not articleData.id
      });
    }
  }, []);

  // Timer countdown logic
  useEffect(() => {
    if (timeLeft === 0 && article.id !== undefined) {
      // Only redirect if article.id is defined
      router.push(`/test-mm/article/${article.id}/questions`);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, router, article.id]);

  // Rest of the code remains the same
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const handleNextQuestions = () => {
    // Navigate to the questions page for this article
    router.push(`/test-mm/article/${article.id}/questions`);
  };

  return (
    <AuthWrapper>
      <div className="pt-20 flex flex-col justify-start items-center min-h-screen">
        <Card className="max-w-[50rem] h-fit px-20 py-10">
          <CardBody>
            <h1 className="text-slate-400 text-lg text-center">
              {article.title}
            </h1>
            {article.content.map((paragraph, index) => (
              <p
                key={index}
                className="text-justify mt-5 indent-8 leading-loose"
              >
                {paragraph}
              </p>
            ))}
          </CardBody>
        </Card>
        {/* Finish Test Button */}
        <div className="flex justify-center items-center mt-10 mb-20">
          <Button
            color="primary"
            size="lg"
            className="mt-4"
            onClick={handleNextQuestions} // Add the click handler here
          >
            Lanjutkan
          </Button>
        </div>

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
};

export default ArticlePage;
