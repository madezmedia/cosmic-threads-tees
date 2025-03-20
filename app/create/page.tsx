"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import RetroNavbar from "@/components/retro-navbar"
import RetroFooter from "@/components/retro-footer"
import DesignStudio from "@/components/design-studio"

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <RetroNavbar />
      
      <DesignStudio />
      
      <div className="container mx-auto px-4 pb-12 max-w-7xl">
        <Button
          variant="outline"
          asChild
          className="border-chrome/30 text-chrome hover:bg-chrome/10 font-mono uppercase tracking-wider"
        >
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      
      <RetroFooter />
    </div>
  )
}
