"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { CiWarning } from "react-icons/ci";
import AuthWrapper from "../authWrapper";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";

export default function UsersScreening() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nama: "",
    usia: "",
    jenis_kelamin: "",
    domisili: "",
    pendidikan_terakhir: "",
    suku: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Hardcoded list of provinces
  const provinces = [
    "Aceh",
    "Sumatera Utara",
    "Sumatera Barat",
    "Riau",
    "Jambi",
    "Sumatera Selatan",
    "Bengkulu",
    "Lampung",
    "Kepulauan Bangka Belitung",
    "Kepulauan Riau",
    "DKI Jakarta",
    "Jawa Barat",
    "Jawa Tengah",
    "DI Yogyakarta",
    "Jawa Timur",
    "Banten",
    "Bali",
    "Nusa Tenggara Barat",
    "Nusa Tenggara Timur",
    "Kalimantan Barat",
    "Kalimantan Tengah",
    "Kalimantan Selatan",
    "Kalimantan Timur",
    "Kalimantan Utara",
    "Sulawesi Utara",
    "Sulawesi Tengah",
    "Sulawesi Selatan",
    "Sulawesi Tenggara",
    "Gorontalo",
    "Sulawesi Barat",
    "Maluku",
    "Maluku Utara",
    "Papua",
    "Papua Barat",
    "Papua Selatan",
    "Papua Tengah",
    "Papua Pegunungan",
  ];

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDropdownChange = (selectedKey, field) => {
    setFormData({
      ...formData,
      [field]: Array.from(selectedKey).join(""),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi: Cek apakah semua field telah diisi
    if (
      !formData.nama ||
      !formData.usia ||
      !formData.jenis_kelamin ||
      !formData.domisili ||
      !formData.pendidikan_terakhir ||
      !formData.suku
    ) {
      alert("Harap isi semua field sebelum melanjutkan.");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("You must log in first.");
      return;
    }

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
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSubmit),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      const result = await response.json();
      console.log("Success:", result);

      router.push("/home/instruction");
    } catch (error) {
      console.log("Error submitting form:", error);
    }
  };

  return (
    <AuthWrapper>
      <div className="flex justify-center items-center flex-col space-y-5 md:ml-20 md:mr-20 min-h-screen px-4">
        <h1 className="font-semibold text-2xl">Form Data Diri</h1>

        {isLoggedIn ? (
          <>
            <Card className="border-solid border-2 border-emerald-400 bg-emerald-100 text-emerald-600 text-center items-center text-md flex flex-col w-full md:w-[500px]">
              <CardBody>
                <div className="flex items-center justify-center space-x-2">
                  <CiWarning className="text-xl" />
                  <h1 className="text-md">
                    Isikan data diri anda terlebih dahulu pada form di bawah ini
                  </h1>
                </div>
              </CardBody>
            </Card>

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
                    value={formData.usia > 0 ? formData.usia : ""}
                    onChange={handleInputChange}
                  />

                  <Card className="bg-zinc-100" shadow="none">
                    <CardBody>
                      <h2 className="text-sm text-gray-600 mb-1">
                        Jenis kelamin
                      </h2>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button
                            variant="bordered"
                            size="md"
                            radius="lg"
                            className="text-gray-500 text-sm"
                          >
                            {formData.jenis_kelamin || "Klik untuk memilih"}
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          aria-label="Jenis Kelamin"
                          selectedKeys={[formData.jenis_kelamin]}
                          selectionMode="single"
                          onSelectionChange={(selectedKey) =>
                            handleDropdownChange(selectedKey, "jenis_kelamin")
                          }
                        >
                          <DropdownItem key="Pria">Pria</DropdownItem>
                          <DropdownItem key="Wanita">Wanita</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </CardBody>
                  </Card>

                  <Card className="bg-zinc-100" shadow="none">
                    <CardBody>
                      <h2 className="text-sm text-gray-600 mb-1">Domisili</h2>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button
                            variant="bordered"
                            size="md"
                            radius="lg"
                            className="text-gray-500 text-sm"
                          >
                            {formData.domisili || "Klik untuk memilih"}
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          aria-label="Domisili"
                          selectedKeys={[formData.domisili]}
                          selectionMode="single"
                          onSelectionChange={(selectedKey) =>
                            handleDropdownChange(selectedKey, "domisili")
                          }
                          className="max-h-[200px] overflow-y-auto" // Menambahkan scroll
                        >
                          {provinces.map((province) => (
                            <DropdownItem key={province}>
                              {province}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </CardBody>
                  </Card>

                  <Card className="bg-zinc-100" shadow="none">
                    <CardBody>
                      <h2 className="text-sm text-gray-600 mb-1">
                        Pendidikan terakhir
                      </h2>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button
                            variant="bordered"
                            size="md"
                            radius="lg"
                            className="text-gray-500 text-sm"
                          >
                            {formData.pendidikan_terakhir ||
                              "Klik untuk memilih"}
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          aria-label="Pendidikan Terakhir"
                          selectedKeys={[formData.pendidikan_terakhir]}
                          selectionMode="single"
                          onSelectionChange={(selectedKey) =>
                            handleDropdownChange(
                              selectedKey,
                              "pendidikan_terakhir"
                            )
                          }
                        >
                          <DropdownItem key="SD">SD</DropdownItem>
                          <DropdownItem key="SMP">SMP</DropdownItem>
                          <DropdownItem key="SMA">SMA</DropdownItem>
                          <DropdownItem key="D3">D-3</DropdownItem>
                          <DropdownItem key="S1/D4">S-1 / D-4</DropdownItem>
                          <DropdownItem key="S2">S-2</DropdownItem>
                          <DropdownItem key="S3">S-3</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </CardBody>
                  </Card>

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
