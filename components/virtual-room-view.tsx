"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface VirtualRoomViewProps {
  roomType: string
  artSize: number
  artPosition: { x: number; y: number }
  artImage: string | null
}

export default function VirtualRoomView({ roomType, artSize, artPosition, artImage }: VirtualRoomViewProps) {
  const [currentView, setCurrentView] = useState(0)

  // In a real app, we would have different room images based on the roomType
  const roomViews = [
    `/placeholder.svg?height=800&width=1200&text=${roomType.replace("-", "+")}+View+1`,
    `/placeholder.svg?height=800&width=1200&text=${roomType.replace("-", "+")}+View+2`,
    `/placeholder.svg?height=800&width=1200&text=${roomType.replace("-", "+")}+View+3`,
  ]

  const nextView = () => {
    setCurrentView((prev) => (prev + 1) % roomViews.length)
  }

  const prevView = () => {
    setCurrentView((prev) => (prev === 0 ? roomViews.length - 1 : prev - 1))
  }

  return (
    <div className="relative">
      <div className="aspect-[4/3] bg-black rounded-lg overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            className="relative w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={roomViews[currentView] || "/placeholder.svg"}
              alt="Room view"
              className="w-full h-full object-cover"
            />

            {artImage && (
              <motion.div
                className="absolute flex items-center justify-center"
                style={{
                  top: `${artPosition.y}%`,
                  left: `${artPosition.x}%`,
                  transformOrigin: "center",
                }}
                animate={{
                  x: "-50%",
                  y: "-50%",
                  scale: artSize / 100,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <img
                  src={artImage || "/placeholder.svg?height=600&width=800&text=Wall+Art+Design"}
                  alt="Wall art overlay"
                  className="max-w-full max-h-full object-contain drop-shadow-2xl"
                />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 left-2 transform -translate-y-1/2 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10 h-10 w-10"
        onClick={prevView}
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="sr-only">Previous view</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 right-2 transform -translate-y-1/2 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10 h-10 w-10"
        onClick={nextView}
      >
        <ArrowRight className="h-5 w-5" />
        <span className="sr-only">Next view</span>
      </Button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {roomViews.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              currentView === index ? "bg-gradient-to-r from-purple-500 to-pink-500 w-6" : "bg-white/30"
            }`}
            onClick={() => setCurrentView(index)}
          >
            <span className="sr-only">Go to view {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

