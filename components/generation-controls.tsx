"use client"

import { useDesign } from "@/context/design-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Loader2, ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function GenerationControls() {
  const { state, dispatch } = useDesign()
  const { medium, styles, prompt, enhancedPrompt, isGenerating, generatedDesign } = state
  const { toast } = useToast()

  const generateDesign = async () => {
    const promptToUse = enhancedPrompt || prompt

    if (!promptToUse.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a description for your design.",
        variant: "destructive",
      })
      return
    }

    if (!medium) {
      toast({
        title: "No product selected",
        description: "Please select a product for your design.",
        variant: "destructive",
      })
      return
    }

    try {
      dispatch({ type: "SET_IS_GENERATING", payload: true })
      dispatch({ type: "SET_GENERATION_PROGRESS", payload: 0 })

      // Simulate progress updates
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += Math.random() * 15;
        const cappedProgress = currentProgress > 95 ? 95 : currentProgress;
        dispatch({ 
          type: "SET_GENERATION_PROGRESS", 
          payload: cappedProgress 
        });
      }, 500);

      // In a real implementation, this would call the AI service
      // For demo purposes, we'll simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 3000))

      clearInterval(progressInterval)
      dispatch({ type: "SET_GENERATION_PROGRESS", payload: 100 })

      // Simulate a generated design
      const mockDesign = {
        id: Date.now(),
        type: "image",
        content: "/placeholder.svg?height=500&width=500&text=AI+Generated+Design",
        prompt: promptToUse,
        medium: medium.id,
        styles: styles,
        complexity: state.complexity,
        placement: state.placementOption,
        timestamp: new Date().toISOString(),
      }

      dispatch({ type: "SET_GENERATED_DESIGN", payload: mockDesign })
      
      toast({
        title: "Design generated",
        description: "Your custom design has been created successfully.",
      })
    } catch (error) {
      console.error("Error generating design:", error)
      toast({
        title: "Generation failed",
        description: "Failed to generate your design. Please try again.",
        variant: "destructive",
      })
    } finally {
      dispatch({ type: "SET_IS_GENERATING", payload: false })
    }
  }

  const handleAddToCart = async () => {
    if (!generatedDesign) {
      toast({
        title: "No design generated",
        description: "Please generate a design before adding to cart.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Added to cart",
      description: "Your design has been added to the cart.",
    })
  }

  const canGenerate = medium && prompt.trim().length > 0 && !isGenerating

  return (
    <Card className="bg-black/20 border border-chrome/20 rounded-lg p-6 mt-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={generateDesign}
          disabled={!canGenerate}
          className="flex-1 bg-magenta hover:bg-magenta/80 text-white border-2 border-magenta/20 font-mono uppercase tracking-wider"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Design
            </>
          )}
        </Button>

        {generatedDesign && (
          <Button
            onClick={handleAddToCart}
            className="flex-1 bg-teal hover:bg-teal/80 text-black font-mono uppercase tracking-wider"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        )}
      </div>

      <div className="mt-4 text-xs text-chrome/60 text-center">
        {!medium && <p>Select a product to get started</p>}
        {medium && !prompt.trim() && <p>Enter a prompt to describe your design</p>}
        {medium && prompt.trim() && !generatedDesign && !isGenerating && (
          <p>Click Generate to create your design</p>
        )}
        {generatedDesign && <p>Your design is ready! You can add it to cart or regenerate.</p>}
      </div>
    </Card>
  )
}
