import { generateMetadata, pageMetadata } from "@/lib/metadata"

export const metadata = generateMetadata({
  ...pageMetadata.auth,
  path: "/auth"
})

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
