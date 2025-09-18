import { generateMetadata, pageMetadata } from "@/lib/metadata"

export const metadata = generateMetadata({
  ...pageMetadata.about,
  path: "/about"
})