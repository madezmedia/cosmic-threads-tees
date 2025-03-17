"use client"

import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Instagram, Share2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function SocialShare() {
  const handleShare = (platform: string) => {
    // In a real app, this would implement actual sharing functionality
    alert(`Sharing to ${platform}...`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Share2 className="h-4 w-4" />
          <span className="sr-only">Share design</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleShare("Facebook")}>
          <Facebook className="mr-2 h-4 w-4" />
          <span>Facebook</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("Twitter")}>
          <Twitter className="mr-2 h-4 w-4" />
          <span>Twitter</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("Instagram")}>
          <Instagram className="mr-2 h-4 w-4" />
          <span>Instagram</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

