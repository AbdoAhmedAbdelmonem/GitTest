import type { Metadata } from "next";
import { Inter, Roboto_Mono, Rubik } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";
import { NotificationProvider } from "@/hooks/use-notifications";
import DevToolsProtection from "@/components/DevToolsProtection";
import { AdminPromotionBanner } from "@/components/admin-promotion-banner";

// Inter as Geist Sans replacement
const geistSans = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

// Roboto Mono as Geist Mono replacement
const geistMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

// Rubik font
const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
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
        className={`${geistSans.variable} ${geistMono.variable} ${rubik.variable} antialiased`}
      >
        {/* Admin Promotion Banner */}
        <AdminPromotionBanner />
        
        {/* لف الـ children جوه NotificationProvider وبعدها ToastProvider */}
        <NotificationProvider>
          <ToastProvider>{children}</ToastProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
