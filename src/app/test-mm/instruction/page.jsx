"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import Link from "next/link";
import AuthWrapper from "../../authWrapper";

export default function InstructionMM() {
  return (
    <AuthWrapper>
      <div className="pt-40 flex justify-center mt-40 items-center p-5 relative">
        <Card className="max-w-[60rem] px-20 py-10 relative bottom-40 min-h-[400px]">
          <CardBody>
            <h1 className="text-slate-900 text-lg text-center font-semibold">
              Instruksi - Test MM
            </h1>
            <p className="text-justify mt-5 indent-8 leading-loose">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Recusandae perspiciatis ipsa vitae sequi magni, illo quam. Quae
              praesentium corporis odit cupiditate. Tempore, perferendis eaque
              quo eius ea quod quaerat beatae. Kota-kota besar sering menghadapi
              masalah parkir liar yang semakin meresahkan. Parkir liar terjadi
              ketika pengendara memarkir kendaraan di lokasi yang tidak sesuai
              aturan, seperti trotoar atau bahu jalan. Masalah ini tidak hanya
              menghambat arus lalu lintas, tetapi juga membahayakan pejalan kaki
              yang terpaksa menggunakan jalan raya.
            </p>
          </CardBody>
        </Card>

        <div className="flex justify-start absolute items-center top-80">
          <Link href="/test-mm/trial/article/">
            <Button color="primary" variant="ghost" size="lg">
              Mulai Test
            </Button>
          </Link>
        </div>
      </div>
    </AuthWrapper>
  );
}
