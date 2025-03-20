"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DesignFlow } from "@/components/design-flow"
import { DesignProvider } from "@/context/design-context"
import AppLayout from "@/components/app-layout"
import RetroGrid from "@/components/retro-grid"

export default function CreatePage() {
  return (
    <AppLayout>
      <div className="relative bg-deepSpace text-white">
        <RetroGrid className="absolute inset-0 opacity-5 z-0" />
        
        <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
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
        </div>
      </div>
    </AppLayout>
  )
}
