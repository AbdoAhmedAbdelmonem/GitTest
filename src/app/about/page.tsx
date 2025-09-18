import { generateMetadata, pageMetadata } from "@/lib/metadata"

export const metadata = generateMetadata({
  ...pageMetadata.about,
  path: "/about"
})

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-4">About Chameleon</h1>
      <p className="text-lg">
        Chameleon is a platform for learning and skill development.
      </p>
    </div>
  );
}