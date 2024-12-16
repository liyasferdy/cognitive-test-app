"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import Link from "next/link";
import AuthWrapper from "../../authWrapper";

export default function InstructionMA() {
  return (
    <AuthWrapper>
      <div className="pt-40 flex justify-center mt-40 items-center p-5 relative">
        <Card className="max-w-[60rem] px-20 py-10 relative bottom-40 min-h-[400px]">
          <CardBody>
            <h1 className="text-slate-900 text-lg text-center font-semibold">
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
        </Card>

        <div className="flex justify-start absolute items-center top-80">
          <Link href="/test-ma/trial/table">
            <Button color="primary" variant="ghost" size="lg">
              Mulai Test
            </Button>
          </Link>
        </div>
      </div>
    </AuthWrapper>
  );
}
