"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import Link from "next/link";
import AuthWrapper from "../../authWrapper";

export default function InstructionMS() {
  return (
    <AuthWrapper>
      <div className="pt-40 flex justify-center mt-40 items-center p-5 relative">
        <Card className="max-w-[60rem] px-20 py-10 relative bottom-40 min-h-[400px]">
          <CardBody>
            <h1 className="text-slate-900 text-lg text-center font-semibold">
              Instruksi - Test MS
            </h1>
            <p className="text-justify mt-5 indent-8 leading-loose">
              Anda akan mendengar beberapa gabungan huruf dan angka secara acak.
              Tugas Anda adalah mengulang kembali huruf/angka tersebut. Setelah
              audio selesai menyampaikan huruf dan angkanya, Anda bisa langsung
              mulai menjawab.
            </p>
            <p className="text-justify mt-5 indent-8 leading-loose">
              Sebagai contoh, apabila audio menyebutkan 1 - 2 - A.
            </p>
            <p className="text-justify mt-5 indent-8 leading-loose">
              Anda diminta menjawab dengan 1 - 2 - A dengan mengetikkan jawaban
              pada kolom yang sudah disediakan.
            </p>
          </CardBody>
        </Card>

        <div className="flex justify-start absolute items-center top-80">
          <Link href="/test-ms/trial/player">
            <Button color="primary" variant="ghost" size="lg">
              Mulai Test
            </Button>
          </Link>
        </div>
      </div>
    </AuthWrapper>
  );
}
