"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, Wand2, RefreshCw, ThumbsUp, ThumbsDown } from "lucide-react"
import { type Medium } from "./medium-selector"
import { type Style } from "./style-guide-selector"
import { useToast } from "@/hooks/use-toast"

interface EnhancedDesignGeneratorProps {
  selectedMedium: Medium | null
  selectedStyles: string[]
  complexity: number
  onGenerate: (design: any) => void
  generatedDesign: any | null
  styles: Style[]
}

export default function EnhancedDesignGenerator({
  selectedMedium,
  selectedStyles,
  complexity,
  onGenerate,
  generatedDesign,
  styles,
}: EnhancedDesignGeneratorProps) {
  const [prompt, setPrompt] = useState("")
  const [enhancedPrompt, setEnhancedPrompt] = useState<string | null>(null)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("prompt")
  const [generationProgress, setGenerationProgress] = useState(0)
  const [placementOption, setPlacementOption] = useState("front")
  const { toast } = useToast()

  // Auto-populate prompt based on selected styles
  useEffect(() => {
    if (selectedStyles.length > 0 && selectedMedium) {
      const selectedStyleObjects = selectedStyles
        .map((styleId) => styles.find((s) => s.id === styleId))
        .filter(Boolean) as Style[]

      const styleNames = selectedStyleObjects.map((style) => style.name).join(", ")
      const styleTags = selectedStyleObjects.flatMap((style) => style.tags).slice(0, 5).join(", ")

      const autoPrompt = `Create a ${styleNames} design for a ${selectedMedium.name.toLowerCase()} featuring ${styleTags} elements.`
      setPrompt(autoPrompt)
    }
  }, [selectedStyles, selectedMedium, styles])

  const enhancePrompt = async () => {
    if (!prompt.trim()) return

    try {
      setIsEnhancing(true)
      // In a real implementation, this would call the API
      // For demo purposes, we'll simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate an enhanced prompt
      const styleTerms = selectedStyles
        .map((styleId) => styles.find((s) => s.id === styleId)?.name)
        .filter(Boolean)
        .join(", ")

      const mediumTerm = selectedMedium?.name || "product"
      const complexityTerm = complexity < 30 ? "minimalist" : complexity > 70 ? "detailed" : "balanced"

      const enhanced = `Create a visually striking ${styleTerms} design for a ${mediumTerm.toLowerCase()}. 
The composition should be ${complexityTerm} with ${
        complexity > 50 ? "rich details" : "clean simplicity"
      } and feature elements that evoke a cosmic, futuristic atmosphere. 
Incorporate ${prompt.toLowerCase()} with a color palette that aligns with the ${styleTerms} aesthetic.
The design should be optimized for ${placementOption} placement on the ${mediumTerm.toLowerCase()}.`

      setEnhancedPrompt(enhanced)
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
      setIsEnhancing(false)
    }
  }

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

    if (!selectedMedium) {
      toast({
        title: "No medium selected",
        description: "Please select a medium for your design.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsGenerating(true)
      setGenerationProgress(0)

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => {
          const next = prev + Math.random() * 15
          return next > 95 ? 95 : next
        })
      }, 500)

      // In a real implementation, this would call the AI service
      // For demo purposes, we'll simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 3000))

      clearInterval(progressInterval)
      setGenerationProgress(100)

      // Simulate a generated design
      const mockDesign = {
        id: Date.now(),
        type: "image",
        content: "/placeholder.svg?height=500&width=500&text=AI+Generated+Design",
        prompt: promptToUse,
        medium: selectedMedium.id,
        styles: selectedStyles,
        complexity,
        placement: placementOption,
        timestamp: new Date().toISOString(),
      }

      onGenerate(mockDesign)
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
      setIsGenerating(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="bg-black border-chrome/20">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-display font-bold mb-6 text-chrome">DESIGN GENERATOR</h2>

          <Tabs defaultValue="prompt" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6 bg-black/50">
              <TabsTrigger value="prompt" className="data-[state=active]:bg-magenta data-[state=active]:text-white">
                Design Prompt
              </TabsTrigger>
              <TabsTrigger value="options" className="data-[state=active]:bg-magenta data-[state=active]:text-white">
                Design Options
              </TabsTrigger>
            </TabsList>

            <TabsContent value="prompt" className="space-y-6">
              <div>
                <Label htmlFor="prompt" className="text-base font-mono uppercase tracking-wider text-chrome mb-2 block">
                  Describe your design
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe what you want in your design..."
                  className="min-h-[120px] bg-black border-chrome/30 text-chrome placeholder:text-chrome/40"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
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
                <div className="bg-black/40 border border-teal/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-mono uppercase tracking-wider text-teal">Enhanced Prompt</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full hover:bg-teal/20 text-teal"
                        onClick={() => setPrompt(enhancedPrompt)}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full hover:bg-red-500/20 text-red-400"
                        onClick={() => setEnhancedPrompt(null)}
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
                    onClick={() => setPrompt(enhancedPrompt)}
                  >
                    Use This Prompt
                  </Button>
                </div>
              )}

              {selectedMedium && (
                <div className="bg-black/40 border border-chrome/20 rounded-lg p-4">
                  <Label className="text-sm font-mono uppercase tracking-wider text-chrome mb-2 block">
                    Selected Medium
                  </Label>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-magenta/20 text-magenta">{selectedMedium.name}</Badge>
                  </div>
                </div>
              )}

              {selectedStyles.length > 0 && (
                <div className="bg-black/40 border border-chrome/20 rounded-lg p-4">
                  <Label className="text-sm font-mono uppercase tracking-wider text-chrome mb-2 block">
                    Selected Styles
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedStyles.map((styleId) => {
                      const style = styles.find((s) => s.id === styleId)
                      return (
                        style && (
                          <Badge key={styleId} className="bg-teal/20 text-teal">
                            {style.name}
                          </Badge>
                        )
                      )
                    })}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="options" className="space-y-6">
              <div>
                <Label className="text-base font-mono uppercase tracking-wider text-chrome mb-2 block">
                  Design Placement
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {["front", "back", "sleeve", "all-over"].map((placement) => (
                    <Button
                      key={placement}
                      variant={placementOption === placement ? "default" : "outline"}
                      className={`${
                        placementOption === placement
                          ? "bg-teal text-black hover:bg-teal/80"
                          : "border-chrome/30 text-chrome hover:bg-chrome/10"
                      }`}
                      onClick={() => setPlacementOption(placement)}
                    >
                      {placement.charAt(0).toUpperCase() + placement.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="bg-black/40 border border-chrome/20 rounded-lg p-4">
                <Label className="text-sm font-mono uppercase tracking-wider text-chrome mb-2 block">
                  Complexity: {complexity}%
                </Label>
                <div className="h-2 w-full bg-chrome/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal rounded-full"
                    style={{ width: `${complexity}%`, transition: "width 0.3s ease" }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-chrome/50 mt-1">
                  <span>Simple</span>
                  <span>Complex</span>
                </div>
              </div>

              {selectedMedium?.id === "tshirt" && (
                <div className="bg-black/40 border border-chrome/20 rounded-lg p-4">
                  <Label className="text-sm font-mono uppercase tracking-wider text-chrome mb-2 block">
                    T-Shirt Specific Options
                  </Label>
                  <p className="text-sm text-chrome/70 mb-2">
                    These settings will be applied when generating your t-shirt design.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 p-2 border border-chrome/20 rounded">
                      <input type="checkbox" id="distressed" className="rounded text-teal" defaultChecked />
                      <Label htmlFor="distressed" className="text-sm cursor-pointer">
                        Distressed Effect
                      </Label>
                    </div>
                    <div className="flex items-center gap-2 p-2 border border-chrome/20 rounded">
                      <input type="checkbox" id="transparent-bg" className="rounded text-teal" defaultChecked />
                      <Label htmlFor="transparent-bg" className="text-sm cursor-pointer">
                        Transparent Background
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {selectedMedium?.id === "wallart" && (
                <div className="bg-black/40 border border-chrome/20 rounded-lg p-4">
                  <Label className="text-sm font-mono uppercase tracking-wider text-chrome mb-2 block">
                    Wall Art Specific Options
                  </Label>
                  <p className="text-sm text-chrome/70 mb-2">
                    These settings will be applied when generating your wall art design.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 p-2 border border-chrome/20 rounded">
                      <input type="checkbox" id="high-res" className="rounded text-teal" defaultChecked />
                      <Label htmlFor="high-res" className="text-sm cursor-pointer">
                        High Resolution
                      </Label>
                    </div>
                    <div className="flex items-center gap-2 p-2 border border-chrome/20 rounded">
                      <input type="checkbox" id="gallery-wrap" className="rounded text-teal" defaultChecked />
                      <Label htmlFor="gallery-wrap" className="text-sm cursor-pointer">
                        Gallery Wrap Edges
                      </Label>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <Button
            onClick={generateDesign}
            disabled={!prompt.trim() || !selectedMedium || isGenerating}
            className="w-full mt-6 bg-magenta hover:bg-magenta/80 text-white border-2 border-magenta/20 font-mono uppercase tracking-wider"
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
        </CardContent>
      </Card>

      <Card className="bg-black border-chrome/20">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-display font-bold mb-6 text-chrome">DESIGN PREVIEW</h2>

          <div className="aspect-square bg-black/50 border border-chrome/30 rounded-lg flex items-center justify-center overflow-hidden">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center text-center p-8">
                <div className="relative h-24 w-24 mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-chrome/20"></div>
                  <div
                    className="absolute inset-0 rounded-full border-4 border-t-magenta border-r-transparent border-b-transparent border-l-transparent animate-spin"
                    style={{ animationDuration: "1.5s" }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-mono text-magenta">{Math.round(generationProgress)}%</span>
                  </div>
                </div>
                <p className="text-lg font-medium text-chrome">Generating your design...</p>
                <p className="text-sm text-chrome/60 mt-2 font-mono">
                  Our AI is creating something cosmic just for you
                </p>
              </div>
            ) : generatedDesign ? (
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <img
                  src={generatedDesign.content}
                  alt="Generated design"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ) : (
              <div className="text-center p-8">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-chrome/40" />
                <p className="text-lg font-medium text-chrome">No design generated yet</p>
                <p className="text-sm text-chrome/60 mt-2 font-mono">
                  Use the form on the left to create your design
                </p>
              </div>
            )}
          </div>

          {generatedDesign && (
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={generateDesign}
                disabled={!prompt.trim() || isGenerating}
                className="border-chrome/30 text-chrome hover:bg-chrome/10 font-mono uppercase tracking-wider"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
            </div>
          )}

          {generatedDesign && (
            <div className="mt-6 bg-black/40 border border-chrome/20 rounded-lg p-4">
              <Label className="text-sm font-mono uppercase tracking-wider text-chrome mb-2 block">
                Design Details
              </Label>
              <div className="space-y-2 text-sm text-chrome/70">
                <p>
                  <span className="text-chrome">Medium:</span> {selectedMedium?.name}
                </p>
                <p>
                  <span className="text-chrome">Placement:</span> {placementOption.charAt(0).toUpperCase() + placementOption.slice(1)}
                </p>
                <p>
                  <span className="text-chrome">Complexity:</span> {complexity}%
                </p>
                <p>
                  <span className="text-chrome">Styles:</span>{" "}
                  {selectedStyles
                    .map((styleId) => styles.find((s) => s.id === styleId)?.name)
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
