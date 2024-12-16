"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import React from "react";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import Link from "next/link";
import { Input } from "@nextui-org/input";
import { Checkbox } from "@nextui-org/checkbox";
import { useRouter } from "next/navigation"; // Menggunakan useRouter

// Fungsi untuk menangani login
const handleLogin = async (username, password, setLoginStatus, onClose) => {
  try {
    const response = await fetch(
      "https://cognitive-dev-734522323885.asia-southeast2.run.app/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: username,
          password: password,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    localStorage.setItem("access_token", data.access_token); // Menyimpan token JWT di localStorage

    // Login berhasil
    setLoginStatus("success"); // Set status login berhasil
    console.log("Login successful", data);

    // Jangan lakukan router.push di sini, lakukan di dalam useEffect setelah modal ditutup
    onClose(); // Tutup modal setelah login berhasil
  } catch (error) {
    console.log("Error during login:", error);
    setLoginStatus("failed"); // Set status login gagal
  }
};

export default function LoginHome() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState(""); // State untuk status login
  const router = useRouter(); // Inisialisasi useRouter

  // UseEffect untuk pengalihan setelah modal ditutup
  useEffect(() => {
    if (loginStatus === "success") {
      // Redirect ke halaman /home setelah modal ditutup
      const timer = setTimeout(() => {
        router.push("/users");
      }, 1000); // Menunggu 2 detik sebelum pengalihan

      // Membersihkan timeout jika status login berubah
      return () => clearTimeout(timer);
    }
  }, [loginStatus, router]); // Ketika loginStatus berubah, jalankan useEffect ini

  return (
    <div className="flex justify-center items-center h-screen relative space-x-[50rem] bg-gray-100">
      <div className="absolute top-100 left-10 flex">
        <h1 className="text-6xl mb-5 font-semibold text-slate-400">
          Selamat datang di&nbsp;
        </h1>
        <h1 className="font-semibold text-6xl mb-5 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent hover:bg-gradient-to-r hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500">
          Test Psikotest
        </h1>
      </div>
      <div className="flex ml-5 mt-5 absolute">
        <Card className="px-[5rem] py-[10rem] -mr-60 ">
          <div className="flex justify-center font-semibold text-4xl -mt-10 mb-5 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent hover:bg-gradient-to-r hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500">
            <h1>Sign in Now! </h1>
          </div>
          <CardBody className="flex flex-col space-y-1">
            <div className="grid grid-cols-2 gap-5 grid-flow-col w-80 justify-center items-center">
              <div className="col-span-2 space-y-5 ">
                <Button
                  onPress={onOpen}
                  className="bg-cyan-500 text-slate-100 w-[20rem] hover:bg-cyan-600 hover:text-slate-100"
                  size="lg"
                >
                  <h2 className="items-center text-center text-md">
                    Masuk dengan akun anda
                  </h2>
                </Button>
                <Modal
                  isOpen={isOpen}
                  onOpenChange={onOpenChange}
                  placement="top-center"
                  backdrop="blur"
                >
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1">
                          Log in
                        </ModalHeader>
                        <ModalBody>
                          <Input
                            autoFocus
                            label="Username"
                            placeholder="Enter your username"
                            variant="bordered"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} // Set username state
                          />
                          <Input
                            label="Password"
                            placeholder="Enter your password"
                            type="password"
                            variant="bordered"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} // Set password state
                          />
                          <div className="flex py-2 px-1 justify-between">
                            <Checkbox
                              classNames={{
                                label: "text-small",
                              }}
                            >
                              Remember me
                            </Checkbox>
                          </div>
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="danger"
                            variant="flat"
                            onPress={onClose}
                          >
                            Close
                          </Button>
                          <Button
                            color="primary"
                            onPress={() => {
                              handleLogin(
                                username,
                                password,
                                setLoginStatus,
                                onClose
                              ); // Call handleLogin on button press
                            }}
                          >
                            Sign in
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
                <div className="flex items-center mt-10">
                  <div className="border-t border-1 border-gray-300 flex-grow"></div>
                  <div className="px-1 text-gray-400 text-md">Atau</div>
                  <div className="border-t border-1 border-gray-300 flex-grow"></div>
                </div>
                <Button
                  variant="bordered"
                  color=""
                  className="border-cyan-500 text-cyan-600 w-[20rem] hover:bg-cyan-500 hover:text-slate-100"
                  size="lg"
                >
                  <Link href="/">
                    <h2 className="items-center text-center">
                      Dapatkan bantuan untuk masuk
                    </h2>
                  </Link>
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Modal untuk menampilkan status login */}
      <Modal
        isOpen={loginStatus !== ""}
        onOpenChange={() => setLoginStatus("")}
      >
        <ModalContent>
          <ModalHeader>
            {loginStatus === "success" ? "Login Berhasil" : "Login Gagal"}
          </ModalHeader>
          <ModalBody>
            {loginStatus === "success"
              ? "Selamat datang! Anda berhasil login."
              : "Nama pengguna atau kata sandi salah."}
          </ModalBody>
          <ModalFooter>
            <Button
              color={loginStatus === "success" ? "success" : "danger"}
              onPress={() => setLoginStatus("")}
            >
              Loading..
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
