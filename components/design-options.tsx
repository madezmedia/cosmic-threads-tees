"use client"

import { useDesign } from "@/context/design-context"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"

export default function DesignOptions() {
  const { state, dispatch } = useDesign()
  const { placementOption, complexity, medium } = state

  const handlePlacementChange = (placement: string) => {
    dispatch({ type: "SET_PLACEMENT_OPTION", payload: placement })
  }

  const handleComplexityChange = (value: number[]) => {
    dispatch({ type: "SET_COMPLEXITY", payload: value[0] })
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-mono uppercase tracking-wider text-chrome mb-4 block">
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
              onClick={() => handlePlacementChange(placement)}
            >
              {placement.charAt(0).toUpperCase() + placement.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <Card className="bg-black/40 border border-chrome/20 rounded-lg p-4">
        <Label className="text-sm font-mono uppercase tracking-wider text-chrome mb-2 block">
          Complexity: {complexity}%
        </Label>
        <Slider
          min={10}
          max={100}
          step={5}
          value={[complexity]}
          onValueChange={handleComplexityChange}
          className="[&>span]:bg-teal"
        />
        <div className="flex justify-between text-xs text-chrome/50 mt-1">
          <span>Simple</span>
          <span>Complex</span>
        </div>
      </Card>

      {medium?.id === "tshirt" && (
        <Card className="bg-black/40 border border-chrome/20 rounded-lg p-4">
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
        </Card>
      )}

      {medium?.id === "wallart" && (
        <Card className="bg-black/40 border border-chrome/20 rounded-lg p-4">
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
        </Card>
      )}
    </div>
  )
}
