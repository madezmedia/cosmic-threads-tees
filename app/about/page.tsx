import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import AppLayout from "@/components/app-layout"

export default function AboutPage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              About Artistry AI
            </h1>
            <p className="text-white/70 text-lg">
              Artistry AI is a cutting-edge platform that combines the power of artificial intelligence with human
              creativity to produce stunning, personalized wall art and apparel designs.
            </p>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Our Mission</h2>
            <p className="text-white/70 mb-4">
              Our mission is to democratize art creation and make it accessible to everyone, regardless of their
              artistic background or skills. We believe that everyone deserves to have beautiful, personalized art in
              their homes and on their clothing.
            </p>
            <p className="text-white/70">
              By leveraging the latest advancements in AI technology, we're able to transform simple text prompts into
              stunning visual masterpieces that reflect your unique vision and style.
            </p>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Our Technology</h2>
            <p className="text-white/70 mb-4">
              Artistry AI uses state-of-the-art machine learning models that have been trained on millions of images to
              understand and generate art in various styles and aesthetics. Our proprietary algorithms ensure that each
              creation is unique and tailored to your specifications.
            </p>
            <p className="text-white/70">
              We continuously improve our AI models to provide you with the best possible results, pushing the
              boundaries of what's possible in AI-generated art.
            </p>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Our Team</h2>
            <p className="text-white/70 mb-4">
              Artistry AI was founded by a team of artists, designers, and AI researchers who share a passion for art
              and technology. We're dedicated to creating tools that empower people to express themselves creatively.
            </p>
            <p className="text-white/70">
              Our diverse team brings together expertise from various fields, including computer vision, natural
              language processing, graphic design, and fine arts, to create a platform that truly understands and
              fulfills your creative vision.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

