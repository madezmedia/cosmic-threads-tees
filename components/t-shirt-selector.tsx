"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Filter } from "lucide-react"
import type { PrintfulProduct } from "@/lib/printful-api"
import { getProducts } from "@/lib/client-api"

interface TShirtSelectorProps {
  onSelect: (tshirt: PrintfulProduct) => void
  selectedTShirt: PrintfulProduct | null
}

export default function TShirtSelector({ onSelect, selectedTShirt }: TShirtSelectorProps) {
  const [tshirts, setTshirts] = useState<PrintfulProduct[]>([])
  const [filteredTshirts, setFilteredTshirts] = useState<PrintfulProduct[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTShirts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getProducts()
        setTshirts(data)
        setFilteredTshirts(data)
      } catch (error) {
        console.error("Failed to fetch t-shirts:", error)
        setError("Failed to load products. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    loadTShirts()
  }, [])

  useEffect(() => {
    let filtered = tshirts

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (tshirt) =>
          tshirt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tshirt.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by category (this would need to be adapted to your actual data structure)
    if (category !== "all") {
      filtered = filtered.filter((tshirt) => {
        // This is a simplified example - adjust based on your actual data
        if (category === "men" && tshirt.name.toLowerCase().includes("men")) {
          return true
        }
        if (category === "women" && tshirt.name.toLowerCase().includes("women")) {
          return true
        }
        return false
      })
    }

    setFilteredTshirts(filtered)
  }, [searchQuery, category, tshirts])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
  }

  const handleTShirtSelect = (tshirt: PrintfulProduct) => {
    onSelect(tshirt)
  }

  return (
    <div>
      <h2 className="text-2xl font-display font-bold mb-6 text-chrome">SELECT YOUR T-SHIRT STYLE</h2>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="md:w-1/3">
          <Card className="bg-black border-chrome/20">
            <CardContent className="pt-6">
              <div className="mb-6">
                <Label htmlFor="search" className="text-base font-mono uppercase tracking-wider text-chrome mb-2 block">
                  Search
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-chrome/60" />
                  <Input
                    id="search"
                    placeholder="Search t-shirts..."
                    className="pl-10 bg-black border-chrome/30 text-chrome placeholder:text-chrome/40"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-mono uppercase tracking-wider text-chrome mb-2 block">
                  <Filter className="inline-block mr-2 h-4 w-4" />
                  Categories
                </Label>
                <Tabs defaultValue="all" value={category} onValueChange={handleCategoryChange}>
                  <TabsList className="grid grid-cols-3 mb-4 bg-black/50">
                    <TabsTrigger value="all" className="data-[state=active]:bg-teal data-[state=active]:text-black">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="men" className="data-[state=active]:bg-teal data-[state=active]:text-black">
                      Men
                    </TabsTrigger>
                    <TabsTrigger value="women" className="data-[state=active]:bg-teal data-[state=active]:text-black">
                      Women
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-2/3">
          <Card className="bg-black border-chrome/20">
            <CardContent className="pt-6">
              <h3 className="text-lg font-mono uppercase tracking-wider text-chrome mb-4">Available T-Shirts</h3>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="flex gap-4 p-4 border border-chrome/20 rounded-lg">
                      <Skeleton className="h-24 w-24 rounded bg-chrome/10" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-3/4 mb-2 bg-chrome/10" />
                        <Skeleton className="h-3 w-1/2 mb-4 bg-chrome/10" />
                        <Skeleton className="h-3 w-1/4 bg-chrome/10" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-400">{error}</p>
                </div>
              ) : filteredTshirts.length > 0 ? (
                <RadioGroup
                  value={selectedTShirt?.id.toString()}
                  onValueChange={(value) => {
                    const selected = tshirts.find((t) => t.id.toString() === value)
                    if (selected) handleTShirtSelect(selected)
                  }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredTshirts.map((tshirt) => (
                      <div
                        key={tshirt.id}
                        className={`flex gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedTShirt?.id === tshirt.id
                            ? "border-magenta bg-magenta/10"
                            : "border-chrome/20 hover:border-chrome/40"
                        }`}
                        onClick={() => handleTShirtSelect(tshirt)}
                      >
                        <RadioGroupItem value={tshirt.id.toString()} id={`tshirt-${tshirt.id}`} className="sr-only" />
                        <img
                          src={tshirt.thumbnail_url || "/placeholder.svg?height=200&width=200&text=T-Shirt"}
                          alt={tshirt.name}
                          className="h-24 w-24 object-contain"
                        />
                        <div>
                          <Label htmlFor={`tshirt-${tshirt.id}`} className="font-medium cursor-pointer text-chrome">
                            {tshirt.name}
                          </Label>
                          <p className="text-sm text-chrome/60 mb-2">{tshirt.description}</p>
                          <p className="text-sm font-mono text-teal">${tshirt.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              ) : (
                <div className="text-center py-8">
                  <p className="text-chrome/60">No t-shirts found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedTShirt && (
        <div className="bg-black/50 border border-chrome/20 p-4 rounded-lg">
          <h3 className="font-mono uppercase tracking-wider text-teal mb-2">Selected T-Shirt</h3>
          <div className="flex items-center gap-4">
            <img
              src={selectedTShirt.thumbnail_url || "/placeholder.svg?height=200&width=200&text=T-Shirt"}
              alt={selectedTShirt.name}
              className="h-16 w-16 object-contain"
            />
            <div>
              <p className="font-medium text-chrome">{selectedTShirt.name}</p>
              <p className="text-sm text-chrome/60">{selectedTShirt.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

