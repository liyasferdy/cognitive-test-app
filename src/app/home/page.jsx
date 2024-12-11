"use client";

import { Card } from "@nextui-org/card";
import Link from "next/link";
import AuthWrapper from "../authWrapper"; // Import the AuthWrapper
import { useRouter } from "next/navigation"; // Import useRouter untuk navigasi

export default function App() {
  const router = useRouter();

  // Fungsi untuk logout
  const logout = () => {
    // Hapus token dari localStorage atau cookies
    localStorage.removeItem("access_token");

    // Redirect ke halaman login
    router.push("/");
  };

  return (
    <AuthWrapper>
      <div className="justify-center min-h-screen flex flex-col items-center">
        {/* Header dengan tombol logout */}
        <div className="w-full flex justify-center p-4">
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-3 gap-8 p-8 w-full max-w-4xl">
          {/* Row 1 */}
          <Link href="/test-mm/instruction">
            <Card
              hoverable
              clickable
              className="px-10 py-5 hover:-translate-y-3 transition-all hover:bg-cyan-500 hover:text-white border-solid border-2 hover:border-0"
            >
              <h4 className="text-center">Test MM</h4>
            </Card>
          </Link>
          <Link href="/test-ma/instruction">
            <Card
              hoverable
              clickable
              className="px-10 py-5 hover:-translate-y-3 transition-all hover:bg-cyan-500 hover:text-white border-solid border-2 hover:border-0"
            >
              <h4 className="text-center">Test MA</h4>
            </Card>
          </Link>
          <Link href="/test-mv/instruction">
            <Card
              hoverable
              clickable
              className="px-10 py-5 hover:-translate-y-3 transition-all hover:bg-cyan-500 hover:text-white border-solid border-2 hover:border-0"
            >
              <h4 className="text-center">Test MV</h4>
            </Card>
          </Link>

          {/* Row 2 */}
          <Link href="/test-ms/instruction">
            <Card
              hoverable
              clickable
              className="px-10 py-5 hover:-translate-y-3 transition-all hover:bg-cyan-500 hover:text-white border-solid border-2 hover:border-0"
            >
              <h4 className="text-center">Test MS</h4>
            </Card>
          </Link>
          <Link href="/test-mw/instruction">
            <Card
              hoverable
              clickable
              className="px-10 py-5 hover:-translate-y-3 transition-all hover:bg-cyan-500 hover:text-white border-solid border-2 hover:border-0"
            >
              <h4 className="text-center">Test MW</h4>
            </Card>
          </Link>
          <Link href="/home">
            <Card
              hoverable
              clickable
              className="px-10 py-5 hover:-translate-y-3 transition-all hover:bg-cyan-500 hover:text-white border-solid border-2 hover:border-0"
            >
              <h4 className="text-center">Test 6</h4>
            </Card>
          </Link>

          {/* Row 3 */}
          <Link href="/home">
            <Card
              hoverable
              clickable
              className="px-10 py-5 hover:-translate-y-3 transition-all hover:bg-cyan-500 hover:text-white border-solid border-2 hover:border-0"
            >
              <h4 className="text-center">Test 7</h4>
            </Card>
          </Link>
          <Link href="/home">
            <Card
              hoverable
              clickable
              className="px-10 py-5 hover:-translate-y-3 transition-all hover:bg-cyan-500 hover:text-white border-solid border-2 hover:border-0"
            >
              <h4 className="text-center">Test 8</h4>
            </Card>
          </Link>
          <Link href="/home">
            <Card
              hoverable
              clickable
              className="px-10 py-5 hover:-translate-y-3 transition-all hover:bg-cyan-500 hover:text-white border-solid border-2 hover:border-0"
            >
              <h4 className="text-center">Test 9</h4>
            </Card>
          </Link>
        </div>
      </div>
    </AuthWrapper>
  );
}
