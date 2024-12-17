"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { CiWarning } from "react-icons/ci";
import AuthWrapper from "../authWrapper"; // Import your AuthWrapper component
import { useRouter } from "next/navigation"; // Import useRouter from Next.js
import { Button } from "@nextui-org/button";

export default function UsersScreening() {
  // Inisialisasi router untuk redirect
  const router = useRouter();
  // State untuk form fields
  const [formData, setFormData] = useState({
    nama: "",
    usia: "",
    jenis_kelamin: "",
    domisili: "",
    pendidikan_terakhir: "",
    suku: "",
  });

  // Status login
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Cek status login saat komponen pertama kali di-render
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsLoggedIn(true); // Jika ada token, tandakan pengguna sudah login
    }
  }, []);

  // Handle perubahan input pada form data diri
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle pengiriman form data
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Cek jika pengguna belum login
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("You must log in first.");
      return;
    }

    // Persiapkan data untuk dikirim
    const dataToSubmit = {
      nama: formData.nama,
      usia: parseInt(formData.usia, 10),
      jenis_kelamin: formData.jenis_kelamin,
      domisili: formData.domisili,
      pendidikan_terakhir: formData.pendidikan_terakhir,
      suku: formData.suku,
    };

    try {
      const response = await fetch(
        "https://cognitive-dev-734522323885.asia-southeast2.run.app/users/data",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Kirim data dalam format JSON
            Authorization: `Bearer ${token}`, // Kirim JWT token di header
          },
          body: JSON.stringify(dataToSubmit),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      const result = await response.json();
      console.log("Success:", result); // Handle success

      // Redirect ke halaman awal test test MM setelah berhasil submit
      router.push("/test-mm/instruction"); // Mengarahkan ke halaman home
    } catch (error) {
      console.log("Error submitting form:", error); // Handle error
    }
  };

  return (
    <AuthWrapper>
      <div className="flex justify-center items-center flex-col space-y-5 md:ml-20 md:mr-20 min-h-screen px-4">
        <h1 className="font-semibold text-2xl">Form Data Diri</h1>

        {/* Jika pengguna sudah login, tampilkan form data diri */}
        {isLoggedIn ? (
          <>
            {/* Peringatan untuk mengisi data diri */}
            <Card className="border-solid border-2 border-emerald-400 bg-emerald-100 text-emerald-600 text-center items-center text-md flex flex-col w-full md:w-[500px]">
              <CardBody>
                <div className="flex items-center justify-center space-x-2">
                  <CiWarning className="text-xl" />
                  <h1 className="text-md">
                    Isikan data diri anda terlebih dahulu pada form dibawah ini
                  </h1>
                </div>
              </CardBody>
            </Card>

            {/* Form Data Diri */}
            <Card className="w-full md:w-[500px] items-center justify-center">
              <CardBody>
                <form onSubmit={handleSubmit} className="m-5 space-y-8">
                  <Input
                    label="Nama Lengkap"
                    placeholder="Masukkan nama lengkap anda"
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Usia"
                    placeholder="Masukkan usia anda"
                    type="number"
                    name="usia"
                    value={formData.usia}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Jenis kelamin"
                    placeholder="Pria atau Wanita"
                    type="text"
                    name="jenis_kelamin"
                    value={formData.jenis_kelamin}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Domisili"
                    placeholder="Masukkan alamat anda"
                    type="text"
                    name="domisili"
                    value={formData.domisili}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Pendidikan terakhir"
                    placeholder="Masukkan pendidikan terakhir anda"
                    type="text"
                    name="pendidikan_terakhir"
                    value={formData.pendidikan_terakhir}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Suku"
                    placeholder="Masukkan suku anda"
                    type="text"
                    name="suku"
                    value={formData.suku}
                    onChange={handleInputChange}
                  />
                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      color="primary"
                      className="w-full sm:w-auto"
                    >
                      Submit
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </>
        ) : (
          // Tampilkan pesan jika pengguna belum login
          <div className="text-center text-red-500">
            <h2>
              Silakan login terlebih dahulu untuk mengakses form data diri
            </h2>
          </div>
        )}
      </div>
    </AuthWrapper>
  );
}
