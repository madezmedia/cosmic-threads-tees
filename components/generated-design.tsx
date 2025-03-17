"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Loader2, RotateCw, Download, ZoomIn, ZoomOut, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface GeneratedDesignProps {
  designImage: string
  isLoading: boolean
}

export default function GeneratedDesign({ designImage, isLoading }: GeneratedDesignProps) {
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(100)

  useEffect(() => {
    console.log("GeneratedDesign received image:", designImage)
    console.log("Loading state:", isLoading)
  }, [designImage, isLoading])

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleZoomIn = () => {
    if (zoom < 150) setZoom((prev) => prev + 10)
  }

  const handleZoomOut = () => {
    if (zoom > 50) setZoom((prev) => prev - 10)
  }

  const handleDownload = () => {
    // In a real app, this would download the image
    alert("Downloading high-resolution image...")
  }

  const handleShare = () => {
    // In a real app, this would open share options
    alert("Opening share options...")
  }

  return (
    <Card className="bg-black/50 backdrop-blur-md border border-white/10 overflow-hidden">
      <CardContent className="p-0 relative">
        <div className="aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center text-center p-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Loader2 className="h-16 w-16 text-purple-500 mb-4" />
              </motion.div>
              <p className="text-xl font-medium text-white">Creating your masterpiece...</p>
              <p className="text-sm text-white/60 mt-2">Our AI is crafting something unique just for you</p>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <motion.img
                src={designImage || "/placeholder.svg?text=No+Image+Available"}
                alt="Generated wall art design"
                className="max-w-full max-h-full object-contain"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: rotation,
                  transformOrigin: "center",
                }}
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                }}
                transition={{ duration: 0.5 }}
                onError={(e) => {
                  console.error("Image failed to load:", e)
                  e.currentTarget.src = "/placeholder.svg?text=Image+Load+Error"
                }}
              />
            </div>
          )}
        </div>

        {!isLoading && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/70 backdrop-blur-md rounded-full p-2 border border-white/10">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-white hover:bg-white/10 h-10 w-10"
              onClick={handleRotate}
            >
              <RotateCw className="h-5 w-5" />
              <span className="sr-only">Rotate design</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-white hover:bg-white/10 h-10 w-10"
              onClick={handleZoomIn}
              disabled={zoom >= 150}
            >
              <ZoomIn className="h-5 w-5" />
              <span className="sr-only">Zoom in</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-white hover:bg-white/10 h-10 w-10"
              onClick={handleZoomOut}
              disabled={zoom <= 50}
            >
              <ZoomOut className="h-5 w-5" />
              <span className="sr-only">Zoom out</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-white hover:bg-white/10 h-10 w-10"
              onClick={handleDownload}
            >
              <Download className="h-5 w-5" />
              <span className="sr-only">Download design</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-white hover:bg-white/10 h-10 w-10"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
              <span className="sr-only">Share design</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

