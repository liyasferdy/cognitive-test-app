"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@nextui-org/card";
import { FaTasks } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { articleData } from "../../article";
import { Button } from "@nextui-org/button";
import AuthWrapper from "../../../authWrapper";

const ArticlePage = () => {
  const router = useRouter();
  const [timeLeftArticle, setTimeLeftArticle] = useState(180); // Default time
  const [article, setArticleData] = useState({
    content: ["Loading..."],
  });
  const [isMobile, setIsMobile] = useState(false);

  // Konfigurasi waktu per artikel
  const timeConfig = {
    1: 90,
    2: 90,
    3: 120,
    4: 120,
    5: 150,
    6: 150,
    7: 180,
    8: 180,
  };

  // Detect screen size for mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Set mobile view for screen width <= 768px
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const pathArray = String(window.location.pathname).split("/");
    const id = Number(pathArray[pathArray.length - 1]);

    // Ensure the article exists before setting state
    const activeArticle = articleData.find((article) => article.id === id);

    if (activeArticle) {
      setArticleData({
        title: activeArticle.title,
        content: activeArticle.content,
        id: activeArticle.id,
      });

      // Set the time based on the article ID
      if (timeConfig[id]) {
        setTimeLeftArticle(timeConfig[id]);
      }
    }
  }, []);

  // Timer countdown logic
  useEffect(() => {
    if (timeLeftArticle === 0 && article.id !== undefined) {
      router.push(`/test-mm/article/${article.id}/questions`);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeftArticle((prevTime) => Math.max(prevTime - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeftArticle, router, article.id]);

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
        <Card
          className={`${
            isMobile ? "w-full px-4 py-6" : "max-w-[50rem] px-20 py-10"
          } h-fit`}
        >
          <CardBody>
            <h1
              className={`${
                isMobile
                  ? "text-slate-400 text-md text-center"
                  : "text-slate-400 text-lg text-center"
              }`}
            >
              {article.title}
            </h1>
            {article.content.map((paragraph, index) => (
              <p
                key={index}
                className={`${
                  isMobile
                    ? "text-justify mt-5 leading-relaxed indent-8 "
                    : "text-justify mt-7 indent-8 leading-loose"
                }`}
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
            onClick={handleNextQuestions}
          >
            Lanjutkan
          </Button>
        </div>

        {/* Sidebar for Mobile */}
        {isMobile && (
          <div className="w-full flex flex-row gap-2 p-2 fixed top-0 left-0 z-10 shadow-md bg-gray-100 mb-4">
            <Card className="flex flex-row items-center p-2 w-1/2 shadow-sm">
              <FaTasks className="text-2xl mr-2" />
              <div>
                <h2 className="text-sm font-semibold">Test</h2>
                <p className="text-xs">Meaningful Memory</p>
              </div>
            </Card>

            <Card className="flex flex-row items-center p-2 w-1/2 shadow-sm">
              <IoMdTime className="text-2xl mr-2" />
              <div>
                <h2 className="text-sm font-semibold">Waktu Tersisa</h2>
                <p className="text-xs">{formatTime(timeLeftArticle)}</p>
              </div>
            </Card>
          </div>
        )}

        {!isMobile && (
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
                      {formatTime(timeLeftArticle)}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        )}
      </div>
    </AuthWrapper>
  );
};

export default ArticlePage;
