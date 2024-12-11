import "./globals.css";

export const metadata = {
  title: "Psikotest App",
  description: "web is under developed",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}

// "use client";

// import "./globals.css";
// import { Inter } from "next/font/google";
// import { TimerProvider } from "../context/TimerContext"; // Use TimerProvider instead of TimerContext.Provider
// import { NextUIProvider } from "@nextui-org/system";

// const inter = Inter({ subsets: ["latin"] });

// // export const metadata = {
// // title: "Psikotest App";
// // description: "web is under developed";
// // };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className={`antialiased`}>
//         <NextUIProvider>
//           <TimerProvider>
//             {" "}
//             {/* Use TimerProvider here */}
//             {children}
//           </TimerProvider>
//         </NextUIProvider>
//       </body>
//     </html>
//   );
// }
