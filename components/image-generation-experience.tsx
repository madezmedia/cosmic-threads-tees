"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, RefreshCw, Download, Share2, Info, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useImageGeneration } from "@/hooks/use-image-generation"
import GenerationProgress from "@/components/generation-progress"
import GenerationVisualization from "@/components/generation-visualization"
import GenerationNotification from "@/components/generation-notification"

interface ImageGenerationExperienceProps {
  prompt: string
  style: string
  onImageGenerated: (imageUrl: string) => void
}

export default function ImageGenerationExperience({ prompt, style, onImageGenerated }: ImageGenerationExperienceProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "details">("preview")
  const [showInfo, setShowInfo] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const notificationShownRef = useRef(false)

  const handleImageGenerated = (imageUrl: string) => {
    console.log("Generation success callback with URL:", imageUrl)

    // Check if the URL is valid (starts with http or https)
    if (imageUrl && typeof imageUrl === "string") {
      onImageGenerated(imageUrl)
      // We'll handle notification in the effect below
    } else {
      console.error("Invalid image URL received:", imageUrl)
      setShowNotification(true)
    }
  }

  const { imageUrl, isGenerating, error, progress, generateArtwork, cancelGeneration } = useImageGeneration({
    onSuccess: (url) => {
      handleImageGenerated(url)
    },
    onError: (err) => {
      console.error("Error generating image:", err)
      setShowNotification(true)
    },
  })

  // Effect to handle status changes and notifications
  useEffect(() => {
    // When the status changes to generating and we haven't shown the notification yet
    if (progress.status === "generating" && !notificationShownRef.current) {
      notificationShownRef.current = true
      setShowNotification(true)
    }

    // When the status changes to completed, show notification
    if (progress.status === "completed") {
      setShowNotification(true)
    }

    // Reset notification flag when starting a new generation
    if (progress.status === "preparing") {
      notificationShownRef.current = false
    }
  }, [progress.status])

  const handleGenerateImage = async () => {
    if (!prompt || isGenerating) return
    await generateArtwork(prompt, style)
  }

  const handleDownload = () => {
    if (!imageUrl) return

    // In a real app, this would download the image
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `wall-art-generated.png`
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
      <Card className="bg-black/30 border-white/10 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            <div className="aspect-square bg-black flex items-center justify-center overflow-hidden">
              {isGenerating ? (
                <GenerationVisualization status={progress.status} progress={progress.progress} />
              ) : imageUrl ? (
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
                    onLoad={() => console.log("Image loaded successfully in ImageGenerationExperience")}
                    onError={(e) => {
                      console.error("Image failed to load in ImageGenerationExperience:", e)
                      e.currentTarget.src = "/placeholder.svg?text=Error+Loading+Image"
                    }}
                  />
                </motion.div>
              ) : (
                <div className="text-center p-8">
                  <Sparkles className="h-16 w-16 mx-auto mb-4 text-purple-400 opacity-50" />
                  <p className="text-lg font-medium text-white/90">Ready to generate your wall art</p>
                  <p className="text-sm text-white/60 mt-2">Click the button below to create your masterpiece</p>
                </div>
              )}
            </div>

            {isGenerating && (
              <div className="absolute top-4 right-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full bg-black/50 border-white/20 text-white/70 hover:bg-white/10"
                  onClick={() => setShowInfo(!showInfo)}
                >
                  <Info className="h-4 w-4" />
                  <span className="sr-only">Generation Info</span>
                </Button>
              </div>
            )}

            {imageUrl && !isGenerating && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/70 backdrop-blur-md rounded-full p-2 border border-white/10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-white hover:bg-white/10 h-10 w-10"
                  onClick={handleGenerateImage}
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
          </div>

          <AnimatePresence>
            {showInfo && isGenerating && (
              <motion.div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-6 h-full flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-white">Generation Details</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full text-white/70 hover:bg-white/10"
                      onClick={() => setShowInfo(false)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Close</span>
                    </Button>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-white/70 mb-1">Prompt</h4>
                        <p className="text-white bg-white/5 p-3 rounded-lg text-sm">{prompt}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-white/70 mb-1">Style</h4>
                        <p className="text-white bg-white/5 p-3 rounded-lg text-sm">{style}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-white/70 mb-1">Generation Process</h4>
                        <div className="space-y-2">
                          <div
                            className={`p-3 rounded-lg text-sm ${progress.status === "preparing" || progress.status === "completed" ? "bg-green-500/10 text-green-300" : "bg-white/5 text-white/70"}`}
                          >
                            1. Preparing your request
                          </div>
                          <div
                            className={`p-3 rounded-lg text-sm ${progress.status === "queued" || progress.status === "completed" ? "bg-green-500/10 text-green-300" : progress.status === "preparing" ? "bg-white/5 text-white/70" : "bg-white/5 text-white/30"}`}
                          >
                            2. Waiting in queue
                          </div>
                          <div
                            className={`p-3 rounded-lg text-sm ${progress.status === "generating" || progress.status === "completed" ? "bg-green-500/10 text-green-300" : progress.status === "queued" || progress.status === "preparing" ? "bg-white/5 text-white/70" : "bg-white/5 text-white/30"}`}
                          >
                            3. Generating your artwork
                          </div>
                          <div
                            className={`p-3 rounded-lg text-sm ${progress.status === "finalizing" || progress.status === "completed" ? "bg-green-500/10 text-green-300" : progress.status === "generating" || progress.status === "queued" || progress.status === "preparing" ? "bg-white/5 text-white/70" : "bg-white/5 text-white/30"}`}
                          >
                            4. Finalizing your artwork
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white/10"
                      onClick={cancelGeneration}
                    >
                      Cancel Generation
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {isGenerating && (
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "preview" | "details")}>
          <TabsList className="grid w-full grid-cols-2 bg-black/50 border border-white/10 rounded-full overflow-hidden p-1">
            <TabsTrigger
              value="preview"
              className="rounded-full data-[state=active]:bg-gradient-to-r from-purple-600 to-pink-600 data-[state=active]:text-white"
            >
              Preview
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="rounded-full data-[state=active]:bg-gradient-to-r from-purple-600 to-pink-600 data-[state=active]:text-white"
            >
              Generation Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-4">
            <GenerationProgress progress={progress} onCancel={cancelGeneration} />
          </TabsContent>

          <TabsContent value="details" className="mt-4">
            <Card className="bg-black/30 border-white/10">
              <CardContent className="p-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-white/70 mb-1">Prompt</h4>
                  <p className="text-white bg-white/5 p-3 rounded-lg text-sm">{prompt}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white/70 mb-1">Style</h4>
                  <p className="text-white bg-white/5 p-3 rounded-lg text-sm">{style}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white/70 mb-1">Status</h4>
                  <p className="text-white bg-white/5 p-3 rounded-lg text-sm">{progress.message}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white/70 mb-1">Elapsed Time</h4>
                  <p className="text-white bg-white/5 p-3 rounded-lg text-sm">
                    {progress.startTime
                      ? `${Math.floor((Date.now() - progress.startTime) / 1000)} seconds`
                      : "Not started"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {!isGenerating && !imageUrl && (
        <Button
          onClick={handleGenerateImage}
          disabled={!prompt}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full py-6"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Generate Wall Art
        </Button>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{error.message}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 border-red-500/30 text-red-400 hover:bg-red-500/10"
            onClick={handleGenerateImage}
          >
            Try Again
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

