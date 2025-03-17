"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Sparkles, ImageIcon, Palette, Shirt, Star } from "lucide-react"
import AppLayout from "@/components/app-layout"

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Example designs
  const featuredDesigns = [
    {
      id: 1,
      title: "Cosmic Dreamscape",
      image: "/placeholder.svg?height=400&width=600&text=Cosmic",
      rating: 4.8,
    },
    {
      id: 2,
      title: "Neon Wilderness",
      image: "/placeholder.svg?height=400&width=600&text=Neon",
      rating: 4.9,
    },
    {
      id: 3,
      title: "Abstract Geometry",
      image: "/placeholder.svg?height=400&width=600&text=Abstract",
      rating: 4.7,
    },
  ]

  // Features list
  const features = [
    {
      icon: <Palette className="h-10 w-10 text-purple-400" />,
      title: "AI-Powered Design",
      description: "Create stunning designs with our intelligent AI assistant that understands your vision.",
    },
    {
      icon: <Shirt className="h-10 w-10 text-pink-400" />,
      title: "Virtual Try-On",
      description: "See your designs on realistic models before ordering your custom apparel.",
    },
    {
      icon: <ImageIcon className="h-10 w-10 text-purple-400" />,
      title: "Wall Art Creation",
      description: "Transform your ideas into beautiful wall art with our advanced generation tools.",
    },
  ]

  return (
    <AppLayout>
      <AnimatePresence>
        {isLoaded && (
          <div className="min-h-screen">
            {/* Hero Section */}
            <motion.section
              className="relative py-20 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black to-purple-900/30 z-0"></div>
              <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-20 z-[-1]"></div>

              <div className="container mx-auto px-4 relative z-10">
                <motion.div
                  className="max-w-3xl mx-auto text-center space-y-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                    Transform Your Ideas Into Wearable Art
                  </h1>
                  <p className="text-lg md:text-xl text-white/70">
                    Design custom t-shirts and wall art with our AI-powered platform. Create, visualize, and order your
                    unique designs in minutes.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Link href="/design">
                      <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full text-white">
                        Start Creating
                        <Sparkles className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/gallery">
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 rounded-full"
                      >
                        Explore Gallery
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </motion.section>

            {/* Features Section */}
            <section className="py-20 bg-black/90">
              <div className="container mx-auto px-4">
                <motion.div
                  className="text-center mb-16"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                    Create With Confidence
                  </h2>
                  <p className="text-lg text-white/70 max-w-2xl mx-auto">
                    Our platform combines AI-powered design with easy visualization tools to help you create perfect
                    custom products.
                  </p>
                </motion.div>

                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  {features.map((feature, index) => (
                    <motion.div key={index} variants={itemVariants}>
                      <Card className="h-full bg-black/50 backdrop-blur-md border border-white/10 p-6 hover:border-purple-500/50 transition-all duration-300">
                        <div className="flex flex-col h-full">
                          <div className="mb-4">{feature.icon}</div>
                          <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                          <p className="text-white/70 flex-grow">{feature.description}</p>
                          <Link
                            href={index === 0 ? "/design" : index === 1 ? "/try-on" : "/design"}
                            className="mt-4 text-purple-400 hover:text-purple-300 inline-flex items-center"
                          >
                            Learn more <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>

            {/* Featured Designs */}
            <section className="py-20 bg-gradient-to-b from-black/90 to-purple-900/20">
              <div className="container mx-auto px-4">
                <motion.div
                  className="text-center mb-16"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                    Featured Designs
                  </h2>
                  <p className="text-lg text-white/70 max-w-2xl mx-auto">
                    Get inspired by our community's most popular creations
                  </p>
                </motion.div>

                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  {featuredDesigns.map((design, index) => (
                    <motion.div key={design.id} variants={itemVariants}>
                      <Card className="overflow-hidden bg-black/50 backdrop-blur-md border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={design.image || "/placeholder.svg"}
                            alt={design.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-white font-medium">{design.title}</h3>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                                <span className="text-white/90 text-sm">{design.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  className="text-center mt-10"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Link href="/gallery">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full">
                      View All Designs
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-black z-0"></div>
              <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10 z-[-1]"></div>

              <div className="container mx-auto px-4 relative z-10">
                <motion.div
                  className="max-w-3xl mx-auto text-center space-y-8 bg-black/50 backdrop-blur-md border border-white/10 p-10 rounded-2xl"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                    Ready to Create Your Masterpiece?
                  </h2>
                  <p className="text-lg text-white/70">
                    Join thousands of creators who have brought their ideas to life. Start designing your custom apparel
                    or wall art today.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Link href="/design">
                      <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full text-white">
                        Start Creating Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 rounded-full"
                      >
                        Sign Up Free
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </section>
          </div>
        )}
      </AnimatePresence>
    </AppLayout>
  )
}

