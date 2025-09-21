import type React from "react"
import type { Metadata } from "next"
import { Rubik } from "next/font/google"
import "../globals.css"

const rubik = Rubik({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-rubik",
})

export const metadata: Metadata = {
  title: "ExploAI - The Intelligent Assistant",
  description: "Your academic advisor to answer the most important inquiries for new students",
    generator: 'Chameleon v2.0'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className={`${rubik.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
