"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"

export type Medium = {
  id: string
  name: string
  description: string
  previewImage: string
}

interface MediumCardProps {
  medium: Medium
  isSelected: boolean
  onClick: () => void
}

function MediumCard({ medium, isSelected, onClick }: MediumCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`cursor-pointer rounded-xl overflow-hidden transition-all ${
        isSelected ? "ring-2 ring-magenta" : "hover:shadow-lg"
      }`}
      onClick={onClick}
    >
      <Card className="h-full bg-black border-chrome/20 overflow-hidden">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={medium.previewImage}
            alt={medium.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-display font-bold text-white">{medium.name}</h3>
          </div>
        </div>
        <CardContent className="p-4">
          <p className="text-sm text-chrome/80">{medium.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface MediumSelectorProps {
  onSelect: (medium: Medium) => void
  selectedMedium: Medium | null
}

export default function MediumSelector({ onSelect, selectedMedium }: MediumSelectorProps) {
  // These would ideally come from an API or database
  const mediums: Medium[] = [
    {
      id: "tshirt",
      name: "T-Shirt",
      description: "Classic, comfortable cotton tees perfect for showcasing your unique AI-generated designs.",
      previewImage: "/placeholder.svg?height=300&width=400&text=T-Shirt",
    },
    {
      id: "wallart",
      name: "Wall Art",
      description: "Transform your space with custom wall art featuring your AI-generated designs.",
      previewImage: "/placeholder.svg?height=300&width=400&text=Wall+Art",
    },
    {
      id: "hoodie",
      name: "Hoodie",
      description: "Cozy, premium hoodies that make your AI-generated designs stand out.",
      previewImage: "/placeholder.svg?height=300&width=400&text=Hoodie",
    },
    {
      id: "mug",
      name: "Mug",
      description: "Start your day with a custom mug featuring your unique AI-generated design.",
      previewImage: "/placeholder.svg?height=300&width=400&text=Mug",
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-display font-bold mb-6 text-chrome">SELECT YOUR MEDIUM</h2>
      <p className="text-chrome/70 mb-8">
        Choose the product you want to customize with your AI-generated design.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mediums.map((medium) => (
          <MediumCard
            key={medium.id}
            medium={medium}
            isSelected={selectedMedium?.id === medium.id}
            onClick={() => onSelect(medium)}
          />
        ))}
      </div>

      {selectedMedium && (
        <div className="mt-8 p-4 bg-black/50 border border-chrome/20 rounded-lg">
          <Label className="text-base font-mono uppercase tracking-wider text-teal mb-2 block">Selected Medium</Label>
          <div className="flex items-center gap-4">
            <img
              src={selectedMedium.previewImage}
              alt={selectedMedium.name}
              className="h-16 w-16 object-cover rounded"
            />
            <div>
              <p className="font-medium text-chrome">{selectedMedium.name}</p>
              <p className="text-sm text-chrome/60">{selectedMedium.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
