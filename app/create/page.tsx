"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import RetroNavbar from "@/components/retro-navbar"
import RetroFooter from "@/components/retro-footer"
import { DesignFlow } from "@/components/design-flow"
import { DesignProvider } from "@/context/design-context"

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-deepSpace text-white">
      <RetroNavbar />
      
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-display mb-4 text-gradient bg-gradient-to-r from-cosmicPurple to-magentaGlow bg-clip-text text-transparent">
            Create Your Cosmic Design
          </h1>
          <p className="text-silverChrome max-w-3xl">
            Follow our three-step process to create a unique, AI-generated design for your product.
            Start by selecting a product and describing your concept, then customize your design, and finally complete your order.
          </p>
        </div>
        
        <DesignProvider>
          <DesignFlow className="mb-12" />
        </DesignProvider>
        
        <Button
          variant="chrome"
          asChild
          className="font-mono uppercase tracking-wider"
        >
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </main>
      
      <RetroFooter />
    </div>
  )
}
