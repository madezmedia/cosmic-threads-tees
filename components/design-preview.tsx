"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import type { TShirt, Design } from "@/lib/types"
import { RotateCw, ZoomIn, Move, Download, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DesignPreviewProps {
  tshirt: TShirt
  design: Design
  onFinalize: () => void
}

export default function DesignPreview({ tshirt, design, onFinalize }: DesignPreviewProps) {
  const [position, setPosition] = useState({ x: 50, y: 40 })
  const [size, setSize] = useState(50)
  const [rotation, setRotation] = useState(0)
  const [selectedColor, setSelectedColor] = useState(tshirt.colors[0])
  const { toast } = useToast()

  const handlePositionChange = (axis: "x" | "y", value: number[]) => {
    setPosition((prev) => ({ ...prev, [axis]: value[0] }))
  }

  const handleSizeChange = (value: number[]) => {
    setSize(value[0])
  }

  const handleRotationChange = (value: number[]) => {
    setRotation(value[0])
  }

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
  }

  const handleDownload = () => {
    // In a real app, this would generate and download the design
    toast({
      title: "Design downloaded",
      description: "Your design has been downloaded successfully.",
    })
  }

  const handleShare = () => {
    // In a real app, this would open a share dialog
    toast({
      title: "Share your design",
      description: "Sharing functionality would be implemented here.",
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-display font-bold mb-6 text-chrome">PREVIEW YOUR DESIGN</h2>
        <Card className="overflow-hidden bg-black border-chrome/20">
          <CardContent className="p-0 relative">
            <div
              className="aspect-square flex items-center justify-center p-4"
              style={{ backgroundColor: selectedColor }}
            >
              <div className="relative w-full h-full">
                {/* T-shirt mockup */}
                <img
                  src={tshirt.mockupImage || "/placeholder.svg?height=400&width=300&text=T-Shirt+Mockup"}
                  alt="T-shirt mockup"
                  className="w-full h-full object-contain"
                />

                {/* Design overlay */}
                <div
                  className="absolute"
                  style={{
                    top: `${position.y}%`,
                    left: `${position.x}%`,
                    transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${size / 50})`,
                    maxWidth: "60%",
                    maxHeight: "60%",
                  }}
                >
                  {design.type === "image" ? (
                    <img
                      src={design.content || "/placeholder.svg"}
                      alt="Design"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div
                      style={{
                        fontFamily: design.settings.fontFamily || "Orbitron",
                        fontSize: `${design.settings.fontSize || 24}px`,
                        fontWeight: design.settings.fontWeight || "normal",
                        color: design.settings.color || "#40E0D0",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {design.content}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-display font-bold mb-6 text-chrome">CUSTOMIZE YOUR DESIGN</h2>
        <Card className="bg-black border-chrome/20">
          <CardContent className="pt-6 space-y-6">
            <div>
              <Label className="text-base font-mono uppercase tracking-wider text-chrome mb-2 block">
                T-Shirt Color
              </Label>
              <div className="flex flex-wrap gap-2">
                {tshirt.colors.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color ? "border-magenta" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                    aria-label={`Select ${color} color`}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-mono uppercase tracking-wider text-chrome mb-2 block flex items-center">
                <Move className="h-4 w-4 mr-2 text-teal" />
                Position
              </Label>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <Label htmlFor="position-x" className="text-sm text-chrome/80">
                      Horizontal: {position.x}%
                    </Label>
                  </div>
                  <Slider
                    id="position-x"
                    min={20}
                    max={80}
                    step={1}
                    value={[position.x]}
                    onValueChange={(value) => handlePositionChange("x", value)}
                    className="[&>span]:bg-teal"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <Label htmlFor="position-y" className="text-sm text-chrome/80">
                      Vertical: {position.y}%
                    </Label>
                  </div>
                  <Slider
                    id="position-y"
                    min={20}
                    max={80}
                    step={1}
                    value={[position.y]}
                    onValueChange={(value) => handlePositionChange("y", value)}
                    className="[&>span]:bg-teal"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-base font-mono uppercase tracking-wider text-chrome mb-2 block flex items-center">
                <ZoomIn className="h-4 w-4 mr-2 text-teal" />
                Size: {size}%
              </Label>
              <Slider
                min={20}
                max={100}
                step={5}
                value={[size]}
                onValueChange={handleSizeChange}
                className="[&>span]:bg-teal"
              />
            </div>

            <div>
              <Label className="text-base font-mono uppercase tracking-wider text-chrome mb-2 block flex items-center">
                <RotateCw className="h-4 w-4 mr-2 text-teal" />
                Rotation: {rotation}°
              </Label>
              <Slider
                min={-180}
                max={180}
                step={5}
                value={[rotation]}
                onValueChange={handleRotationChange}
                className="[&>span]:bg-teal"
              />
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1 border-chrome/30 text-chrome hover:bg-chrome/10 font-mono uppercase tracking-wider"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-chrome/30 text-chrome hover:bg-chrome/10 font-mono uppercase tracking-wider"
                onClick={handleShare}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button
                className="flex-1 bg-magenta hover:bg-magenta/80 text-white border-2 border-magenta/20 font-mono uppercase tracking-wider"
                onClick={onFinalize}
              >
                Add to Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

