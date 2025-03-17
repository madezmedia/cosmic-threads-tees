"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import RetroNavbar from "@/components/retro-navbar"
import RetroFooter from "@/components/retro-footer"
import TShirtSelector from "@/components/t-shirt-selector"
import DesignGenerator from "@/components/design-generator"
import DesignPreview from "@/components/design-preview"
import { RetroSteps } from "@/components/retro-steps"
import { useToast } from "@/hooks/use-toast"
import type { TShirt, Design } from "@/lib/types"

export default function CreatePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTShirt, setSelectedTShirt] = useState<TShirt | null>(null)
  const [generatedDesign, setGeneratedDesign] = useState<Design | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleTShirtSelect = (tshirt: TShirt) => {
    setSelectedTShirt(tshirt)
  }

  const handleDesignGenerate = (design: Design) => {
    setGeneratedDesign(design)
  }

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedTShirt) {
      toast({
        title: "Please select a t-shirt",
        description: "You need to select a t-shirt style before proceeding.",
        variant: "destructive",
      })
      return
    }

    if (currentStep === 2 && !generatedDesign) {
      toast({
        title: "Please generate a design",
        description: "You need to generate a design before proceeding.",
        variant: "destructive",
      })
      return
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleFinalize = () => {
    // In a real app, this would save the design and redirect to checkout
    toast({
      title: "Design finalized!",
      description: "Your custom t-shirt design has been saved.",
    })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <RetroNavbar />

      <div className="container mx-auto px-4 py-24 max-w-6xl">
        <div className="relative mb-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-magenta to-teal opacity-70 blur-sm"></div>
          <h1 className="relative text-center text-4xl md:text-5xl font-display font-bold tracking-tight bg-black px-4 py-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal via-chrome to-magenta">
              DESIGN YOUR COSMIC THREADS
            </span>
          </h1>
        </div>

        <RetroSteps currentStep={currentStep} className="mb-12" />

        <div className="relative mb-12">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-magenta/20 to-teal/20 rounded-lg blur-lg opacity-70"></div>
          <div className="relative bg-black border border-chrome/20 rounded-lg p-6">
            {currentStep === 1 && <TShirtSelector onSelect={handleTShirtSelect} selectedTShirt={selectedTShirt} />}

            {currentStep === 2 && (
              <DesignGenerator
                onGenerate={handleDesignGenerate}
                selectedTShirt={selectedTShirt}
                generatedDesign={generatedDesign}
                setIsLoading={setIsLoading}
              />
            )}

            {currentStep === 3 && (
              <DesignPreview tshirt={selectedTShirt!} design={generatedDesign!} onFinalize={handleFinalize} />
            )}
          </div>
        </div>

        <div className="flex justify-between">
          {currentStep > 1 ? (
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              className="border-chrome/30 text-chrome hover:bg-chrome/10 font-mono uppercase tracking-wider"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : (
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
          )}

          {currentStep < 3 ? (
            <Button
              onClick={handleNextStep}
              disabled={isLoading}
              className="bg-magenta hover:bg-magenta/80 text-white border-2 border-magenta/20 font-mono uppercase tracking-wider"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleFinalize}
              className="bg-teal hover:bg-teal/80 text-black font-mono uppercase tracking-wider"
            >
              Finalize Design
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <RetroFooter />
    </div>
  )
}

