"use client"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

interface StyleSelectorProps {
  selectedStyle: string
  onSelectStyle: (style: string) => void
  complexity: number
  onSetComplexity: (value: number) => void
}

export default function StyleSelector({
  selectedStyle,
  onSelectStyle,
  complexity,
  onSetComplexity,
}: StyleSelectorProps) {
  const styles = [
    { id: "abstract", name: "Abstract", description: "Non-representational forms and patterns" },
    { id: "minimalist", name: "Minimalist", description: "Simple, clean designs with limited elements" },
    { id: "impressionist", name: "Impressionist", description: "Emphasis on light, movement and color" },
    { id: "surrealist", name: "Surrealist", description: "Dreamlike, unexpected juxtapositions" },
    { id: "geometric", name: "Geometric", description: "Based on geometric shapes and patterns" },
    { id: "watercolor", name: "Watercolor", description: "Soft, flowing watercolor effects" },
  ]

  return (
    <div className="space-y-4">
      <div>
        <Label className="block text-sm font-medium mb-2 text-white/70">Select Art Style</Label>
        <div className="grid grid-cols-3 gap-2">
          {styles.map((style) => (
            <div
              key={style.id}
              className={`cursor-pointer p-3 rounded-xl border transition-all ${
                selectedStyle === style.id
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-white/10 hover:border-white/30"
              }`}
              onClick={() => onSelectStyle(style.id)}
            >
              <div className="text-center">
                <div className="font-medium text-sm mb-1">{style.name}</div>
                <div className="text-xs text-white/50 line-clamp-2">{style.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="block text-sm font-medium mb-2 text-white/70">Complexity: {complexity}%</Label>
        <Slider
          min={10}
          max={100}
          step={5}
          value={[complexity]}
          onValueChange={(value) => onSetComplexity(value[0])}
          className="[&>span]:bg-purple-500"
        />
        <div className="flex justify-between text-xs text-white/50 mt-1">
          <span>Simple</span>
          <span>Complex</span>
        </div>
      </div>
    </div>
  )
}

