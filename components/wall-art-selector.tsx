"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { WALL_ART_CATEGORIES, WALL_ART_SIZES, getProductsByCategory } from "@/lib/wall-art-service"
import type { PrintfulProduct } from "@/lib/printful-api"

interface WallArtSelectorProps {
  onSelectProduct: (product: PrintfulProduct, variantId: number) => void
  selectedProduct: PrintfulProduct | null
  selectedVariantId: number | null
}

export default function WallArtSelector({ onSelectProduct, selectedProduct, selectedVariantId }: WallArtSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<keyof typeof WALL_ART_CATEGORIES>("FRAMED_POSTERS")
  const [products, setProducts] = useState<PrintfulProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState<keyof typeof WALL_ART_SIZES>("MEDIUM")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true)
        setError(null)
        const categoryProducts = await getProductsByCategory(activeCategory)
        setProducts(categoryProducts)
      } catch (error) {
        console.error(`Failed to load ${activeCategory} products:`, error)
        setError(`Failed to load products. Please try again.`)
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [activeCategory])

  const handleCategoryChange = (category: keyof typeof WALL_ART_CATEGORIES) => {
    setActiveCategory(category)
  }

  const handleSizeChange = (size: keyof typeof WALL_ART_SIZES) => {
    setSelectedSize(size)
  }

  const handleProductSelect = (product: PrintfulProduct, variantId: number) => {
    onSelectProduct(product, variantId)
  }

  // Find a variant that matches the selected size
  const findVariantForSize = (product: PrintfulProduct, size: keyof typeof WALL_ART_SIZES): number | null => {
    if (!product.variants || product.variants.length === 0) return null

    // Get the dimensions for the selected size
    const sizeDimensions = WALL_ART_SIZES[size].dimensions

    // Find a variant that matches one of the dimensions
    for (const dimension of sizeDimensions) {
      const variant = product.variants.find((v) => v.name.includes(dimension) || v.size === dimension)

      if (variant) return variant.id
    }

    // If no match, return the first variant
    return product.variants[0].id
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
        Select Your Wall Art Type
      </h2>

      <Tabs
        defaultValue={activeCategory}
        value={activeCategory}
        onValueChange={(value) => handleCategoryChange(value as keyof typeof WALL_ART_CATEGORIES)}
      >
        <TabsList className="grid grid-cols-4 mb-6 bg-black/50 border border-white/10 rounded-xl overflow-hidden p-1">
          {Object.entries(WALL_ART_CATEGORIES).map(([key, category]) => (
            <TabsTrigger
              key={key}
              value={key}
              className="rounded-lg data-[state=active]:bg-gradient-to-r from-purple-600 to-pink-600 data-[state=active]:text-white"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(WALL_ART_CATEGORIES).map(([key, category]) => (
          <TabsContent key={key} value={key} className="space-y-4">
            <Card className="bg-black/50 backdrop-blur-md border border-white/10">
              <CardContent className="pt-6">
                <p className="text-white/70 mb-4">{category.description}</p>

                <h3 className="text-lg font-medium mb-3 text-white/90">Select Size</h3>
                <RadioGroup
                  value={selectedSize}
                  onValueChange={(value) => handleSizeChange(value as keyof typeof WALL_ART_SIZES)}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
                >
                  {Object.entries(WALL_ART_SIZES).map(([sizeKey, size]) => (
                    <div key={sizeKey} className="relative">
                      <RadioGroupItem value={sizeKey} id={`size-${sizeKey}`} className="peer sr-only" />
                      <Label
                        htmlFor={`size-${sizeKey}`}
                        className="flex flex-col items-center justify-between rounded-lg border-2 border-white/10 bg-black/30 p-4 hover:bg-white/5 hover:border-purple-500/50 peer-data-[state=checked]:border-purple-500 peer-data-[state=checked]:bg-purple-500/10 cursor-pointer"
                      >
                        <span className="text-sm font-medium mb-1">{size.name}</span>
                        <span className="text-xs text-white/50">{size.dimensions[0]}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[...Array(2)].map((_, index) => (
                      <div key={index} className="flex gap-4 p-4 border border-white/10 rounded-lg">
                        <Skeleton className="h-24 w-24 rounded bg-white/5" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-3/4 mb-2 bg-white/5" />
                          <Skeleton className="h-3 w-1/2 mb-4 bg-white/5" />
                          <Skeleton className="h-3 w-1/4 bg-white/5" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="text-center py-4 text-red-400">{error}</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {products.map((product) => {
                      const variantId = findVariantForSize(product, selectedSize)
                      return (
                        <div
                          key={product.id}
                          className={`flex gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedProduct?.id === product.id && selectedVariantId === variantId
                              ? "border-purple-500 bg-purple-500/10"
                              : "border-white/10 hover:border-white/30"
                          }`}
                          onClick={() => variantId && handleProductSelect(product, variantId)}
                        >
                          <img
                            src={product.thumbnail_url || "/placeholder.svg?height=100&width=100&text=Wall+Art"}
                            alt={product.name}
                            className="h-24 w-24 object-contain rounded"
                          />
                          <div>
                            <h4 className="font-medium text-white">{product.name}</h4>
                            <p className="text-sm text-white/60 mb-2">{product.description}</p>
                            <p className="text-sm font-medium text-purple-400">
                              {product.variants.find((v) => v.id === variantId)?.price
                                ? `$${product.variants.find((v) => v.id === variantId)?.price.toFixed(2)}`
                                : "Price varies by size"}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {selectedProduct && selectedVariantId && (
        <Card className="bg-black/50 backdrop-blur-md border border-white/10">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-2 text-white">Selected Product</h3>
            <div className="flex items-center gap-4">
              <img
                src={selectedProduct.thumbnail_url || "/placeholder.svg?height=80&width=80&text=Wall+Art"}
                alt={selectedProduct.name}
                className="h-16 w-16 object-contain rounded"
              />
              <div>
                <p className="font-medium text-white">{selectedProduct.name}</p>
                <p className="text-sm text-white/60">
                  Size: {selectedProduct.variants.find((v) => v.id === selectedVariantId)?.name || "Custom Size"}
                </p>
                <p className="text-sm font-medium text-purple-400">
                  $
                  {selectedProduct.variants.find((v) => v.id === selectedVariantId)?.price.toFixed(2) || "Price varies"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

