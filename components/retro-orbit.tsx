"use client"

import { useEffect, useRef } from "react"

export default function RetroOrbit() {
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
    const teal = "rgba(64, 224, 208, 0.5)"
    const magenta = "rgba(255, 0, 255, 0.5)"
    const chrome = "rgba(192, 192, 192, 0.3)"

    // Create orbital paths
    const orbits = [
      { x: canvas.width * 0.7, y: canvas.height * 0.5, radius: 100, color: teal, speed: 0.001 },
      { x: canvas.width * 0.3, y: canvas.height * 0.3, radius: 80, color: magenta, speed: 0.002 },
      { x: canvas.width * 0.5, y: canvas.height * 0.7, radius: 120, color: chrome, speed: 0.0015 },
    ]

    // Animation variables
    let angle = 0

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw orbits and planets
      orbits.forEach((orbit) => {
        // Draw orbit path
        ctx.beginPath()
        ctx.ellipse(orbit.x, orbit.y, orbit.radius, orbit.radius * 0.4, 0, 0, Math.PI * 2)
        ctx.strokeStyle = orbit.color
        ctx.lineWidth = 1
        ctx.stroke()

        // Draw planet
        const planetX = orbit.x + Math.cos(angle * orbit.speed * 10) * orbit.radius
        const planetY = orbit.y + Math.sin(angle * orbit.speed * 10) * orbit.radius * 0.4

        ctx.beginPath()
        ctx.arc(planetX, planetY, 4, 0, Math.PI * 2)
        ctx.fillStyle = orbit.color
        ctx.fill()

        // Draw glow
        ctx.beginPath()
        ctx.arc(planetX, planetY, 8, 0, Math.PI * 2)
        const gradient = ctx.createRadialGradient(planetX, planetY, 0, planetX, planetY, 8)
        gradient.addColorStop(0, orbit.color)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
        ctx.fillStyle = gradient
        ctx.fill()
      })

      angle += 0.01
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-30" aria-hidden="true" />
}

