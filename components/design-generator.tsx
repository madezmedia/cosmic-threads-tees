"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Sparkles, Image, RefreshCw, Loader2 } from "lucide-react"
import type { TShirt, Design } from "@/lib/types"
// Update the import to use the correct path
import { generateDesign } from "@/lib/ai-service"
import PromptTemplates from "@/components/prompt-templates"

interface DesignGeneratorProps {
  onGenerate: (design: Design) => void
  selectedTShirt: TShirt | null
  generatedDesign: Design | null
  setIsLoading: (loading: boolean) => void
}

export default function DesignGenerator({
  onGenerate,
  selectedTShirt,
  generatedDesign,
  setIsLoading,
}: DesignGeneratorProps) {
  const [prompt, setPrompt] = useState("")
  const [activeTab, setActiveTab] = useState("text-prompt")
  const [isGenerating, setIsGenerating] = useState(false)
  const [designType, setDesignType] = useState<"text" | "image">("image")
  const [textSettings, setTextSettings] = useState({
    fontSize: 24,
    fontFamily: "Orbitron",
    fontWeight: "normal",
    color: "#40E0D0",
  })
  const [imageSettings, setImageSettings] = useState({
    style: "retro-futuristic",
    complexity: 70,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleGenerateDesign = async () => {
    if (!prompt.trim()) return

    try {
      setIsGenerating(true)
      setIsLoading(true)

      // Call the AI service to generate the design
      const design = await generateDesign(prompt, designType, designType === "text" ? textSettings : imageSettings)

      onGenerate(design)
    } catch (error) {
      console.error("Failed to generate design:", error)
    } finally {
      setIsGenerating(false)
      setIsLoading(false)
    }
  }

  const handlePromptTemplateSelect = (templatePrompt: string) => {
    setPrompt(templatePrompt)
    setActiveTab("text-prompt")
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would process the uploaded image
    // For now, we'll just simulate it
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          // Create a design from the uploaded image
          const design: Design = {
            id: Date.now(),
            type: "image",
            content: event.target.result as string,
            prompt: "Uploaded image",
            settings: {},
          }
          onGenerate(design)
        }
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="bg-black border-chrome/20">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-display font-bold mb-6 text-chrome">GENERATE YOUR DESIGN</h2>

          <Tabs defaultValue="text-prompt" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-black/50">
              <TabsTrigger
                value="text-prompt"
                className="data-[state=active]:bg-magenta data-[state=active]:text-white"
              >
                Text Prompt
              </TabsTrigger>
              <TabsTrigger
                value="upload-image"
                className="data-[state=active]:bg-magenta data-[state=active]:text-white"
              >
                Upload Image
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text-prompt" className="space-y-6">
              <div>
                <Label htmlFor="prompt" className="text-base font-mono uppercase tracking-wider text-chrome mb-2 block">
                  Describe your design
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="E.g., A retro-futuristic space station with planets and stars in neon colors"
                  className="min-h-[120px] bg-black border-chrome/30 text-chrome placeholder:text-chrome/40"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <div>
                <Label className="text-base font-mono uppercase tracking-wider text-chrome mb-2 block">
                  Design Type
                </Label>
                <div className="flex gap-4">
                  <Button
                    variant={designType === "image" ? "default" : "outline"}
                    onClick={() => setDesignType("image")}
                    className={`flex-1 ${
                      designType === "image"
                        ? "bg-teal text-black hover:bg-teal/80"
                        : "border-chrome/30 text-chrome hover:bg-chrome/10"
                    }`}
                  >
                    <Image className="mr-2 h-4 w-4" />
                    Image Design
                  </Button>
                  <Button
                    variant={designType === "text" ? "default" : "outline"}
                    onClick={() => setDesignType("text")}
                    className={`flex-1 ${
                      designType === "text"
                        ? "bg-teal text-black hover:bg-teal/80"
                        : "border-chrome/30 text-chrome hover:bg-chrome/10"
                    }`}
                  >
                    <span className="mr-2">T</span>
                    Text Design
                  </Button>
                </div>
              </div>

              {designType === "text" && (
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="font-family"
                      className="text-sm font-mono uppercase tracking-wider text-chrome mb-1 block"
                    >
                      Font Family
                    </Label>
                    <select
                      id="font-family"
                      className="w-full rounded-md border border-chrome/30 bg-black text-chrome px-3 py-2"
                      value={textSettings.fontFamily}
                      onChange={(e) => setTextSettings({ ...textSettings, fontFamily: e.target.value })}
                    >
                      <option value="Orbitron">Orbitron</option>
                      <option value="Audiowide">Audiowide</option>
                      <option value="Syncopate">Syncopate</option>
                      <option value="Rajdhani">Rajdhani</option>
                      <option value="Exo">Exo</option>
                    </select>
                  </div>

                  <div>
                    <Label
                      htmlFor="font-size"
                      className="text-sm font-mono uppercase tracking-wider text-chrome mb-1 block"
                    >
                      Font Size: {textSettings.fontSize}px
                    </Label>
                    <Slider
                      id="font-size"
                      min={12}
                      max={72}
                      step={1}
                      value={[textSettings.fontSize]}
                      onValueChange={(value) => setTextSettings({ ...textSettings, fontSize: value[0] })}
                      className="[&>span]:bg-teal"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="font-weight"
                      className="text-sm font-mono uppercase tracking-wider text-chrome mb-1 block"
                    >
                      Font Weight
                    </Label>
                    <select
                      id="font-weight"
                      className="w-full rounded-md border border-chrome/30 bg-black text-chrome px-3 py-2"
                      value={textSettings.fontWeight}
                      onChange={(e) => setTextSettings({ ...textSettings, fontWeight: e.target.value })}
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                      <option value="lighter">Light</option>
                    </select>
                  </div>

                  <div>
                    <Label
                      htmlFor="text-color"
                      className="text-sm font-mono uppercase tracking-wider text-chrome mb-1 block"
                    >
                      Text Color
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        id="text-color"
                        value={textSettings.color}
                        onChange={(e) => setTextSettings({ ...textSettings, color: e.target.value })}
                        className="w-12 h-10 p-1 bg-black border-chrome/30"
                      />
                      <Input
                        type="text"
                        value={textSettings.color}
                        onChange={(e) => setTextSettings({ ...textSettings, color: e.target.value })}
                        className="flex-1 bg-black border-chrome/30 text-chrome"
                      />
                    </div>
                  </div>
                </div>
              )}

              {designType === "image" && (
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="style"
                      className="text-sm font-mono uppercase tracking-wider text-chrome mb-1 block"
                    >
                      Image Style
                    </Label>
                    <select
                      id="style"
                      className="w-full rounded-md border border-chrome/30 bg-black text-chrome px-3 py-2"
                      value={imageSettings.style}
                      onChange={(e) => setImageSettings({ ...imageSettings, style: e.target.value })}
                    >
                      <option value="retro-futuristic">Retro-Futuristic</option>
                      <option value="synthwave">Synthwave</option>
                      <option value="vaporwave">Vaporwave</option>
                      <option value="cyberpunk">Cyberpunk</option>
                      <option value="atomic-age">Atomic Age</option>
                    </select>
                  </div>

                  <div>
                    <Label
                      htmlFor="complexity"
                      className="text-sm font-mono uppercase tracking-wider text-chrome mb-1 block"
                    >
                      Complexity: {imageSettings.complexity}%
                    </Label>
                    <Slider
                      id="complexity"
                      min={10}
                      max={100}
                      step={5}
                      value={[imageSettings.complexity]}
                      onValueChange={(value) => setImageSettings({ ...imageSettings, complexity: value[0] })}
                      className="[&>span]:bg-teal"
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={handleGenerateDesign}
                disabled={!prompt.trim() || isGenerating}
                className="w-full bg-magenta hover:bg-magenta/80 text-white border-2 border-magenta/20 font-mono uppercase tracking-wider"
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
            </TabsContent>

            <TabsContent value="upload-image" className="space-y-4">
              <div className="border-2 border-dashed border-chrome/30 rounded-lg p-8 text-center">
                <Image className="h-12 w-12 mx-auto mb-4 text-chrome/40" />
                <p className="mb-2 text-sm text-chrome/60">Drag and drop an image, or click to browse</p>
                <Input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-chrome/30 text-chrome hover:bg-chrome/10 font-mono uppercase tracking-wider"
                >
                  Browse Files
                </Button>
              </div>

              <p className="text-sm text-chrome/60">Supported formats: JPG, PNG, SVG. Max file size: 5MB.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="space-y-8">
        <Card className="bg-black border-chrome/20">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-display font-bold mb-4 text-chrome">DESIGN PREVIEW</h2>
            <div className="aspect-square bg-black/50 border border-chrome/30 rounded-lg flex items-center justify-center overflow-hidden">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center text-center p-8">
                  <Loader2 className="h-12 w-12 animate-spin mb-4 text-magenta" />
                  <p className="text-lg font-medium text-chrome">Generating your design...</p>
                  <p className="text-sm text-chrome/60 mt-2 font-mono">
                    Our AI is creating something cosmic just for you
                  </p>
                </div>
              ) : generatedDesign ? (
                <div className="relative w-full h-full flex items-center justify-center p-4">
                  {generatedDesign.type === "image" ? (
                    <img
                      src={generatedDesign.content || "/placeholder.svg"}
                      alt="Generated design"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div
                      style={{
                        fontFamily: textSettings.fontFamily,
                        fontSize: `${textSettings.fontSize}px`,
                        fontWeight: textSettings.fontWeight,
                        color: textSettings.color,
                      }}
                      className="text-center p-4"
                    >
                      {generatedDesign.content}
                    </div>
                  )}
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
                  onClick={handleGenerateDesign}
                  disabled={!prompt.trim() || isGenerating}
                  className="border-chrome/30 text-chrome hover:bg-chrome/10 font-mono uppercase tracking-wider"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <PromptTemplates onSelect={handlePromptTemplateSelect} />
      </div>
    </div>
  )
}

