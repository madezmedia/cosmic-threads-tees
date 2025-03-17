import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Filter, ArrowLeft } from "lucide-react"

export default function GalleryPage() {
  // This would normally be fetched from an API
  const designs = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Design ${i + 1}`,
    rating: (4 + Math.random()).toFixed(1),
    type: i % 2 === 0 ? "T-Shirt" : "Wall Art",
    designer: `Designer ${(i % 5) + 1}`,
  }))

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Design Gallery</h1>
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {designs.map((design) => (
          <Card key={design.id} className="overflow-hidden">
            <div className="relative h-[250px] w-full">
              <Image
                src={`/placeholder.svg?height=500&width=500&text=Design%20${design.id}`}
                alt={design.title}
                fill
                className="object-cover transition-transform hover:scale-105"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">{design.title}</p>
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="ml-1 text-sm">{design.rating}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{design.type}</span>
                <span>by {design.designer}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="outline">Load More</Button>
      </div>
    </div>
  )
}

