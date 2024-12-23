"use client";

import { Button } from "@nextui-org/button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AuthWrapper from "../authWrapper";

export default function Submit() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // Untuk melacak apakah jawaban sudah disubmit

  // Fungsi untuk mengakhiri test (menyimpan semua jawaban ke DB)
  const handleFinalAnswerSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "https://cognitive-dev-734522323885.asia-southeast2.run.app/answers/savetoDB",
        {},
        {
          headers: {
            Authorization: `Bearer ${
              typeof window !== "undefined"
                ? localStorage.getItem("access_token")
                : ""
            }`,
          },
        }
      );

      if (response.status === 200) {
        setIsSubmitted(true); // Tandai bahwa jawaban telah disubmit
      } else {
        alert("Failed to finalize answers. Please try again.");
      }
    } catch (error) {
      console.log("Error finalizing answers:", error);
      alert("An error occurred while finalizing answers. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fungsi untuk Logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        "https://cognitive-dev-734522323885.asia-southeast2.run.app/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Hapus token dari localStorage
        localStorage.removeItem("access_token");

        // Arahkan ke halaman login atau halaman lain
        router.push("/");
      } else {
        alert("Failed to log out. Please try again.");
      }
    } catch (error) {
      console.log("Error during logout:", error);
      alert("An error occurred while logging out. Please try again.");
    }
  };

  return (
    <AuthWrapper>
      <div className="flex flex-col justify-center items-center min-h-screen space-y-5">
        <h2 className="text-lg text-center px-4">
          {!isSubmitted
            ? "Anda telah menyelesaikan keseluruhan dari test ini. Konfirmasi keseluruhan jawaban dengan menekan tombol berikut."
            : "Jawaban telah disubmit. Anda dapat logout dari aplikasi."}
        </h2>
        <Button
          color={isSubmitted ? "danger" : "primary"}
          size="lg"
          className="p-7"
          onClick={isSubmitted ? handleLogout : handleFinalAnswerSubmit}
          isDisabled={isSubmitting}
        >
          <h1 className="text-lg">
            {isSubmitting
              ? "Sedang memproses..."
              : isSubmitted
              ? "Logout"
              : "Submit keseluruhan jawaban"}
          </h1>
        </Button>
      </div>
    </AuthWrapper>
  );
}
