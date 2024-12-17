"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import Link from "next/link";
import AuthWrapper from "../../authWrapper";

export default function InstructionMA() {
  return (
    <AuthWrapper>
      <div className="pt-20 pb-20 sm:pt-40 flex justify-center mt-10 sm:mt-40 items-center p-5 relative">
        <Card className="w-full sm:max-w-[60rem] px-5 sm:px-20 py-10 relative sm:bottom-40 min-h-[400px]">
          <CardBody>
            <h1 className="text-slate-900 text-lg sm:text-xl text-center font-semibold">
              Instruksi - Test MA
            </h1>
            <p className="text-justify mt-5 indent-8 leading-loose">
              Anda akan disuguhkan beberapa informasi mengenai nama hewan,
              karakteristik yang dimiliki, dan anggota tubuh yang ada di hewan
              tersebut. Tugas Anda adalah menghafal informasi yang diberikan
              dengan waktu yang telah ditentukan. Setelah mendapat instruksi
              untuk membalik halaman Anda dapat menjawab pertanyaan yang ada.
            </p>
          </CardBody>

          {/* Kontainer untuk tombol */}
          <div className="flex justify-center items-center bottom-5 left-0 right-0 mt-5 mb-2 px-5 sm:px-20">
            <Link href="/test-ma/table">
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
