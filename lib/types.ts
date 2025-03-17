export interface WallArt {
  id: number
  name: string
  description: string
  price: number
  image: string
  sizes: Array<{
    name: string
    dimensions: string
    price: number
  }>
  materials: string[]
  frameOptions: string[]
}

export interface Design {
  id: number
  type: "image" | "text"
  content: string
  prompt: string
  settings: any
}

export interface Room {
  id: number
  name: string
  image: string
  views: string[]
}

export interface TShirt {
  id: number
  name: string
  description: string
  price: number
  image: string
  mockupImage: string
  category: "men" | "women" | "all"
  colors: string[]
  sizes: string[]
}

