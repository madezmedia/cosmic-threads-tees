"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Loader2, ZoomIn, ZoomOut, RotateCw, Move } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { type Medium } from "./medium-selector"

interface ProductCustomizerProps {
  selectedMedium: Medium
  generatedDesign: any
  onAddToCart: () => void
  isAddingToCart: boolean
}

export default function ProductCustomizer({
  selectedMedium,
  generatedDesign,
  onAddToCart,
  isAddingToCart,
}: ProductCustomizerProps) {
  const [activeTab, setActiveTab] = useState("appearance")
  const [selectedColor, setSelectedColor] = useState("black")
  const [selectedSize, setSelectedSize] = useState("M")
  const [designScale, setDesignScale] = useState(100)
  const [designPosition, setDesignPosition] = useState({ x: 50, y: 50 })
  const [designRotation, setDesignRotation] = useState(0)
  const [mockupUrl, setMockupUrl] = useState("")
  const [isGeneratingMockup, setIsGeneratingMockup] = useState(false)
  const { toast } = useToast()

  // Colors would ideally come from the Printful API
  const colors = [
    { id: "black", name: "Black", hex: "#000000" },
    { id: "white", name: "White", hex: "#FFFFFF" },
    { id: "navy", name: "Navy", hex: "#1E2F4D" },
    { id: "heather", name: "Heather Grey", hex: "#D1D1D1" },
    { id: "red", name: "Red", hex: "#D62828" },
    { id: "royal", name: "Royal Blue", hex: "#2D5DA1" },
  ]

  // Sizes would ideally come from the Printful API
  const sizes = selectedMedium.id === "tshirt" ? ["S", "M", "L", "XL", "2XL", "3XL"] : ["One Size"]

  // Materials would ideally come from the Printful API
  const materials =
    selectedMedium.id === "wallart"
      ? [
          { id: "canvas", name: "Canvas" },
          { id: "poster", name: "Premium Poster" },
          { id: "framed", name: "Framed Print" },
          { id: "metal", name: "Metal Print" },
        ]
      : []

  // Dimensions would ideally come from the Printful API
  const dimensions =
    selectedMedium.id === "wallart"
      ? [
          { id: "small", name: "Small (12×16″)", price: 29.99 },
          { id: "medium", name: "Medium (18×24″)", price: 49.99 },
          { id: "large", name: "Large (24×36″)", price: 79.99 },
          { id: "xlarge", name: "Extra Large (30×40″)", price: 99.99 },
        ]
      : []

  const [selectedMaterial, setSelectedMaterial] = useState(materials.length > 0 ? materials[0].id : "")
  const [selectedDimension, setSelectedDimension] = useState(dimensions.length > 0 ? dimensions[0].id : "")

  // Generate mockup when customization options change
  useEffect(() => {
    if (!generatedDesign) return

    const generateMockup = async () => {
      setIsGeneratingMockup(true)

      try {
        // In a real implementation, this would call the Printful API
        // For demo purposes, we'll simulate an API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Simulate a mockup URL
        setMockupUrl(
          `/placeholder.svg?height=600&width=600&text=${encodeURIComponent(
            `${selectedMedium.name} Mockup\n${selectedColor} / ${selectedSize}`
          )}`
        )
      } catch (error) {
        console.error("Error generating mockup:", error)
        toast({
          title: "Mockup generation failed",
          description: "Failed to generate product mockup. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsGeneratingMockup(false)
      }
    }

    generateMockup()
  }, [selectedColor, selectedSize, designScale, designPosition, designRotation, generatedDesign, selectedMedium, toast])

  const handleAddToCart = () => {
    if (isAddingToCart) return

    onAddToCart()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="bg-black border-chrome/20">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-display font-bold mb-6 text-chrome">PRODUCT CUSTOMIZATION</h2>

          <Tabs defaultValue="appearance" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6 bg-black/50">
              <TabsTrigger
                value="appearance"
                className="data-[state=active]:bg-magenta data-[state=active]:text-white"
              >
                Appearance
              </TabsTrigger>
              <TabsTrigger
                value="design-placement"
                className="data-[state=active]:bg-magenta data-[state=active]:text-white"
              >
                Design Placement
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appearance" className="space-y-6">
              {selectedMedium.id === "tshirt" && (
                <>
                  <div>
                    <Label className="text-base font-mono uppercase tracking-wider text-chrome mb-4 block">
                      T-Shirt Color
                    </Label>
                    <div className="grid grid-cols-3 gap-3">
                      {colors.map((color) => (
                        <div
                          key={color.id}
                          className={`cursor-pointer p-3 rounded-lg border transition-all ${
                            selectedColor === color.id
                              ? "border-teal bg-teal/10"
                              : "border-chrome/20 hover:border-chrome/40"
                          }`}
                          onClick={() => setSelectedColor(color.id)}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded-full border border-chrome/30"
                              style={{ backgroundColor: color.hex }}
                            ></div>
                            <span className="text-sm text-chrome">{color.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-mono uppercase tracking-wider text-chrome mb-4 block">
                      T-Shirt Size
                    </Label>
                    <RadioGroup
                      value={selectedSize}
                      onValueChange={setSelectedSize}
                      className="grid grid-cols-6 gap-2"
                    >
                      {sizes.map((size) => (
                        <div key={size}>
                          <RadioGroupItem value={size} id={`size-${size}`} className="sr-only" />
                          <Label
                            htmlFor={`size-${size}`}
                            className={`flex h-10 w-full cursor-pointer items-center justify-center rounded-md border text-sm font-medium transition-all ${
                              selectedSize === size
                                ? "border-teal bg-teal/10 text-teal"
                                : "border-chrome/20 hover:border-chrome/40 text-chrome"
                            }`}
                          >
                            {size}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </>
              )}

              {selectedMedium.id === "wallart" && (
                <>
                  <div>
                    <Label className="text-base font-mono uppercase tracking-wider text-chrome mb-4 block">
                      Material
                    </Label>
                    <RadioGroup
                      value={selectedMaterial}
                      onValueChange={setSelectedMaterial}
                      className="grid grid-cols-2 gap-3"
                    >
                      {materials.map((material) => (
                        <div key={material.id}>
                          <RadioGroupItem value={material.id} id={`material-${material.id}`} className="sr-only" />
                          <Label
                            htmlFor={`material-${material.id}`}
                            className={`flex h-12 w-full cursor-pointer items-center justify-center rounded-md border text-sm font-medium transition-all ${
                              selectedMaterial === material.id
                                ? "border-teal bg-teal/10 text-teal"
                                : "border-chrome/20 hover:border-chrome/40 text-chrome"
                            }`}
                          >
                            {material.name}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-base font-mono uppercase tracking-wider text-chrome mb-4 block">
                      Dimensions
                    </Label>
                    <RadioGroup
                      value={selectedDimension}
                      onValueChange={setSelectedDimension}
                      className="grid grid-cols-1 gap-3"
                    >
                      {dimensions.map((dimension) => (
                        <div key={dimension.id}>
                          <RadioGroupItem
                            value={dimension.id}
                            id={`dimension-${dimension.id}`}
                            className="sr-only"
                          />
                          <Label
                            htmlFor={`dimension-${dimension.id}`}
                            className={`flex h-12 w-full cursor-pointer items-center justify-between rounded-md border px-4 text-sm font-medium transition-all ${
                              selectedDimension === dimension.id
                                ? "border-teal bg-teal/10 text-teal"
                                : "border-chrome/20 hover:border-chrome/40 text-chrome"
                            }`}
                          >
                            <span>{dimension.name}</span>
                            <span className="font-mono">${dimension.price.toFixed(2)}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </>
              )}

              <div className="bg-black/40 border border-chrome/20 rounded-lg p-4">
                <Label className="text-sm font-mono uppercase tracking-wider text-chrome mb-2 block">
                  Product Details
                </Label>
                <div className="space-y-1 text-sm text-chrome/70">
                  <p>
                    <span className="text-chrome">Medium:</span> {selectedMedium.name}
                  </p>
                  {selectedMedium.id === "tshirt" && (
                    <>
                      <p>
                        <span className="text-chrome">Color:</span>{" "}
                        {colors.find((c) => c.id === selectedColor)?.name || selectedColor}
                      </p>
                      <p>
                        <span className="text-chrome">Size:</span> {selectedSize}
                      </p>
                      <p>
                        <span className="text-chrome">Material:</span> 100% Cotton, 180 GSM
                      </p>
                    </>
                  )}
                  {selectedMedium.id === "wallart" && (
                    <>
                      <p>
                        <span className="text-chrome">Material:</span>{" "}
                        {materials.find((m) => m.id === selectedMaterial)?.name || "Canvas"}
                      </p>
                      <p>
                        <span className="text-chrome">Dimensions:</span>{" "}
                        {dimensions.find((d) => d.id === selectedDimension)?.name || "Medium (18×24″)"}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="design-placement" className="space-y-6">
              <div>
                <Label className="text-base font-mono uppercase tracking-wider text-chrome mb-2 block">
                  Design Scale: {designScale}%
                </Label>
                <div className="flex items-center gap-4">
                  <ZoomOut className="h-4 w-4 text-chrome/60" />
                  <Slider
                    min={50}
                    max={150}
                    step={5}
                    value={[designScale]}
                    onValueChange={(value) => setDesignScale(value[0])}
                    className="flex-1 [&>span]:bg-teal"
                  />
                  <ZoomIn className="h-4 w-4 text-chrome/60" />
                </div>
              </div>

              <div>
                <Label className="text-base font-mono uppercase tracking-wider text-chrome mb-2 block">
                  Design Position
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-chrome/60 mb-1 block">Horizontal: {designPosition.x}%</Label>
                    <Slider
                      min={0}
                      max={100}
                      step={5}
                      value={[designPosition.x]}
                      onValueChange={(value) => setDesignPosition({ ...designPosition, x: value[0] })}
                      className="[&>span]:bg-teal"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-chrome/60 mb-1 block">Vertical: {designPosition.y}%</Label>
                    <Slider
                      min={0}
                      max={100}
                      step={5}
                      value={[designPosition.y]}
                      onValueChange={(value) => setDesignPosition({ ...designPosition, y: value[0] })}
                      className="[&>span]:bg-teal"
                    />
                  </div>
                </div>
                <div className="flex justify-center mt-2">
                  <Badge variant="outline" className="bg-black/70 border-chrome/40 text-chrome">
                    <Move className="h-3 w-3 mr-1" /> Drag design to position
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-base font-mono uppercase tracking-wider text-chrome mb-2 block">
                  Design Rotation: {designRotation}°
                </Label>
                <div className="flex items-center gap-4">
                  <RotateCw className="h-4 w-4 text-chrome/60" />
                  <Slider
                    min={-180}
                    max={180}
                    step={5}
                    value={[designRotation]}
                    onValueChange={(value) => setDesignRotation(value[0])}
                    className="flex-1 [&>span]:bg-teal"
                  />
                </div>
              </div>

              <div className="bg-black/40 border border-chrome/20 rounded-lg p-4">
                <Label className="text-sm font-mono uppercase tracking-wider text-chrome mb-2 block">
                  Placement Details
                </Label>
                <div className="space-y-1 text-sm text-chrome/70">
                  <p>
                    <span className="text-chrome">Scale:</span> {designScale}%
                  </p>
                  <p>
                    <span className="text-chrome">Position:</span> X: {designPosition.x}%, Y: {designPosition.y}%
                  </p>
                  <p>
                    <span className="text-chrome">Rotation:</span> {designRotation}°
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Button
            onClick={handleAddToCart}
            disabled={isAddingToCart || isGeneratingMockup}
            className="w-full mt-6 bg-teal hover:bg-teal/80 text-black font-mono uppercase tracking-wider"
          >
            {isAddingToCart ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding to Cart...
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-black border-chrome/20">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-display font-bold mb-6 text-chrome">PRODUCT PREVIEW</h2>

          <div className="aspect-square bg-black/50 border border-chrome/30 rounded-lg flex items-center justify-center overflow-hidden">
            {isGeneratingMockup ? (
              <div className="flex flex-col items-center justify-center text-center p-8">
                <Loader2 className="h-12 w-12 animate-spin mb-4 text-magenta" />
                <p className="text-lg font-medium text-chrome">Generating mockup...</p>
                <p className="text-sm text-chrome/60 mt-2 font-mono">Creating your custom product preview</p>
              </div>
            ) : mockupUrl ? (
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <img src={mockupUrl} alt="Product mockup" className="max-w-full max-h-full object-contain" />
                <div
                  className="absolute pointer-events-none"
                  style={{
                    top: `${designPosition.y}%`,
                    left: `${designPosition.x}%`,
                    transform: `translate(-50%, -50%) scale(${designScale / 100}) rotate(${designRotation}deg)`,
                    maxWidth: "60%",
                    maxHeight: "60%",
                  }}
                >
                  <img
                    src={generatedDesign.content}
                    alt="Design overlay"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center p-8">
                <p className="text-lg font-medium text-chrome">No mockup available</p>
                <p className="text-sm text-chrome/60 mt-2 font-mono">
                  Select product options to generate a preview
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-4 gap-2">
            {["front", "back", "side", "detail"].map((view) => (
              <div
                key={view}
                className="aspect-square bg-black/30 border border-chrome/20 rounded-lg flex items-center justify-center cursor-pointer hover:border-chrome/40"
              >
                <p className="text-xs text-chrome/60 font-mono uppercase">{view} view</p>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-black/40 border border-chrome/20 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-mono uppercase tracking-wider text-chrome">Price</Label>
              <span className="text-xl font-mono font-bold text-teal">
                $
                {selectedMedium.id === "wallart"
                  ? dimensions.find((d) => d.id === selectedDimension)?.price.toFixed(2) || "29.99"
                  : "24.99"}
              </span>
            </div>
            <p className="text-xs text-chrome/60 mt-1">Free shipping on orders over $50</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
