import { Rubik } from "next/font/google"

const rubik = Rubik({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-rubik-ar",
})

export default function SurveyArLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={rubik.className}>
      {children}
    </div>
  )
}
