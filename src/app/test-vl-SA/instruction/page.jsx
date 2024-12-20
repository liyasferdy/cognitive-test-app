"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import AuthWrapper from "../../authWrapper";
import { useRouter } from "next/navigation";

export default function InstructionVLSA() {
  const router = useRouter();

  const handleNavigation = () => {
    router.push("/test-vl-SA/trial/questions");
  };

  return (
    <AuthWrapper>
      <div className="pt-20 pb-20 sm:pt-40 flex justify-center mt-10 sm:mt-40 items-center p-5 relative">
        <Card className="w-full sm:max-w-[60rem] px-5 sm:px-20 py-10 relative sm:bottom-40 min-h-[400px]">
          <CardBody>
            <h1 className="text-slate-900 text-lg sm:text-xl text-center font-semibold">
              Instruksi - Test VL Sinonim-Antonim
            </h1>
            <p className="text-justify mt-5 indent-8 leading-loose">
              Anda akan disuguhkan sebuah kata. Tugas Anda adalah mencari makna
              dari kata tersebut yang sama atau berlawanan secara akurat.
            </p>
          </CardBody>

          {/* Kontainer untuk tombol */}
          <div className="flex justify-center items-center bottom-5 left-0 right-0 mt-5 mb-2 px-5 sm:px-20 z-50">
            <Button
              color="primary"
              size="lg"
              className="w-full sm:w-auto"
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