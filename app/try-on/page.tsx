"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ArrowRight, Camera, Upload, Home, Sparkles } from "lucide-react"
import Link from "next/link"
import VirtualRoomView from "@/components/virtual-room-view"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"
import WallArtMockup from "@/components/wall-art-mockup"
import { useApp } from "@/context/app-context"
import AppLayout from "@/components/app-layout"
import { productApi, designApi } from "@/lib/api-service"
import type { Design } from "@/lib/types"
import type { PrintfulProduct } from "@/lib/printful-api"
import { DesignProvider } from "@/context/design-context"

export default function TryOnPage() {
  const { currentDesign, selectedProduct, setSelectedProduct, selectedVariantId, setSelectedVariantId, addToCart } =
    useApp()
  const [selectedRoom, setSelectedRoom] = useState("living-room")
  const [userImage, setUserImage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("room-template")
  const [artSize, setArtSize] = useState(100)
  const [artPosition, setArtPosition] = useState({ x: 50, y: 50 })
  const [isLoading, setIsLoading] = useState(true)
  const [wallArtProducts, setWallArtProducts] = useState<PrintfulProduct[]>([])
  const [design, setDesign] = useState<Design | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)

        // Check if there's a design ID in the URL
        const designId = searchParams.get("design")

        if (designId) {
          // For now, we'll use a mock design since getDesignById is not implemented
          // In a real implementation, you would fetch the design from the API
          const mockDesign: Design = {
            id: parseInt(designId),
            type: "image",
            prompt: "Sample prompt",
            content: "/placeholder.svg?height=600&width=800&text=Sample+Design",
            settings: { style: "retro" }
          };
          
          setDesign(mockDesign);
          setUserImage(mockDesign.content);
        } else if (currentDesign) {
          // Use the design from context
          setDesign(currentDesign)
          if (currentDesign.content) {
            setUserImage(currentDesign.content)
          }
        } else {
          // Redirect to design page if no design is available
          router.push("/create")
        }

        // Load wall art products
        const { data: products, error: productsError } = await productApi.getWallArtProducts()
        if (productsError) throw new Error(productsError)

        if (products) {
          setWallArtProducts(products)

          // Select first product as default if none is selected
          if (!selectedProduct && products.length > 0) {
            setSelectedProduct(products[0])

            // Select first variant as default
            if (products[0].variants.length > 0) {
              setSelectedVariantId(products[0].variants[0].id)
            }
          }
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [currentDesign, router, searchParams, selectedProduct, setSelectedProduct, setSelectedVariantId])

  const handleCapturePhoto = () => {
    // In a real app, this would access the camera and capture a photo
    alert("Camera functionality would be implemented here")
  }

  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Simulate photo upload
    if (e.target.files && e.target.files[0]) {
      // In a real app, we would process the actual file
      setUserImage("/placeholder.svg?height=800&width=1200&text=Your+Room+Photo")
      setActiveTab("user-photo")
    }
  }

  const handleSizeChange = (value: number[]) => {
    setArtSize(value[0])
  }

  const handlePositionChange = (axis: "x" | "y", value: number[]) => {
    setArtPosition((prev) => ({ ...prev, [axis]: value[0] }))
  }

  const handleProductSelect = (product: PrintfulProduct) => {
    setSelectedProduct(product)

    // Select first variant as default
    if (product.variants.length > 0) {
      setSelectedVariantId(product.variants[0].id)
    }
  }

  const handleVariantSelect = (variantId: number) => {
    setSelectedVariantId(variantId)
  }

  const handleAddToCart = () => {
    if (!design || !selectedProduct || !selectedVariantId) {
      return
    }

    // Add the item to the cart
    addToCart({
      product: selectedProduct,
      variantId: selectedVariantId,
      design: design,
      quantity: 1,
      price: selectedProduct.variants.find((v) => v.id === selectedVariantId)?.price || selectedProduct.price,
    })

    // Navigate to cart
    router.push("/cart")
  }

  return (
    <AppLayout>
      <DesignProvider>
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <motion.h1
            className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Visualize Your Art
          </motion.h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-black/50 border border-white/10 rounded-full overflow-hidden p-1">
                  <TabsTrigger
                    value="room-template"
                    className="rounded-full data-[state=active]:bg-gradient-to-r from-purple-600 to-pink-600 data-[state=active]:text-white"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Room Templates
                  </TabsTrigger>
                  <TabsTrigger
                    value="user-photo"
                    className="rounded-full data-[state=active]:bg-gradient-to-r from-purple-600 to-pink-600 data-[state=active]:text-white"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Your Photo
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="room-template" className="pt-6">
                  <Card className="bg-black/50 backdrop-blur-md border border-white/10 mb-6">
                    <CardContent className="pt-6">
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2 text-white/70">Choose a room style</label>
                        <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                          <SelectTrigger className="bg-black/50 border-white/20 text-white rounded-xl">
                            <SelectValue placeholder="Select a room" />
                          </SelectTrigger>
                          <SelectContent className="bg-black border-white/20 text-white">
                            <SelectItem value="living-room">Modern Living Room</SelectItem>
                            <SelectItem value="bedroom">Minimalist Bedroom</SelectItem>
                            <SelectItem value="dining-room">Contemporary Dining Room</SelectItem>
                            <SelectItem value="office">Home Office</SelectItem>
                            <SelectItem value="hallway">Elegant Hallway</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <VirtualRoomView
                        roomType={selectedRoom}
                        artSize={artSize}
                        artPosition={artPosition}
                        artImage={design?.content || null}
                      />

                      {selectedProduct && selectedVariantId && design?.content && (
                        <WallArtMockup
                          product={selectedProduct}
                          variantId={selectedVariantId}
                          designImageUrl={design.content}
                        />
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="user-photo" className="pt-6">
                  <Card className="bg-black/50 backdrop-blur-md border border-white/10 mb-6">
                    <CardContent className="pt-6">
                      {userImage ? (
                        <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden">
                          <img
                            src={userImage || "/placeholder.svg"}
                            alt="Your room with the wall art"
                            className="w-full h-full object-cover"
                          />
                          <div
                            className="absolute flex items-center justify-center"
                            style={{
                              top: `${artPosition.y}%`,
                              left: `${artPosition.x}%`,
                              transform: `translate(-50%, -50%) scale(${artSize / 100})`,
                              maxWidth: "60%",
                              maxHeight: "60%",
                            }}
                          >
                            <img
                              src={design?.content || "/placeholder.svg?height=600&width=800&text=Wall+Art+Design"}
                              alt="Wall art overlay"
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mb-6">
                            <Upload className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-xl font-bold mb-2 text-white">Upload a photo of your room</h3>
                          <p className="text-white/70 text-center mb-6 max-w-md">
                            Upload a photo of your wall to see how the art would look in your space.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                              variant="outline"
                              onClick={handleCapturePhoto}
                              className="border-white/20 text-white hover:bg-white/10 rounded-full"
                            >
                              <Camera className="mr-2 h-4 w-4" />
                              Take Photo
                            </Button>
                            <Button
                              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full"
                              onClick={() => document.getElementById("photo-upload")?.click()}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Photo
                            </Button>
                            <input
                              type="file"
                              id="photo-upload"
                              className="hidden"
                              accept="image/*"
                              onChange={handleUploadPhoto}
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {(userImage || activeTab === "room-template") && (
                <Card className="bg-black/50 backdrop-blur-md border border-white/10">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold mb-4 text-white">Adjust Your Art</h3>

                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium mb-2 block text-white/70">Size: {artSize}%</label>
                        <Slider
                          min={50}
                          max={150}
                          step={5}
                          value={[artSize]}
                          onValueChange={handleSizeChange}
                          className="[&>span]:bg-purple-500"
                        />
                        <div className="flex justify-between text-xs text-white/50 mt-1">
                          <span>Small</span>
                          <span>Large</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block text-white/70">
                          Horizontal Position: {artPosition.x}%
                        </label>
                        <Slider
                          min={20}
                          max={80}
                          step={1}
                          value={[artPosition.x]}
                          onValueChange={(value) => handlePositionChange("x", value)}
                          className="[&>span]:bg-purple-500"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block text-white/70">
                          Vertical Position: {artPosition.y}%
                        </label>
                        <Slider
                          min={20}
                          max={80}
                          step={1}
                          value={[artPosition.y]}
                          onValueChange={(value) => handlePositionChange("y", value)}
                          className="[&>span]:bg-purple-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-between mt-6">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full" asChild>
                  <Link href="/create">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Design
                  </Link>
                </Button>
                <Button
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full"
                  onClick={handleAddToCart}
                  disabled={!selectedProduct || !selectedVariantId || !design}
                >
                  Add to Cart
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-black/50 backdrop-blur-md border border-white/10 h-full">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                    Your Wall Art
                  </h2>
                  <div className="aspect-[4/3] bg-black rounded-lg flex items-center justify-center mb-8 border border-white/10">
                    <img
                      src={design?.content || "/placeholder.svg?height=600&width=800&text=Your+Design"}
                      alt="Your wall art design"
                      className="max-w-[80%] max-h-[80%] object-contain"
                    />
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3 text-white">Size Options</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedProduct &&
                          selectedProduct.variants
                            .filter(
                              (v, i, arr) =>
                                // Only show unique sizes
                                arr.findIndex((v2) => v2.size === v.size) === i,
                            )
                            .map((variant) => (
                              <div
                                key={variant.id}
                                className={`border ${
                                  selectedVariantId === variant.id
                                    ? "border-purple-500 bg-purple-500/10"
                                    : "border-white/20 hover:border-purple-500"
                                } rounded-xl p-3 cursor-pointer transition-colors text-center text-sm`}
                                onClick={() => handleVariantSelect(variant.id)}
                              >
                                {variant.size || "Standard"}
                              </div>
                            ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3 text-white">Material</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {wallArtProducts.length > 0 &&
                          wallArtProducts.map((product) => (
                            <div
                              key={product.id}
                              className={`border ${
                                selectedProduct?.id === product.id
                                  ? "border-purple-500 bg-purple-500/10"
                                  : "border-white/20 hover:border-purple-500"
                              } rounded-xl p-3 cursor-pointer transition-colors text-center text-sm`}
                              onClick={() => handleProductSelect(product)}
                            >
                              {product.name.includes("Canvas")
                                ? "Canvas Print"
                                : product.name.includes("Poster")
                                  ? "Framed Print"
                                  : product.name}
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full py-6"
                        onClick={handleAddToCart}
                        disabled={!selectedProduct || !selectedVariantId || !design}
                      >
                        Add to Cart
                        <Sparkles className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </DesignProvider>
    </AppLayout>
  )
}
