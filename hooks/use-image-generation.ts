"use client"

import { useState, useEffect, useRef } from "react"
import { useToast } from "@/hooks/use-toast"

export type GenerationStatus = "idle" | "preparing" | "queued" | "generating" | "finalizing" | "completed" | "failed"

export interface GenerationProgress {
  status: GenerationStatus
  progress: number // 0-100
  message: string
  estimatedTimeRemaining?: number // in seconds
  startTime?: number
  endTime?: number
}

export interface UseImageGenerationOptions {
  onSuccess?: (imageUrl: string) => void
  onError?: (error: Error) => void
  autoNotify?: boolean
}

// Add these variables to store the prompt and style
let prompt = ""
let style = ""

export function useImageGeneration(options: UseImageGenerationOptions = {}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [generationId, setGenerationId] = useState<string | null>(null)
  const [progress, setProgress] = useState<GenerationProgress>({
    status: "idle",
    progress: 0,
    message: "Ready to generate",
  })

  const { toast } = useToast()

  // Use refs to track if callbacks have been called
  const successCallbackRef = useRef(false)
  const imageUrlRef = useRef<string | null>(null)

  // Effect to handle success callback
  useEffect(() => {
    // Only call onSuccess if we have an image URL, we're not generating,
    // and we haven't called the callback yet for this URL
    if (
      imageUrl &&
      !isGenerating &&
      options.onSuccess &&
      !successCallbackRef.current &&
      imageUrl !== imageUrlRef.current
    ) {
      console.log("Calling onSuccess with imageUrl:", imageUrl)
      imageUrlRef.current = imageUrl
      successCallbackRef.current = true

      // Use setTimeout to ensure this happens after rendering
      setTimeout(() => {
        options.onSuccess?.(imageUrl)
      }, 0)
    }
  }, [imageUrl, isGenerating, options])

  // Reset the callback flag when starting a new generation
  useEffect(() => {
    if (isGenerating) {
      successCallbackRef.current = false
    }
  }, [isGenerating])

  // Poll for generation status if we have a generationId
  useEffect(() => {
    if (!generationId || progress.status === "completed" || progress.status === "failed") {
      return
    }

    const pollInterval = setInterval(async () => {
      try {
        // In a real implementation, you would call an API to check the status
        // For this example, we'll simulate progress updates
        simulateProgressUpdate()
      } catch (err) {
        console.error("Error polling generation status:", err)
      }
    }, 1000)

    return () => clearInterval(pollInterval)
  }, [generationId, progress.status])

  // Update the simulateProgressUpdate function to use real image generation
  const simulateProgressUpdate = () => {
    setProgress((prev) => {
      // Don't update if already completed or failed
      if (prev.status === "completed" || prev.status === "failed") {
        return prev
      }

      let newProgress = prev.progress
      let newStatus = prev.status
      let newMessage = prev.message

      // Simulate progression through states
      if (prev.status === "preparing" && prev.progress >= 100) {
        newStatus = "queued"
        newProgress = 0
        newMessage = "Waiting in queue..."
      } else if (prev.status === "queued" && prev.progress >= 100) {
        newStatus = "generating"
        newProgress = 0
        newMessage = "Generating your masterpiece..."
      } else if (prev.status === "generating" && prev.progress >= 100) {
        newStatus = "finalizing"
        newProgress = 0
        newMessage = "Finalizing your artwork..."
      } else if (prev.status === "finalizing" && prev.progress >= 100) {
        newStatus = "completed"
        newProgress = 100
        newMessage = "Your artwork is ready!"

        // Call the FAL API to generate a real image
        generateRealImage()
      } else {
        // Increment progress by a random amount
        newProgress = Math.min(prev.progress + Math.random() * 15, 100)
      }

      return {
        ...prev,
        status: newStatus,
        progress: newProgress,
        message: newMessage,
      }
    })
  }

  // Add a new function to generate a real image using the FAL API
  const generateRealImage = async () => {
    try {
      console.log("Generating real image with prompt:", prompt, "and style:", style)

      // Create a request to our own API endpoint instead of calling FAL directly from client
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          style: style,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      // Extract the image URL from the response
      const imageUrl = data.imageUrl

      if (!imageUrl || !imageUrl.startsWith("http")) {
        throw new Error("Invalid image URL received from API")
      }

      console.log("Generated image URL:", imageUrl)
      setImageUrl(imageUrl)
    } catch (error) {
      console.error("Error calling FAL API:", error)
      // Fallback to placeholder if the API call fails
      const timestamp = Date.now()
      const imageUrl = `/placeholder.svg?height=800&width=1200&text=AI+Generated+Art&t=${timestamp}`
      console.log("Falling back to placeholder:", imageUrl)
      setImageUrl(imageUrl)
    }
  }

  // Update the generateArtwork function to use the FAL API
  const generateArtwork = async (promptText: string, styleText: string, aspectRatio?: string) => {
    try {
      setIsGenerating(true)
      setError(null)
      setImageUrl(null)

      // Store the prompt and style for use in the API call
      prompt = promptText
      style = styleText

      // Reset progress
      setProgress({
        status: "preparing",
        progress: 0,
        message: "Preparing your request...",
        startTime: Date.now(),
      })

      // Generate a unique ID for this generation
      const id = `gen_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      setGenerationId(id)

      if (options.autoNotify) {
        toast({
          title: "Starting image generation",
          description: "We're preparing your artwork...",
        })
      }

      // Start the progress simulation
      simulateProgressUpdate()
    } catch (err) {
      console.error("Error generating image:", err)
      setError(err instanceof Error ? err : new Error("Unknown error occurred"))
      setProgress({
        status: "failed",
        progress: 0,
        message: "Failed to generate image",
      })

      if (options.autoNotify) {
        toast({
          title: "Generation failed",
          description: "There was an error generating your image. Please try again.",
          variant: "destructive",
        })
      }

      if (options.onError) {
        options.onError(err instanceof Error ? err : new Error("Unknown error occurred"))
      }

      setIsGenerating(false)
    }
  }

  const cancelGeneration = () => {
    // In a real implementation, you would call an API to cancel the generation
    setIsGenerating(false)
    setProgress({
      status: "idle",
      progress: 0,
      message: "Generation cancelled",
    })

    if (options.autoNotify) {
      toast({
        title: "Generation cancelled",
        description: "Image generation has been cancelled.",
      })
    }
  }

  return {
    imageUrl,
    isGenerating,
    error,
    progress,
    generateArtwork,
    cancelGeneration,
  }
}

