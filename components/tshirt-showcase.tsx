"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const tshirtDesigns = [
  {
    id: 1,
    name: "Cosmic Explorer",
    image: "/placeholder.svg?height=600&width=500&text=Cosmic+Explorer",
    color: "bg-indigo-100 dark:bg-indigo-950",
  },
  {
    id: 2,
    name: "Retro Future",
    image: "/placeholder.svg?height=600&width=500&text=Retro+Future",
    color: "bg-magenta/20",
  },
  {
    id: 3,
    name: "Atomic Age",
    image: "/placeholder.svg?height=600&width=500&text=Atomic+Age",
    color: "bg-teal/20",
  },
]

export default function TshirtShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const goToNext = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % tshirtDesigns.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const goToPrevious = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? tshirtDesigns.length - 1 : prevIndex - 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  useEffect(() => {
    const interval = setInterval(goToNext, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full max-w-md mx-auto aspect-[3/4] rounded-xl overflow-hidden">
      <div
        className={cn("absolute inset-0 transition-colors duration-500 ease-in-out", tshirtDesigns[currentIndex].color)}
      />

      <div className="relative h-full w-full flex items-center justify-center">
        <img
          src={tshirtDesigns[currentIndex].image || "/placeholder.svg"}
          alt={tshirtDesigns[currentIndex].name}
          className={cn(
            "h-full w-auto object-contain transition-opacity duration-500",
            isAnimating ? "opacity-0" : "opacity-100",
          )}
        />

        <div className="absolute bottom-4 left-0 right-0 text-center">
          <h3 className="text-lg font-medium bg-black/80 mx-auto inline-block px-4 py-2 rounded-full font-mono tracking-wide text-chrome">
            {tshirtDesigns[currentIndex].name}
          </h3>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full h-10 w-10 border border-chrome/20"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6 text-chrome" />
        <span className="sr-only">Previous design</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full h-10 w-10 border border-chrome/20"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6 text-chrome" />
        <span className="sr-only">Next design</span>
      </Button>

      <div className="absolute bottom-16 left-0 right-0 flex justify-center space-x-2">
        {tshirtDesigns.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              currentIndex === index ? "bg-teal w-4" : "bg-chrome/40",
            )}
            onClick={() => {
              setIsAnimating(true)
              setCurrentIndex(index)
              setTimeout(() => setIsAnimating(false), 500)
            }}
          >
            <span className="sr-only">Go to slide {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

