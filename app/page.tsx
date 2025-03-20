"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Sparkles, ImageIcon, Palette, Shirt, Star, Zap } from "lucide-react"
import AppLayout from "@/components/app-layout"
import RetroGrid from "@/components/retro-grid"
import RetroOrbit from "@/components/retro-orbit"

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

  // Steps for the design process
  const steps = [
    {
      number: 1,
      title: "Concept",
      icon: <Palette className="h-10 w-10 text-cosmicPurple" />,
      description: "Describe your design idea and select a style that matches your vision.",
    },
    {
      number: 2,
      title: "Customize",
      icon: <Shirt className="h-10 w-10 text-neonTeal" />,
      description: "Choose products and customize placement, colors, and size options.",
    },
    {
      number: 3,
      title: "Checkout",
      icon: <Zap className="h-10 w-10 text-magentaGlow" />,
      description: "Review your design and complete your order with secure checkout.",
    },
  ]

  return (
    <AppLayout>
      <AnimatePresence>
        {isLoaded && (
          <div className="min-h-screen bg-deepSpace">
            {/* Hero Section */}
            <motion.section
              className="relative py-20 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-deepSpace to-cosmicPurple/10 z-0"></div>
              <RetroGrid className="absolute inset-0 opacity-10 z-[-1]" />

              <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <motion.div
                    className="space-y-8"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <h1 className="text-4xl md:text-6xl font-display tracking-tight text-gradient bg-gradient-to-r from-cosmicPurple to-magentaGlow bg-clip-text text-transparent">
                      AI-POWERED COSMIC DESIGNS
                    </h1>
                    <p className="text-lg md:text-xl text-silverChrome">
                      Create stunning, unique t-shirts and wall art with our AI-powered design platform. Transform your ideas into reality in minutes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Link href="/create">
                        <Button variant="cosmic" size="lg" className="w-full sm:w-auto font-mono uppercase tracking-wider">
                          Start Creating
                          <Sparkles className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href="/gallery">
                        <Button
                          variant="chrome"
                          size="lg"
                          className="w-full sm:w-auto font-mono uppercase tracking-wider"
                        >
                          Explore Gallery
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    className="relative h-[400px]"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <RetroOrbit className="w-full h-full" />
                  </motion.div>
                </div>
              </div>
            </motion.section>

            {/* How It Works Section */}
            <section className="py-20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-deepSpace to-deepSpace/90 z-0"></div>
              
              <div className="container mx-auto px-4 relative z-10">
                <motion.div
                  className="text-center mb-16"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-3xl md:text-4xl font-display mb-4 text-gradient bg-gradient-to-r from-cosmicPurple to-magentaGlow bg-clip-text text-transparent">
                    HOW IT WORKS
                  </h2>
                  <p className="text-lg text-silverChrome/70 max-w-2xl mx-auto">
                    Our streamlined three-step process makes it easy to create custom designs
                  </p>
                </motion.div>

                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-8"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  {steps.map((step, index) => (
                    <motion.div key={index} variants={itemVariants}>
                      <Card variant="glass" className="h-full border-silverChrome/20 hover:border-silverChrome/40 transition-all duration-300">
                        <div className="flex flex-col h-full p-6 items-center text-center">
                          <div className="mb-6 relative">
                            <div className="absolute inset-0 bg-deepSpace rounded-full blur-md"></div>
                            <div className="relative h-16 w-16 rounded-full bg-deepSpace/80 border border-silverChrome/30 flex items-center justify-center">
                              <span className="font-mono text-2xl font-bold text-silverChrome">{step.number}</span>
                            </div>
                          </div>
                          <div className="mb-4">{step.icon}</div>
                          <h3 className="text-xl font-display mb-3 text-silverChrome uppercase tracking-wider">{step.title}</h3>
                          <p className="text-silverChrome/70 flex-grow">{step.description}</p>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>

            {/* Featured Designs */}
            <section className="py-20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-deepSpace/90 to-deepSpace z-0"></div>
              <RetroGrid className="absolute inset-0 opacity-5 z-[-1]" />

              <div className="container mx-auto px-4 relative z-10">
                <motion.div
                  className="text-center mb-16"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-3xl md:text-4xl font-display mb-4 text-gradient bg-gradient-to-r from-cosmicPurple to-magentaGlow bg-clip-text text-transparent">
                    FEATURED DESIGNS
                  </h2>
                  <p className="text-lg text-silverChrome/70 max-w-2xl mx-auto">
                    Get inspired by our community's most popular creations
                  </p>
                </motion.div>

                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-8"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  {featuredDesigns.map((design, index) => (
                    <motion.div key={design.id} variants={itemVariants}>
                      <Card variant="glass" className="overflow-hidden border-silverChrome/20 hover:border-neonTeal/50 transition-all duration-300">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={design.image || "/placeholder.svg"}
                            alt={design.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-deepSpace/90 to-transparent p-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-silverChrome font-mono uppercase tracking-wider">{design.title}</h3>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-neonTeal fill-neonTeal mr-1" />
                                <span className="text-silverChrome/90 text-sm">{design.rating}</span>
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
                    <Button variant="chrome" className="font-mono uppercase tracking-wider">
                      View All Designs
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cosmicPurple/10 to-deepSpace z-0"></div>
              <RetroGrid className="absolute inset-0 opacity-10 z-[-1]" />

              <div className="container mx-auto px-4 relative z-10">
                <motion.div
                  className="max-w-3xl mx-auto text-center space-y-8 bg-deepSpace/70 backdrop-blur-md border border-silverChrome/20 p-10 rounded-2xl"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl md:text-4xl font-display text-gradient bg-gradient-to-r from-cosmicPurple to-magentaGlow bg-clip-text text-transparent">
                    READY TO CREATE YOUR MASTERPIECE?
                  </h2>
                  <p className="text-lg text-silverChrome/80">
                    Join thousands of creators who have brought their ideas to life. Start designing your custom apparel
                    or wall art today.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Link href="/create">
                      <Button variant="gradient" size="lg" className="w-full sm:w-auto font-mono uppercase tracking-wider">
                        Start Creating Now
                        <Sparkles className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button
                        variant="chrome"
                        size="lg"
                        className="w-full sm:w-auto font-mono uppercase tracking-wider"
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
