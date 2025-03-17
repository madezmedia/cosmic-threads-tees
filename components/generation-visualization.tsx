"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles } from "lucide-react"
import type { GenerationStatus } from "@/hooks/use-image-generation"

interface GenerationVisualizationProps {
  status: GenerationStatus
  progress: number
}

export default function GenerationVisualization({ status, progress }: GenerationVisualizationProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; color: string }>>(
    [],
  )

  // Generate particles for the visualization
  useEffect(() => {
    if (status === "generating" || status === "finalizing") {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        color: getRandomColor(),
      }))
      setParticles(newParticles)
    } else {
      setParticles([])
    }
  }, [status])

  const getRandomColor = () => {
    const colors = [
      "rgba(147, 51, 234, 0.7)", // Purple
      "rgba(236, 72, 153, 0.7)", // Pink
      "rgba(59, 130, 246, 0.7)", // Blue
      "rgba(16, 185, 129, 0.7)", // Green
      "rgba(245, 158, 11, 0.7)", // Amber
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  // Different visualizations based on generation status
  const renderVisualization = () => {
    switch (status) {
      case "preparing":
        return (
          <div className="flex items-center justify-center h-full">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
              <Sparkles className="h-16 w-16 text-blue-400" />
            </motion.div>
          </div>
        )

      case "queued":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="relative w-20 h-20">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-yellow-400"
                  style={{ opacity: 0.5 }}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.5,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>
        )

      case "generating":
        return (
          <div className="relative w-full h-full bg-black/30">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full"
                style={{
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  backgroundColor: particle.color,
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                }}
                animate={{
                  x: [0, Math.random() * 20 - 10, 0],
                  y: [0, Math.random() * 20 - 10, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            ))}

            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-20 blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />

              <motion.div
                className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur-xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  rotate: [0, -180, -360],
                }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />

              <Sparkles className="absolute h-10 w-10 text-purple-400" />
            </div>
          </div>
        )

      case "finalizing":
        return (
          <div className="relative w-full h-full">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-40 h-40 rounded-full border-4 border-green-500/30"
                animate={{ scale: [0, 1], opacity: [0, 0.5] }}
                transition={{ duration: 1 }}
              />

              <motion.div
                className="absolute w-32 h-32 rounded-full border-4 border-purple-500/30"
                animate={{ scale: [0, 1], opacity: [0, 0.5] }}
                transition={{ duration: 1, delay: 0.2 }}
              />

              <motion.div
                className="absolute w-24 h-24 rounded-full border-4 border-pink-500/30"
                animate={{ scale: [0, 1], opacity: [0, 0.5] }}
                transition={{ duration: 1, delay: 0.4 }}
              />

              <motion.div
                className="absolute"
                animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                <Sparkles className="h-12 w-12 text-green-400" />
              </motion.div>
            </div>
          </div>
        )

      case "completed":
        return (
          <motion.div
            className="w-full h-full flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20"
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            />
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="w-full h-full relative overflow-hidden rounded-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderVisualization()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

