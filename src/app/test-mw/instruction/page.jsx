"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import Link from "next/link";
import AuthWrapper from "../../authWrapper";

export default function InstructionMW() {
  return (
    <AuthWrapper>
      <div className="pt-20 pb-20 sm:pt-40 flex justify-center mt-10 sm:mt-40 items-center p-5 relative">
        <Card className="w-full sm:max-w-[60rem] px-5 sm:px-20 py-10 relative sm:bottom-40 min-h-[400px]">
          <CardBody>
            <h1 className="text-slate-900 text-lg sm:text-xl text-center font-semibold">
              Instruksi - Test MW
            </h1>
            <p className="text-justify mt-5 indent-8 leading-loose">
              Anda akan mendengar beberapa gabungan kata dan angka secara acak.
              Tugas Anda adalah mengulang kembali huruf/angka secara terbalik
              dari yang terakhir ke awal. Setelah audio selesai menyampaikan
              kata dan angkanya, Anda bisa langsung mulai menjawab.
            </p>
            <p className="text-justify mt-5 indent-8 leading-loose">
              Sebagai contoh, apabila audio menyebutkan 1 - 2 - A.
            </p>
            <p className="text-justify mt-5 indent-8 leading-loose">
              Anda diminta menjawab dengan A - 2 - 1 dengan mengetikkan jawaban
              pada kolom yang sudah disediakan.
            </p>
          </CardBody>

          {/* Kontainer untuk tombol */}
          <div className="flex justify-center items-center bottom-5 left-0 right-0 mt-5 mb-2 px-5 sm:px-20">
            <Link href="/test-mw/trial/player/">
              <Button
                color="primary"
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto"
              >
                Mulai Test
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </AuthWrapper>
  );
}
