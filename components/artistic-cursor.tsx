"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function ArtisticCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    const mouseEnter = () => setIsActive(true)
    const mouseLeave = () => setIsActive(false)

    window.addEventListener("mousemove", mouseMove)
    document.addEventListener("mouseenter", mouseEnter)
    document.addEventListener("mouseleave", mouseLeave)

    return () => {
      window.removeEventListener("mousemove", mouseMove)
      document.removeEventListener("mouseenter", mouseEnter)
      document.removeEventListener("mouseleave", mouseLeave)
    }
  }, [])

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      opacity: isActive ? 1 : 0,
    },
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-white/30 pointer-events-none z-50 mix-blend-difference"
        variants={variants}
        animate="default"
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-white pointer-events-none z-50 mix-blend-difference"
        variants={variants}
        animate="default"
        transition={{ type: "spring", stiffness: 750, damping: 28 }}
      />
    </>
  )
}

