"use client"

import { useEffect } from "react"
import { useDesign } from "@/context/design-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Wand2, ThumbsUp, ThumbsDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PromptEditor() {
  const { state, dispatch } = useDesign()
  const { prompt, enhancedPrompt, isEnhancing, medium, styles } = state
  const { toast } = useToast()

  // Auto-populate prompt based on selected styles and medium
  useEffect(() => {
    if (styles.length > 0 && medium && !prompt) {
      const styleNames = styles
        .map((styleId) => styleId.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" "))
        .join(", ")

      const autoPrompt = `Create a ${styleNames} design for a ${medium.name.toLowerCase()}.`
      dispatch({ type: "SET_PROMPT", payload: autoPrompt })
    }
  }, [styles, medium, prompt, dispatch])

  const enhancePrompt = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a description for your design.",
        variant: "destructive",
      })
      return
    }

    try {
      dispatch({ type: "SET_IS_ENHANCING", payload: true })
      
      // In a real implementation, this would call the API
      // For demo purposes, we'll simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate an enhanced prompt
      const styleTerms = styles
        .map((styleId) => styleId.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" "))
        .join(", ")

      const mediumTerm = medium?.name || "product"
      const complexityTerm = state.complexity < 30 ? "minimalist" : state.complexity > 70 ? "detailed" : "balanced"

      const enhanced = `Create a visually striking ${styleTerms} design for a ${mediumTerm.toLowerCase()}. 
The composition should be ${complexityTerm} with ${
        state.complexity > 50 ? "rich details" : "clean simplicity"
      } and feature elements that evoke a cosmic, futuristic atmosphere. 
Incorporate ${prompt.toLowerCase()} with a color palette that aligns with the ${styleTerms} aesthetic.
The design should be optimized for ${state.placementOption} placement on the ${mediumTerm.toLowerCase()}.`

      dispatch({ type: "SET_ENHANCED_PROMPT", payload: enhanced })
      
      toast({
        title: "Prompt enhanced",
        description: "Your prompt has been enhanced with style-specific details.",
      })
    } catch (error) {
      console.error("Error enhancing prompt:", error)
      toast({
        title: "Enhancement failed",
        description: "Failed to enhance your prompt. Please try again.",
        variant: "destructive",
      })
    } finally {
      dispatch({ type: "SET_IS_ENHANCING", payload: false })
    }
  }

  const useEnhancedPrompt = () => {
    if (enhancedPrompt) {
      dispatch({ type: "SET_PROMPT", payload: enhancedPrompt })
      dispatch({ type: "SET_ENHANCED_PROMPT", payload: null })
      
      toast({
        title: "Prompt updated",
        description: "The enhanced prompt has been applied.",
      })
    }
  }

  const discardEnhancedPrompt = () => {
    dispatch({ type: "SET_ENHANCED_PROMPT", payload: null })
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="prompt" className="text-base font-mono uppercase tracking-wider text-chrome mb-2 block">
          Describe your design
        </Label>
        <Textarea
          id="prompt"
          placeholder="Describe what you want in your design..."
          className="min-h-[120px] bg-black border-chrome/30 text-chrome placeholder:text-chrome/40"
          value={prompt}
          onChange={(e) => dispatch({ type: "SET_PROMPT", payload: e.target.value })}
        />
      </div>

      <div>
        <Button
          variant="outline"
          onClick={enhancePrompt}
          disabled={!prompt.trim() || isEnhancing}
          className="w-full border-chrome/30 text-chrome hover:bg-chrome/10 font-mono"
        >
          {isEnhancing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enhancing...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Enhance Prompt with AI
            </>
          )}
        </Button>
      </div>

      {enhancedPrompt && (
        <Card className="bg-black/40 border border-teal/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-mono uppercase tracking-wider text-teal">Enhanced Prompt</Label>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full hover:bg-teal/20 text-teal"
                onClick={useEnhancedPrompt}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full hover:bg-red-500/20 text-red-400"
                onClick={discardEnhancedPrompt}
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-chrome/80 italic">{enhancedPrompt}</p>
          <Button
            variant="link"
            size="sm"
            className="text-teal p-0 h-auto mt-2"
            onClick={useEnhancedPrompt}
          >
            Use This Prompt
          </Button>
        </Card>
      )}

      {medium && (
        <div className="bg-black/40 border border-chrome/20 rounded-lg p-4">
          <Label className="text-sm font-mono uppercase tracking-wider text-chrome mb-2 block">
            Selected Product
          </Label>
          <div className="flex items-center gap-2">
            <Badge className="bg-magenta/20 text-magenta">{medium.name}</Badge>
          </div>
        </div>
      )}

      {styles.length > 0 && (
        <div className="bg-black/40 border border-chrome/20 rounded-lg p-4">
          <Label className="text-sm font-mono uppercase tracking-wider text-chrome mb-2 block">
            Selected Styles
          </Label>
          <div className="flex flex-wrap gap-2">
            {styles.map((styleId) => (
              <Badge key={styleId} className="bg-teal/20 text-teal">
                {styleId.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
