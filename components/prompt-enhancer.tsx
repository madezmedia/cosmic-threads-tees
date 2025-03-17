"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Sparkles, Copy, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface PromptEnhancerProps {
  userPrompt: string // Change from 'prompt' to 'userPrompt'
  style: string
  complexity: number
  onEnhancedPrompt: (prompt: string) => void // Change from 'onPromptSelect'
}

export default function PromptEnhancer({ userPrompt, style, complexity, onEnhancedPrompt }: PromptEnhancerProps) {
  // Add this at the beginning of the component function
  console.log("PromptEnhancer received prompt:", userPrompt)
  console.log("Prompt type:", typeof userPrompt)
  console.log("Prompt length:", userPrompt?.length)

  const [isGenerating, setIsGenerating] = useState(false)
  const [enhancedPrompt, setEnhancedPrompt] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const handleGenerateEnhancedPrompt = async () => {
    if (!userPrompt) return

    setIsGenerating(true)

    try {
      // In a real implementation, this would call an API with the system prompt
      // For demo purposes, we'll simulate the response
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const enhancedPromptText = `Enhanced version of "${userPrompt}"`

      setEnhancedPrompt(enhancedPromptText)
    } catch (error) {
      console.error("Error generating enhanced prompt:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyPrompt = () => {
    if (!enhancedPrompt) return

    navigator.clipboard.writeText(enhancedPrompt)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const handleUsePrompt = () => {
    if (enhancedPrompt) {
      console.log("Using prompt:", enhancedPrompt)
      onEnhancedPrompt(enhancedPrompt)
    }
  }

  return (
    <div className="space-y-4 w-full" data-prompt-length={userPrompt?.length || 0}>
      {/* Add a debug message to see if prompt is being received */}
      {userPrompt ? (
        <p className="text-xs text-green-500">
          Prompt received: {userPrompt.substring(0, 20)}
          {userPrompt.length > 20 ? "..." : ""}
        </p>
      ) : (
        <p className="text-xs text-red-500">No prompt received. Please enter a prompt first.</p>
      )}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white/90">AI Prompt Enhancement</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Hide Details" : "How It Works"}
        </Button>
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="bg-black/30 border-white/10">
              <CardContent className="pt-4 text-sm text-white/70">
                <p>Our AI enhances your basic concept with rich details to create stunning wall art by:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Identifying core elements that work well for wall art</li>
                  <li>Adding texture, dimension, and focal points</li>
                  <li>Applying style-specific artistic techniques</li>
                  <li>Adjusting complexity based on your preferences</li>
                  <li>Adding technical specifications for optimal image generation</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={handleGenerateEnhancedPrompt}
        disabled={!userPrompt || isGenerating}
        className={`w-full rounded-full ${
          userPrompt && !isGenerating
            ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            : "bg-gray-600"
        }`}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enhancing Prompt...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Enhance My Prompt
          </>
        )}
      </Button>

      <AnimatePresence>
        {enhancedPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-black/30 border-white/10">
              <CardContent className="pt-4">
                <div className="mb-2 flex justify-between items-center">
                  <h4 className="text-sm font-medium text-white/90">Ready for Image Generation:</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                    onClick={handleCopyPrompt}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <Textarea
                  value={enhancedPrompt}
                  readOnly
                  className="min-h-[100px] bg-black/50 border-white/20 text-white/90 text-sm rounded-xl"
                />
                <div className="flex space-x-3 mt-3">
                  <Button
                    onClick={handleCopyPrompt}
                    className="flex-1 border border-white/20 bg-black/30 text-white hover:bg-white/10 rounded-full"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Prompt
                  </Button>
                  <Button
                    onClick={handleUsePrompt}
                    className="flex-1 bg-white text-black hover:bg-white/90 rounded-full"
                  >
                    Use This Prompt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

