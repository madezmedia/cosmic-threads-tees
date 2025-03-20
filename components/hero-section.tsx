"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const images = [
    "/placeholder.svg?height=600&width=800&text=AI+Wall+Art+1",
    "/placeholder.svg?height=600&width=800&text=AI+Wall+Art+2",
    "/placeholder.svg?height=600&width=800&text=AI+Wall+Art+3",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row items-center gap-8">
        <div className="flex flex-col gap-4 md:w-1/2">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
            Design Custom Wall Art with <span className="text-primary">AI</span>
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            Create unique, personalized wall art in minutes with our AI-powered design tool. No design skills required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button size="lg" asChild>
              <Link href="/create">
                Start Designing <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/how-it-works">Learn More</Link>
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 relative">
          <div className="relative w-full max-w-md mx-auto aspect-[4/3] rounded-xl overflow-hidden shadow-xl">
            {images.map((image, index) => (
              <div
                key={index}
                className="absolute inset-0"
                style={{
                  opacity: currentImageIndex === index ? 1 : 0,
                  zIndex: currentImageIndex === index ? 10 : 0,
                  transition: "opacity 0.5s ease-in-out",
                }}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Wall art design example ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentImageIndex === index ? "bg-primary w-4" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <span className="sr-only">Go to slide {index + 1}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
