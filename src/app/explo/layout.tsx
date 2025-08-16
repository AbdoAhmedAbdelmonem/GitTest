import type React from "react"
import type { Metadata } from "next"
import { Cairo, Amiri } from "next/font/google"
import "../globals.css"

const cairo = Cairo({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-cairo",
})

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-amiri",
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
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${amiri.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}

