"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import Link from "next/link";
import AuthWrapper from "../../authWrapper";
import { useRouter } from "next/router";

export default function InstructionMM() {
  const router = useRouter();

  const handleNavigation = () => {
    router.push("/test-mm/trial/article/");
  };

  return (
    <AuthWrapper>
      <div className="pt-20 pb-20 sm:pt-40 flex justify-center items-center mt-10 sm:mt-40 p-5 relative">
        <Card className="w-full sm:max-w-[60rem] px-5 sm:px-20 py-10 min-h-[400px]">
          <CardBody>
            <h1 className="text-slate-900 text-lg sm:text-xl text-center font-semibold">
              Instruksi - Test MM
            </h1>
            <p className="text-justify mt-5 indent-8 leading-loose">
              Terdapat beberapa bacaan yang akan disuguhkan. Tugas Anda adalah
              menjawab pertanyaan berdasarkan informasi dari bacaan tersebut.
              Anda diberikan waktu terbatas pada setiap bacaan sebelum menjawab
              pertanyaan.
            </p>
          </CardBody>

          {/* Kontainer untuk tombol */}
          <div className="fixed bottom-5 left-0 right-0 flex justify-center items-center px-5 sm:px-20 z-50">
            <Button
              color="primary"
              size="lg"
              className="w-full max-w-xs sm:w-auto sm:max-w-none"
              onClick={handleNavigation}
            >
              Mulai Test
            </Button>
          </div>
        </Card>
      </div>
    </AuthWrapper>
  );
}
