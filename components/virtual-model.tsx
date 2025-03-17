"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RotateCw, RotateCcw } from "lucide-react"

interface VirtualModelProps {
  modelType: string
}

export default function VirtualModel({ modelType }: VirtualModelProps) {
  const [rotation, setRotation] = useState(0)

  const rotateLeft = () => {
    setRotation((prev) => (prev - 45) % 360)
  }

  const rotateRight = () => {
    setRotation((prev) => (prev + 45) % 360)
  }

  // In a real app, we would have different model images based on the modelType
  const modelImage = `/placeholder.svg?height=600&width=400&text=${modelType.replace("-", "+")}`

  return (
    <div className="relative">
      <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
        <div
          className="relative transition-transform duration-500 ease-in-out"
          style={{ transform: `rotateY(${rotation}deg)` }}
        >
          <img src={modelImage || "/placeholder.svg"} alt="Virtual model" className="max-h-[500px] object-contain" />
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/placeholder.svg?height=300&width=300&text=T-Shirt+Design"
              alt="T-shirt design overlay"
              className="max-w-[80%] max-h-[80%] object-contain"
              style={{ transform: `rotateY(${-rotation}deg)` }}
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full bg-white/80 dark:bg-black/80 h-10 w-10"
          onClick={rotateLeft}
        >
          <RotateCcw className="h-5 w-5" />
          <span className="sr-only">Rotate left</span>
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full bg-white/80 dark:bg-black/80 h-10 w-10"
          onClick={rotateRight}
        >
          <RotateCw className="h-5 w-5" />
          <span className="sr-only">Rotate right</span>
        </Button>
      </div>
    </div>
  )
}

