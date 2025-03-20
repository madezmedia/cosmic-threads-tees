"use client"

import { useState } from "react"
import { useDesign } from "@/context/design-context"
import UnifiedSelector, { SelectionOption } from "@/components/unified-selector"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"

type StyleCategory = "trending" | "abstract" | "minimalist" | "retro" | "geometric" | "surreal"

export default function StyleSelector() {
  const { state, dispatch } = useDesign()
  const { styles, medium } = state
  const [activeTab, setActiveTab] = useState<StyleCategory>("trending")

  // These would ideally come from an API or database
  const styleOptions: SelectionOption[] = [
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
  const filteredStyles = styleOptions.filter((style) => style.category === activeTab)

  // AI recommendations would be dynamically generated
  const aiRecommendations = [
    styleOptions.find((s) => s.id === "retro-futurism"),
    styleOptions.find((s) => s.id === "synthwave"),
    styleOptions.find((s) => s.id === "minimalist-geometric"),
  ].filter(Boolean) as SelectionOption[]

  const handleStyleToggle = (id: string) => {
    dispatch({ type: "TOGGLE_STYLE", payload: id })
  }

  return (
    <div>
      <h2 className="text-2xl font-display font-bold mb-4 text-chrome">CHOOSE YOUR STYLE DIRECTION</h2>
      <p className="text-chrome/70 mb-6">
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
            <Card className="bg-black/30 border border-chrome/20 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-teal" />
                <h3 className="text-lg font-display font-bold text-teal">AI Recommendations</h3>
              </div>
              <p className="text-sm text-chrome/70 mb-4">
                Based on current trends and your selected product, our AI suggests these styles:
              </p>
              
              <UnifiedSelector
                title="Recommended Styles"
                options={aiRecommendations}
                selectedIds={styles.filter(id => aiRecommendations.some(rec => rec.id === id))}
                onSelect={handleStyleToggle}
                multiSelect={true}
                showBadge={!!medium}
                badgeText={medium?.name}
                gridCols={3}
              />
            </Card>
          </div>
        )}

        <TabsContent value={activeTab} className="mt-0">
          <UnifiedSelector
            title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Styles`}
            options={filteredStyles}
            selectedIds={styles}
            onSelect={handleStyleToggle}
            multiSelect={true}
            showBadge={!!medium}
            badgeText={medium?.name}
            gridCols={4}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
