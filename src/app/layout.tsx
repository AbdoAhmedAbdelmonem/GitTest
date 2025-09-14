import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";

// بديل Geist → Inter
const geistSans = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

// بديل Geist Mono → Roboto Mono
const geistMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Chameleon | Future Skills",
  description:
    "Master your future skills with Chameleon, the ultimate platform for learning and growth With a focus on technology, design, and innovation.",
  icons: {
    icon: "/images/1212-removebg-preview.png",
    apple: "/images/1212-removebg-preview.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
