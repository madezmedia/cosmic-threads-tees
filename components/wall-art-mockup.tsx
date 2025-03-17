"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, Download, Share2 } from "lucide-react"
import { generateWallArtMockup } from "@/lib/wall-art-service"
import type { PrintfulProduct } from "@/lib/printful-api"

interface WallArtMockupProps {
  product: PrintfulProduct
  variantId: number
  designImageUrl: string
}

export default function WallArtMockup({ product, variantId, designImageUrl }: WallArtMockupProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [mockupImages, setMockupImages] = useState<string[]>([])
  const [currentMockupIndex, setCurrentMockupIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (product && variantId && designImageUrl) {
      generateMockup()
    }
  }, [product, variantId, designImageUrl])

  const generateMockup = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await generateWallArtMockup(designImageUrl, product.id, variantId)

      if (result.mockups && result.mockups.length > 0) {
        // Extract mockup image URLs
        const mockupUrls = result.mockups.map((mockup: any) => mockup.mockup_url)
        setMockupImages(mockupUrls)
      } else {
        setError("No mockups were generated. Please try again.")
      }
    } catch (error) {
      console.error("Error generating mockup:", error)
      setError("Failed to generate mockup. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (mockupImages.length === 0) return

    const link = document.createElement("a")
    link.href = mockupImages[currentMockupIndex]
    link.download = `wall-art-mockup-${product.id}-${variantId}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = () => {
    if (mockupImages.length === 0) return

    if (navigator.share) {
      navigator
        .share({
          title: `${product.name} Wall Art`,
          text: "Check out my custom wall art design!",
          url: mockupImages[currentMockupIndex],
        })
        .catch(console.error)
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard
        .writeText(mockupImages[currentMockupIndex])
        .then(() => alert("Mockup URL copied to clipboard!"))
        .catch(() => alert("Failed to copy URL. Please try again."))
    }
  }

  const handleNextMockup = () => {
    setCurrentMockupIndex((prev) => (prev + 1) % mockupImages.length)
  }

  const handlePreviousMockup = () => {
    setCurrentMockupIndex((prev) => (prev === 0 ? mockupImages.length - 1 : prev - 1))
  }

  return (
    <Card className="bg-black/50 backdrop-blur-md border border-white/10 overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center text-center p-8">
              <Loader2 className="h-16 w-16 text-purple-500 animate-spin mb-4" />
              <p className="text-xl font-medium text-white">Generating mockups...</p>
              <p className="text-sm text-white/60 mt-2">This may take a moment</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center text-center p-8">
              <p className="text-xl font-medium text-red-400 mb-2">{error}</p>
              <Button
                variant="outline"
                onClick={generateMockup}
                className="mt-4 border-white/20 text-white hover:bg-white/10"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          ) : mockupImages.length > 0 ? (
            <div className="relative w-full h-full">
              <img
                src={mockupImages[currentMockupIndex] || "/placeholder.svg"}
                alt={`${product.name} mockup`}
                className="w-full h-full object-contain"
              />

              {mockupImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {mockupImages.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentMockupIndex === index ? "bg-purple-500 w-6" : "bg-white/30"
                      }`}
                      onClick={() => setCurrentMockupIndex(index)}
                    >
                      <span className="sr-only">View mockup {index + 1}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8">
              <p className="text-xl font-medium text-white/70">No mockup available</p>
              <p className="text-sm text-white/50 mt-2">Select a product and generate a design first</p>
            </div>
          )}
        </div>

        {mockupImages.length > 0 && (
          <div className="p-4 flex justify-between items-center">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-white/20 text-white hover:bg-white/10 h-10 w-10"
                onClick={handleDownload}
              >
                <Download className="h-5 w-5" />
                <span className="sr-only">Download mockup</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-white/20 text-white hover:bg-white/10 h-10 w-10"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5" />
                <span className="sr-only">Share mockup</span>
              </Button>
            </div>

            {mockupImages.length > 1 && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10 rounded-full"
                  onClick={handlePreviousMockup}
                >
                  Previous View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10 rounded-full"
                  onClick={handleNextMockup}
                >
                  Next View
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

