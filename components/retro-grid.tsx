"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface RetroGridProps {
  className?: string
}

export default function RetroGrid({ className }: RetroGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Define colors
    const teal = "rgba(64, 224, 208, 0.2)"
    const magenta = "rgba(255, 0, 255, 0.2)"

    // Draw grid
    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw horizontal lines
      const horizSpacing = 40
      const horizCount = Math.ceil(canvas.height / horizSpacing)

      for (let i = 0; i < horizCount; i++) {
        const y = i * horizSpacing

        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)

        // Alternate colors
        ctx.strokeStyle = i % 2 === 0 ? teal : magenta
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Draw vertical lines
      const vertSpacing = 40
      const vertCount = Math.ceil(canvas.width / vertSpacing)

      for (let i = 0; i < vertCount; i++) {
        const x = i * vertSpacing

        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)

        // Alternate colors
        ctx.strokeStyle = i % 2 === 0 ? magenta : teal
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Draw perspective lines (converging to center)
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const lineCount = 12

      for (let i = 0; i < lineCount; i++) {
        const angle = (i / lineCount) * Math.PI * 2
        const endX = centerX + Math.cos(angle) * canvas.width
        const endY = centerY + Math.sin(angle) * canvas.height

        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(endX, endY)

        const gradient = ctx.createLinearGradient(centerX, centerY, endX, endY)
        gradient.addColorStop(0, "rgba(255, 0, 255, 0.4)")
        gradient.addColorStop(1, "rgba(64, 224, 208, 0)")

        ctx.strokeStyle = gradient
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }

    drawGrid()
    window.addEventListener("resize", drawGrid)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("resize", drawGrid)
    }
  }, [])

  return <canvas ref={canvasRef} className={cn("absolute inset-0 z-0 opacity-30", className)} aria-hidden="true" />
}
