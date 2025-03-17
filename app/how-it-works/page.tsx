import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import AppLayout from "@/components/app-layout"

export default function HowItWorksPage() {
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
              How It Works
            </h1>
            <p className="text-white/70 text-lg">
              Discover how Artistry AI transforms your ideas into stunning wall art and apparel designs in just a few
              simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-black/30 border border-white/10">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-400">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Describe Your Vision</h3>
                <p className="text-white/70">
                  Start by describing what you want to create. Use our AI prompt enhancer to refine your ideas and get
                  the best results.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/30 border border-white/10">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-pink-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-pink-400">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">AI Generation</h3>
                <p className="text-white/70">
                  Our advanced AI algorithms transform your description into a unique, high-quality design tailored to
                  your specifications.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/30 border border-white/10">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-400">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Customize & Preview</h3>
                <p className="text-white/70">
                  Fine-tune your design and see how it looks in real-world settings with our virtual try-on tools.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">The Design Process</h2>
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <h3 className="text-xl font-bold mb-2 text-white">1. Describe Your Vision</h3>
                  <p className="text-white/70 mb-4">
                    Start by entering a description of what you want to create. Be as specific or as general as you
                    like. Our AI works with both detailed instructions and simple concepts.
                  </p>
                  <p className="text-white/70">
                    You can also select from our curated list of design suggestions if you need inspiration, or upload
                    an existing image to use as a starting point.
                  </p>
                </div>
                <div className="md:w-1/2 bg-black/50 rounded-lg overflow-hidden">
                  <img
                    src="/placeholder.svg?height=300&width=500&text=Prompt+Input"
                    alt="Prompt input interface"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2 order-2 md:order-1 bg-black/50 rounded-lg overflow-hidden">
                  <img
                    src="/placeholder.svg?height=300&width=500&text=AI+Generation"
                    alt="AI generation process"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 order-1 md:order-2">
                  <h3 className="text-xl font-bold mb-2 text-white">2. AI Generation</h3>
                  <p className="text-white/70 mb-4">
                    Our advanced AI algorithms analyze your description and generate a unique design based on your
                    specifications. The AI has been trained on millions of images and can create designs in various
                    styles and aesthetics.
                  </p>
                  <p className="text-white/70">
                    The generation process typically takes less than a minute, and you can regenerate as many times as
                    you like until you're satisfied with the result.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <h3 className="text-xl font-bold mb-2 text-white">3. Customize & Preview</h3>
                  <p className="text-white/70 mb-4">
                    Once your design is generated, you can customize it further by adjusting its position, size, and
                    rotation. You can also see how it looks in real-world settings with our virtual try-on tools.
                  </p>
                  <p className="text-white/70">
                    For wall art, you can see how your design looks in different room types and on different wall
                    colors. For apparel, you can see how it looks on different styles and colors of clothing.
                  </p>
                </div>
                <div className="md:w-1/2 bg-black/50 rounded-lg overflow-hidden">
                  <img
                    src="/placeholder.svg?height=300&width=500&text=Virtual+Try-On"
                    alt="Virtual try-on interface"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2 order-2 md:order-1 bg-black/50 rounded-lg overflow-hidden">
                  <img
                    src="/placeholder.svg?height=300&width=500&text=Order+and+Delivery"
                    alt="Order and delivery process"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 order-1 md:order-2">
                  <h3 className="text-xl font-bold mb-2 text-white">4. Order and Delivery</h3>
                  <p className="text-white/70 mb-4">
                    When you're happy with your design, you can place an order for physical products. We offer a variety
                    of high-quality materials and sizes for both wall art and apparel.
                  </p>
                  <p className="text-white/70">
                    Your order is produced using state-of-the-art printing technology and shipped directly to your door.
                    Production typically takes 1-3 business days, and shipping times vary by location.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Our Technology</h2>
            <p className="text-white/70 mb-6">
              Artistry AI uses cutting-edge artificial intelligence and machine learning technologies to create unique,
              high-quality designs. Here's a brief overview of the technologies that power our platform:
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">Advanced AI Models</h3>
                <p className="text-white/70">
                  Our platform uses state-of-the-art generative AI models that have been trained on millions of images
                  to understand and create art in various styles and aesthetics. These models can interpret natural
                  language descriptions and transform them into visual designs.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-white">Natural Language Processing</h3>
                <p className="text-white/70">
                  We use advanced natural language processing (NLP) to understand and enhance your design prompts. Our
                  AI can interpret your descriptions, identify key elements, and suggest improvements to help you get
                  the best results.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-white">Virtual Try-On Technology</h3>
                <p className="text-white/70">
                  Our virtual try-on tools use computer vision and 3D rendering to show you how your designs will look
                  in real-world settings. This helps you visualize the final product before making a purchase.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-white">High-Quality Production</h3>
                <p className="text-white/70">
                  We partner with top-tier production facilities that use the latest printing technologies to ensure
                  your designs are reproduced with exceptional quality and durability.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full"
              asChild
            >
              <Link href="/design">
                Start Creating Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

