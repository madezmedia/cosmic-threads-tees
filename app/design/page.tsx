"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageIcon, ThumbsUp, ThumbsDown, ArrowRight, Palette } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import DesignSuggestions from "@/components/design-suggestions"
import StyleSelector from "@/components/style-selector"
import PromptEnhancer from "@/components/prompt-enhancer"
import ImageGenerationExperience from "@/components/image-generation-experience"
import { useApp } from "@/context/app-context"
import AppLayout from "@/components/app-layout"
import { designApi } from "@/lib/api-service"
import type { Design } from "@/lib/types"

export default function DesignPage() {
  const { setCurrentDesign, user, isAuthenticated } = useApp()
  const [designPrompt, setDesignPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedDesign, setGeneratedDesign] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("text-prompt")
  const [selectedStyle, setSelectedStyle] = useState("abstract")
  const [complexity, setComplexity] = useState(70)
  const [enhancedPrompt, setEnhancedPrompt] = useState<string | null>(null)
  const [showImageGenerator, setShowImageGenerator] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const promptRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (promptRef.current) {
      promptRef.current.focus()
    }
  }, [])

  const handleFeedback = (positive: boolean) => {
    // In a real app, this would send feedback to the AI system
    alert(
      `Thank you for your ${positive ? "positive" : "negative"} feedback! ${
        positive ? "We're glad you like it!" : "We'll use this to improve future designs."
      }`,
    )
  }

  const handleEnhancedPrompt = (prompt: string) => {
    setEnhancedPrompt(prompt)
    setShowImageGenerator(true)
  }

  // Update the handleImageGenerated function to handle both placeholder and real URLs
  const handleImageGenerated = async (imageUrl: string) => {
    console.log("Image generated from FAL API:", imageUrl)

    // Ensure we're getting a valid URL
    if (imageUrl && typeof imageUrl === "string") {
      // Check if it's a placeholder or a real URL
      if (imageUrl.startsWith("http")) {
        console.log("Using real image URL from FAL API")
      } else {
        console.log("Using placeholder image")
      }

      setGeneratedDesign(imageUrl)
      setIsGenerating(false)

      // Create a design object that can be saved
      const newDesign: Partial<Design> = {
        name: designPrompt.substring(0, 50),
        prompt: enhancedPrompt || designPrompt,
        content: imageUrl,
        type: "image",
        settings: {
          style: selectedStyle,
          complexity: complexity,
        },
      }

      // Set in context for use in try-on page
      setCurrentDesign(newDesign as Design)
    } else {
      console.error("Invalid image URL received:", imageUrl)
      setIsGenerating(false)
    }
  }

  const handleSaveDesign = async () => {
    if (!isAuthenticated) {
      // Prompt to login
      if (confirm("You need to be logged in to save designs. Would you like to login now?")) {
        router.push("/login?redirect=design")
      }
      return
    }

    if (!generatedDesign) return

    setIsSaving(true)
    try {
      const { data, error } = await designApi.saveDesign({
        name: designPrompt.substring(0, 50),
        prompt: enhancedPrompt || designPrompt,
        content: generatedDesign,
        type: "image",
        settings: {
          style: selectedStyle,
          complexity,
        },
      })

      if (error) throw new Error(error)

      // Set in context and navigate to try-on page
      setCurrentDesign(data)
      router.push("/try-on")
    } catch (error) {
      console.error("Error saving design:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <AnimatePresence mode="wait">
          {!generatedDesign ? (
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-6">
                <Card className="bg-black/50 backdrop-blur-md border border-white/10 overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                      Create Your Masterpiece
                    </h2>

                    <Tabs defaultValue="text-prompt" value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-2 mb-6 bg-black/50 border border-white/10 rounded-full overflow-hidden p-1">
                        <TabsTrigger
                          value="text-prompt"
                          className="rounded-full data-[state=active]:bg-gradient-to-r from-purple-600 to-pink-600 data-[state=active]:text-white"
                        >
                          <Palette className="mr-2 h-4 w-4" />
                          Text Prompt
                        </TabsTrigger>
                        <TabsTrigger
                          value="upload-image"
                          className="rounded-full data-[state=active]:bg-gradient-to-r from-purple-600 to-pink-600 data-[state=active]:text-white"
                        >
                          <ImageIcon className="mr-2 h-4 w-4" />
                          Upload Image
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="text-prompt" className="space-y-6">
                        <div>
                          <label htmlFor="prompt" className="block text-sm font-medium mb-2 text-white/70">
                            Describe your perfect wall art design
                          </label>
                          <Textarea
                            id="prompt"
                            ref={promptRef}
                            placeholder="E.g., Abstract geometric shapes in vibrant colors with gold accents"
                            className="min-h-[120px] bg-black/50 border-white/20 focus:border-purple-500 text-white placeholder:text-white/40 rounded-xl"
                            value={designPrompt}
                            onChange={(e) => setDesignPrompt(e.target.value)}
                          />
                        </div>

                        <StyleSelector
                          selectedStyle={selectedStyle}
                          onSelectStyle={setSelectedStyle}
                          complexity={complexity}
                          onSetComplexity={setComplexity}
                        />

                        {designPrompt.trim().length > 0 && (
                          <PromptEnhancer
                            userPrompt={designPrompt}
                            style={selectedStyle}
                            complexity={complexity}
                            onEnhancedPrompt={handleEnhancedPrompt}
                          />
                        )}
                      </TabsContent>

                      <TabsContent value="upload-image" className="space-y-6">
                        <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center">
                          <ImageIcon className="h-16 w-16 mx-auto mb-4 text-white/40" />
                          <p className="mb-4 text-white/70">Drag and drop an image, or click to browse</p>
                          <Input type="file" className="hidden" id="image-upload" accept="image/*" />
                          <Button
                            variant="outline"
                            onClick={() => document.getElementById("image-upload")?.click()}
                            className="border-white/20 text-white hover:bg-white/10 rounded-full"
                          >
                            Browse Files
                          </Button>
                          <p className="mt-4 text-xs text-white/50">
                            Supported formats: JPG, PNG, WEBP. Max file size: 10MB
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </Card>

                {showImageGenerator && enhancedPrompt && (
                  <ImageGenerationExperience
                    prompt={enhancedPrompt}
                    style={selectedStyle}
                    onImageGenerated={handleImageGenerated}
                  />
                )}
              </div>

              <div className="space-y-6">
                <Card className="bg-black/50 backdrop-blur-md border border-white/10 p-6">
                  <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                    Need Inspiration?
                  </h2>
                  <DesignSuggestions
                    onSelectSuggestion={(suggestion) => {
                      setDesignPrompt(suggestion)
                      setActiveTab("text-prompt")
                    }}
                  />
                </Card>

                <Card className="bg-black/50 backdrop-blur-md border border-white/10 p-6">
                  <h2 className="text-lg font-bold mb-4 text-white/90">How It Works</h2>
                  <ol className="space-y-3 text-white/70">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs mr-3 mt-0.5">
                        1
                      </span>
                      <span>Describe your vision or select from our suggestions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 text-xs mr-3 mt-0.5">
                        2
                      </span>
                      <span>Enhance your prompt with our AI assistant</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-red-500/20 text-red-400 text-xs mr-3 mt-0.5">
                        3
                      </span>
                      <span>Generate your wall art with our powerful AI</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 text-xs mr-3 mt-0.5">
                        4
                      </span>
                      <span>Preview your art on your walls and customize as needed</span>
                    </li>
                  </ol>
                </Card>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <div className="aspect-[4/3] bg-black rounded-lg overflow-hidden">
                  <img
                    src={generatedDesign || "/placeholder.svg"}
                    alt="Generated wall art"
                    className="w-full h-full object-contain"
                    onLoad={() => console.log("Image loaded successfully:", generatedDesign)}
                    onError={(e) => {
                      console.error("Image failed to load:", generatedDesign)
                      e.currentTarget.src = "/placeholder.svg"
                    }}
                  />
                </div>
              </div>

              <Card className="bg-black/50 backdrop-blur-md border border-white/10 p-6">
                <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                  Your Masterpiece
                </h2>
                <p className="text-white/70 mb-6">Here's your AI-generated wall art based on your prompt:</p>
                <div className="bg-black/50 border border-white/10 p-4 rounded-xl mb-6">
                  <p className="italic text-white/90">"{enhancedPrompt || designPrompt}"</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-white/90">How do you like this design?</h3>
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => handleFeedback(true)}
                        className="flex-1 border-white/20 text-white hover:bg-white/10 rounded-full"
                      >
                        <ThumbsUp className="mr-2 h-4 w-4" />I love it
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleFeedback(false)}
                        className="flex-1 border-white/20 text-white hover:bg-white/10 rounded-full"
                      >
                        <ThumbsDown className="mr-2 h-4 w-4" />
                        Needs work
                      </Button>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-white/20 text-white hover:bg-white/10 rounded-full"
                      onClick={() => setGeneratedDesign(null)}
                    >
                      Try Again
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full"
                      disabled={isSaving}
                      onClick={handleSaveDesign}
                    >
                      {isSaving ? "Saving..." : "Save & Try On Wall"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  )
}

