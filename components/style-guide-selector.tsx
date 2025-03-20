"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { type Medium } from "./medium-selector"

export type StyleCategory = "trending" | "abstract" | "minimalist" | "retro" | "geometric" | "surreal"

export type Style = {
  id: string
  name: string
  description: string
  category: StyleCategory
  previewImage: string
  tags: string[]
}

interface StyleCardProps {
  style: Style
  isSelected: boolean
  onClick: () => void
  medium?: Medium | null
}

function StyleCard({ style, isSelected, onClick, medium }: StyleCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`cursor-pointer rounded-lg overflow-hidden transition-all ${
        isSelected ? "ring-2 ring-teal" : "hover:shadow-lg"
      }`}
      onClick={onClick}
    >
      <Card className="h-full bg-black border-chrome/20 overflow-hidden">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={style.previewImage}
            alt={style.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {medium && (
            <div className="absolute top-2 right-2">
              <Badge variant="outline" className="bg-black/70 border-chrome/40 text-chrome">
                {medium.name}
              </Badge>
            </div>
          )}
          {isSelected && (
            <div className="absolute inset-0 bg-teal/20 flex items-center justify-center">
              <div className="bg-teal text-black rounded-full p-2">
                <Sparkles className="h-6 w-6" />
              </div>
            </div>
          )}
        </div>
        <CardContent className="p-3">
          <h3 className="font-medium text-chrome">{style.name}</h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {style.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-chrome/10 text-chrome/70 text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface StyleGuideProps {
  selectedStyles: string[]
  onToggleStyle: (styleId: string) => void
  complexity: number
  onSetComplexity: (value: number) => void
  selectedMedium: Medium | null
}

export default function StyleGuideSelector({
  selectedStyles,
  onToggleStyle,
  complexity,
  onSetComplexity,
  selectedMedium,
}: StyleGuideProps) {
  const [activeTab, setActiveTab] = useState<StyleCategory>("trending")

  // These would ideally come from an API or database
  const styles: Style[] = [
    {
      id: "retro-futurism",
      name: "Retro Futurism",
      description: "Blending vintage aesthetics with futuristic elements",
      category: "trending",
      previewImage: "/placeholder.svg?height=300&width=300&text=Retro+Futurism",
      tags: ["nostalgic", "futuristic", "vibrant"],
    },
    {
      id: "synthwave",
      name: "Synthwave",
      description: "80s-inspired neon aesthetics with digital landscapes",
      category: "trending",
      previewImage: "/placeholder.svg?height=300&width=300&text=Synthwave",
      tags: ["neon", "grid", "sunset"],
    },
    {
      id: "minimalist-geometric",
      name: "Minimalist Geometric",
      description: "Clean, simple geometric shapes with limited color palette",
      category: "trending",
      previewImage: "/placeholder.svg?height=300&width=300&text=Minimalist",
      tags: ["clean", "shapes", "simple"],
    },
    {
      id: "abstract-expressionism",
      name: "Abstract Expressionism",
      description: "Spontaneous, emotional abstract compositions",
      category: "abstract",
      previewImage: "/placeholder.svg?height=300&width=300&text=Abstract",
      tags: ["expressive", "colorful", "dynamic"],
    },
    {
      id: "fluid-abstract",
      name: "Fluid Abstract",
      description: "Flowing, liquid-like abstract patterns",
      category: "abstract",
      previewImage: "/placeholder.svg?height=300&width=300&text=Fluid",
      tags: ["flowing", "organic", "colorful"],
    },
    {
      id: "geometric-abstract",
      name: "Geometric Abstract",
      description: "Abstract compositions using geometric forms",
      category: "abstract",
      previewImage: "/placeholder.svg?height=300&width=300&text=Geometric",
      tags: ["structured", "precise", "balanced"],
    },
    {
      id: "minimalist-typography",
      name: "Minimalist Typography",
      description: "Clean, simple text-based designs",
      category: "minimalist",
      previewImage: "/placeholder.svg?height=300&width=300&text=Typography",
      tags: ["text", "clean", "simple"],
    },
    {
      id: "minimalist-line-art",
      name: "Minimalist Line Art",
      description: "Simple line drawings with minimal detail",
      category: "minimalist",
      previewImage: "/placeholder.svg?height=300&width=300&text=Line+Art",
      tags: ["lines", "simple", "elegant"],
    },
    {
      id: "atomic-age",
      name: "Atomic Age",
      description: "Mid-century modern inspired by atomic science",
      category: "retro",
      previewImage: "/placeholder.svg?height=300&width=300&text=Atomic+Age",
      tags: ["50s", "boomerang", "starburst"],
    },
    {
      id: "vaporwave",
      name: "Vaporwave",
      description: "90s internet aesthetic with glitch elements",
      category: "retro",
      previewImage: "/placeholder.svg?height=300&width=300&text=Vaporwave",
      tags: ["glitch", "pastel", "nostalgic"],
    },
    {
      id: "bauhaus",
      name: "Bauhaus",
      description: "Geometric, primary colors inspired by Bauhaus movement",
      category: "geometric",
      previewImage: "/placeholder.svg?height=300&width=300&text=Bauhaus",
      tags: ["primary colors", "shapes", "structured"],
    },
    {
      id: "isometric",
      name: "Isometric",
      description: "3D-like geometric designs with isometric perspective",
      category: "geometric",
      previewImage: "/placeholder.svg?height=300&width=300&text=Isometric",
      tags: ["3D", "perspective", "technical"],
    },
    {
      id: "surrealist-dreamscape",
      name: "Surrealist Dreamscape",
      description: "Dream-like scenes with unexpected juxtapositions",
      category: "surreal",
      previewImage: "/placeholder.svg?height=300&width=300&text=Dreamscape",
      tags: ["dream", "unexpected", "symbolic"],
    },
    {
      id: "cosmic-surrealism",
      name: "Cosmic Surrealism",
      description: "Space-themed surrealist compositions",
      category: "surreal",
      previewImage: "/placeholder.svg?height=300&width=300&text=Cosmic",
      tags: ["space", "planets", "stars"],
    },
  ]

  // Filter styles by category
  const filteredStyles = styles.filter((style) => style.category === activeTab)

  // AI recommendations would be dynamically generated
  const aiRecommendations = [
    styles.find((s) => s.id === "retro-futurism"),
    styles.find((s) => s.id === "synthwave"),
    styles.find((s) => s.id === "minimalist-geometric"),
  ].filter(Boolean) as Style[]

  return (
    <div>
      <h2 className="text-2xl font-display font-bold mb-6 text-chrome">CHOOSE YOUR STYLE DIRECTION</h2>
      <p className="text-chrome/70 mb-8">
        Select one or more style influences to guide the AI in generating your design.
      </p>

      <Tabs defaultValue="trending" value={activeTab} onValueChange={(value) => setActiveTab(value as StyleCategory)}>
        <TabsList className="grid grid-cols-6 mb-6 bg-black/50">
          <TabsTrigger value="trending" className="data-[state=active]:bg-teal data-[state=active]:text-black">
            Trending
          </TabsTrigger>
          <TabsTrigger value="abstract" className="data-[state=active]:bg-teal data-[state=active]:text-black">
            Abstract
          </TabsTrigger>
          <TabsTrigger value="minimalist" className="data-[state=active]:bg-teal data-[state=active]:text-black">
            Minimalist
          </TabsTrigger>
          <TabsTrigger value="retro" className="data-[state=active]:bg-teal data-[state=active]:text-black">
            Retro
          </TabsTrigger>
          <TabsTrigger value="geometric" className="data-[state=active]:bg-teal data-[state=active]:text-black">
            Geometric
          </TabsTrigger>
          <TabsTrigger value="surreal" className="data-[state=active]:bg-teal data-[state=active]:text-black">
            Surreal
          </TabsTrigger>
        </TabsList>

        {activeTab === "trending" && (
          <div className="mb-8">
            <div className="bg-black/30 border border-chrome/20 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-teal" />
                <h3 className="text-lg font-display font-bold text-teal">AI Recommendations</h3>
              </div>
              <p className="text-sm text-chrome/70 mb-4">
                Based on current trends and your selected medium, our AI suggests these styles:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {aiRecommendations.map(
                  (style) =>
                    style && (
                      <StyleCard
                        key={style.id}
                        style={style}
                        isSelected={selectedStyles.includes(style.id)}
                        onClick={() => onToggleStyle(style.id)}
                        medium={selectedMedium}
                      />
                    )
                )}
              </div>
            </div>
          </div>
        )}

        <TabsContent value={activeTab} className="mt-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredStyles.map((style) => (
              <StyleCard
                key={style.id}
                style={style}
                isSelected={selectedStyles.includes(style.id)}
                onClick={() => onToggleStyle(style.id)}
                medium={selectedMedium}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <div className="bg-black/30 border border-chrome/20 rounded-lg p-6">
          <h3 className="text-lg font-display font-bold text-chrome mb-4">Style Parameters</h3>

          <div className="space-y-6">
            <div>
              <Label className="text-sm font-mono uppercase tracking-wider text-chrome mb-2 block">
                Complexity: {complexity}%
              </Label>
              <Slider
                min={10}
                max={100}
                step={5}
                value={[complexity]}
                onValueChange={(value) => onSetComplexity(value[0])}
                className="[&>span]:bg-teal"
              />
              <div className="flex justify-between text-xs text-chrome/50 mt-1">
                <span>Simple</span>
                <span>Complex</span>
              </div>
            </div>
          </div>

          {selectedStyles.length > 0 && (
            <div className="mt-6 pt-6 border-t border-chrome/20">
              <Label className="text-sm font-mono uppercase tracking-wider text-chrome mb-2 block">
                Selected Styles
              </Label>
              <div className="flex flex-wrap gap-2">
                {selectedStyles.map((styleId) => {
                  const style = styles.find((s) => s.id === styleId)
                  return (
                    style && (
                      <Badge
                        key={styleId}
                        className="bg-teal/20 text-teal hover:bg-teal/30 cursor-pointer"
                        onClick={() => onToggleStyle(styleId)}
                      >
                        {style.name} ✕
                      </Badge>
                    )
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
