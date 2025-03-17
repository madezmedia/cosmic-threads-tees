"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Sparkles, Download, Share2, RefreshCw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useImageGeneration } from "@/hooks/use-image-generation"
import GenerationProgress from "@/components/generation-progress"
import GenerationNotification from "@/components/generation-notification"

interface ImageGeneratorProps {
  prompt: string
  style: string
  onImageGenerated: (imageUrl: string) => void
}

export default function ImageGenerator({ prompt, style, onImageGenerated }: ImageGeneratorProps) {
  const [showNotification, setShowNotification] = useState(false)
  const [generationSeed, setGenerationSeed] = useState<number | null>(null)

  const { imageUrl, isGenerating, error, progress, generateArtwork, cancelGeneration } = useImageGeneration({
    onSuccess: (url) => {
      onImageGenerated(url)
      setShowNotification(true)
    },
    onError: (err) => {
      console.error("Error generating image:", err)
      setShowNotification(true)
    },
  })

  useEffect(() => {
    // When the status changes to generating, show the notification
    if (progress.status === "generating" && !showNotification) {
      setShowNotification(true)
    }
  }, [progress.status, showNotification])

  const handleGenerateImage = async () => {
    if (!prompt || isGenerating) return

    const seed = Math.floor(Math.random() * 1000000)
    setGenerationSeed(seed)

    await generateArtwork(prompt, style)
  }

  const handleRegenerateImage = async () => {
    if (isGenerating) return

    const seed = Math.floor(Math.random() * 1000000)
    setGenerationSeed(seed)

    await generateArtwork(prompt, style)
  }

  const handleDownload = () => {
    if (!imageUrl) return

    // In a real app, this would download the image
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `wall-art-${generationSeed || "generated"}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = () => {
    if (!imageUrl) return

    // In a real app, this would open share options
    if (navigator.share) {
      navigator
        .share({
          title: "My Generated Wall Art",
          text: "Check out this wall art I created with AI!",
          url: imageUrl,
        })
        .catch(console.error)
    } else {
      alert("Sharing is not available in your browser")
    }
  }

  return (
    <div className="space-y-4">
      {!imageUrl ? (
        <Card className="bg-black/30 border-white/10 overflow-hidden">
          <CardContent className="p-6">
            <div className="aspect-square bg-black/50 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center p-8">
                <Sparkles className="h-16 w-16 mx-auto mb-4 text-purple-400 opacity-50" />
                <p className="text-lg font-medium text-white/90">Ready to generate your wall art</p>
                <p className="text-sm text-white/60 mt-2">Click the button below to create your masterpiece</p>
              </div>
            </div>

            {isGenerating && <GenerationProgress progress={progress} onCancel={cancelGeneration} />}

            <Button
              onClick={handleGenerateImage}
              disabled={!prompt || isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full py-6 mt-4"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Your Art...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Wall Art
                </>
              )}
            </Button>

            {error && <p className="mt-3 text-sm text-red-400 text-center">{error.message}</p>}
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-black/30 border-white/10 overflow-hidden">
          <CardContent className="p-0 relative">
            <div className="aspect-square bg-black flex items-center justify-center overflow-hidden">
              {isGenerating ? (
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
                <motion.div
                  className="w-full h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt="Generated wall art"
                    className="w-full h-full object-contain"
                  />
                </motion.div>
              )}
            </div>

            {!isGenerating && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/70 backdrop-blur-md rounded-full p-2 border border-white/10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-white hover:bg-white/10 h-10 w-10"
                  onClick={handleRegenerateImage}
                  disabled={isGenerating}
                >
                  <RefreshCw className="h-5 w-5" />
                  <span className="sr-only">Regenerate</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-white hover:bg-white/10 h-10 w-10"
                  onClick={handleDownload}
                >
                  <Download className="h-5 w-5" />
                  <span className="sr-only">Download</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-white hover:bg-white/10 h-10 w-10"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5" />
                  <span className="sr-only">Share</span>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {imageUrl && !isGenerating && (
        <div className="text-center">
          <p className="text-sm text-white/60">
            Seed: {generationSeed} • Style: {style}
          </p>
          <Button
            variant="link"
            size="sm"
            className="text-purple-400 hover:text-purple-300"
            onClick={handleRegenerateImage}
            disabled={isGenerating}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Generate another variation
          </Button>
        </div>
      )}

      <AnimatePresence>
        {showNotification && (
          <GenerationNotification
            status={progress.status}
            message={progress.message}
            visible={showNotification}
            onClose={() => setShowNotification(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

