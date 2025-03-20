"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"

export interface SelectionOption {
  id: string
  name: string
  description?: string
  previewImage: string
  category?: string
  tags?: string[]
}

interface SelectionCardProps {
  option: SelectionOption
  isSelected: boolean
  onClick: () => void
  showBadge?: boolean
  badgeText?: string
}

function SelectionCard({ option, isSelected, onClick, showBadge, badgeText }: SelectionCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`cursor-pointer rounded-lg overflow-hidden transition-all ${
        isSelected ? "ring-2 ring-teal" : "hover:shadow-lg"
      }`}
      onClick={onClick}
    >
      <Card className="h-full bg-black border-chrome/20 overflow-hidden">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={option.previewImage}
            alt={option.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {showBadge && badgeText && (
            <div className="absolute top-2 right-2">
              <Badge variant="outline" className="bg-black/70 border-chrome/40 text-chrome">
                {badgeText}
              </Badge>
            </div>
          )}
          {isSelected && (
            <div className="absolute inset-0 bg-teal/20 flex items-center justify-center">
              <div className="bg-teal text-black rounded-full p-2">
                <Sparkles className="h-6 w-6" />
              </div>
            </div>
          )}
        </div>
        <CardContent className="p-3">
          <h3 className="font-medium text-chrome">{option.name}</h3>
          {option.tags && option.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {option.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-chrome/10 text-chrome/70 text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {option.description && <p className="text-sm text-chrome/60 mt-1">{option.description}</p>}
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface UnifiedSelectorProps {
  title: string
  description?: string
  options: SelectionOption[]
  selectedIds: string[]
  onSelect: (id: string) => void
  multiSelect?: boolean
  showBadge?: boolean
  badgeText?: string
  gridCols?: number
}

export default function UnifiedSelector({
  title,
  description,
  options,
  selectedIds,
  onSelect,
  multiSelect = false,
  showBadge = false,
  badgeText,
  gridCols = 3,
}: UnifiedSelectorProps) {
  const handleSelect = (id: string) => {
    onSelect(id)
  }

  const gridClassName = `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${gridCols} gap-4`

  return (
    <div>
      {title && <h2 className="text-2xl font-display font-bold mb-4 text-chrome">{title}</h2>}
      {description && <p className="text-chrome/70 mb-6">{description}</p>}

      <div className={gridClassName}>
        {options.map((option) => (
          <SelectionCard
            key={option.id}
            option={option}
            isSelected={selectedIds.includes(option.id)}
            onClick={() => handleSelect(option.id)}
            showBadge={showBadge}
            badgeText={badgeText}
          />
        ))}
      </div>

      {selectedIds.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedIds.map((id) => {
            const option = options.find((o) => o.id === id)
            return (
              option && (
                <Badge
                  key={id}
                  className={`${
                    multiSelect ? "bg-teal/20 text-teal hover:bg-teal/30" : "bg-magenta/20 text-magenta hover:bg-magenta/30"
                  } cursor-pointer`}
                  onClick={() => handleSelect(id)}
                >
                  {option.name} {multiSelect && "✕"}
                </Badge>
              )
            )
          })}
        </div>
      )}
    </div>
  )
}
