"use client"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DesignSuggestionsProps {
  onSelectSuggestion: (suggestion: string) => void
}

const suggestions = {
  abstract: [
    "Geometric shapes in vibrant colors with gold accents",
    "Fluid abstract painting with blues and teals reminiscent of ocean waves",
    "Minimalist black and white abstract with a single red element",
  ],
  nature: [
    "Serene forest landscape with morning mist and sunlight",
    "Close-up of tropical leaves in watercolor style",
    "Mountain range silhouette at sunset with gradient sky",
  ],
  modern: [
    "Mid-century modern pattern with retro colors and shapes",
    "Architectural line art of famous buildings in gold on black",
    "Minimalist cityscape with reflections in monochrome",
  ],
}

export default function DesignSuggestions({ onSelectSuggestion }: DesignSuggestionsProps) {
  return (
    <Tabs defaultValue="abstract">
      <TabsList className="grid w-full grid-cols-3 mb-6 bg-black/50 border border-white/10 rounded-full overflow-hidden p-1">
        <TabsTrigger
          value="abstract"
          className="rounded-full data-[state=active]:bg-gradient-to-r from-purple-600 to-pink-600 data-[state=active]:text-white"
        >
          Abstract
        </TabsTrigger>
        <TabsTrigger
          value="nature"
          className="rounded-full data-[state=active]:bg-gradient-to-r from-purple-600 to-pink-600 data-[state=active]:text-white"
        >
          Nature
        </TabsTrigger>
        <TabsTrigger
          value="modern"
          className="rounded-full data-[state=active]:bg-gradient-to-r from-purple-600 to-pink-600 data-[state=active]:text-white"
        >
          Modern
        </TabsTrigger>
      </TabsList>

      {Object.entries(suggestions).map(([category, examples]) => (
        <TabsContent key={category} value={category} className="space-y-2">
          {examples.map((example, i) => (
            <Button
              key={i}
              variant="ghost"
              className="w-full justify-start text-left h-auto py-3 px-4 rounded-xl text-white/80 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20"
              onClick={() => onSelectSuggestion(example)}
            >
              {example}
            </Button>
          ))}
        </TabsContent>
      ))}
    </Tabs>
  )
}

