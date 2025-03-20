"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, ShoppingCart } from "lucide-react"
import Link from "next/link"
import RetroNavbar from "@/components/retro-navbar"
import RetroFooter from "@/components/retro-footer"
import { useToast } from "@/hooks/use-toast"
import { type Design } from "@/lib/types"
import MediumSelector, { type Medium } from "@/components/medium-selector"
import StyleGuideSelector, { type Style } from "@/components/style-guide-selector"
import EnhancedDesignGenerator from "@/components/enhanced-design-generator"
import ProductCustomizer from "@/components/product-customizer"
import WorkflowSteps, { type WorkflowStep } from "@/components/workflow-steps"

export default function CreatePage() {
  // Workflow state
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedMedium, setSelectedMedium] = useState<Medium | null>(null)
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [complexity, setComplexity] = useState(70)
  const [generatedDesign, setGeneratedDesign] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { toast } = useToast()

  // Define workflow steps
  const workflowSteps: WorkflowStep[] = [
    {
      id: "medium",
      title: "Select Medium",
      description: "Choose the product type you want to customize with your AI-generated design.",
    },
    {
      id: "style",
      title: "Choose Style",
      description: "Select one or more style influences to guide the AI in generating your design.",
    },
    {
      id: "generate",
      title: "Generate Design",
      description: "Describe your design idea and let our AI bring it to life with your chosen styles.",
    },
    {
      id: "customize",
      title: "Customize Product",
      description: "Fine-tune your product options and design placement before adding to cart.",
    },
  ]

  // Style data for the style selector
  const styles: Style[] = [
    {
      id: "retro-futurism",
      name: "Retro Futurism",
      description: "Blending vintage aesthetics with futuristic elements",
      category: "trending",
      previewImage: "/placeholder.svg?height=300&width=300&text=Retro+Futurism",
      tags: ["nostalgic", "futuristic", "vibrant"],
    },
    {
      id: "synthwave",
      name: "Synthwave",
      description: "80s-inspired neon aesthetics with digital landscapes",
      category: "trending",
      previewImage: "/placeholder.svg?height=300&width=300&text=Synthwave",
      tags: ["neon", "grid", "sunset"],
    },
    {
      id: "minimalist-geometric",
      name: "Minimalist Geometric",
      description: "Clean, simple geometric shapes with limited color palette",
      category: "trending",
      previewImage: "/placeholder.svg?height=300&width=300&text=Minimalist",
      tags: ["clean", "shapes", "simple"],
    },
    // More styles defined in the StyleGuideSelector component
  ]

  // Event handlers
  const handleMediumSelect = (medium: Medium) => {
    setSelectedMedium(medium)
  }

  const handleStyleToggle = (styleId: string) => {
    setSelectedStyles((prev) =>
      prev.includes(styleId) ? prev.filter((id) => id !== styleId) : [...prev, styleId]
    )
  }

  const handleDesignGenerate = (design: any) => {
    setGeneratedDesign(design)
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    
    // Simulate API call to add to cart
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    toast({
      title: "Added to cart!",
      description: "Your custom design has been added to your cart.",
    })
    
    setIsAddingToCart(false)
  }

  const handleNextStep = () => {
    // Validation for each step
    if (currentStep === 0 && !selectedMedium) {
      toast({
        title: "Please select a medium",
        description: "You need to select a product type before proceeding.",
        variant: "destructive",
      })
      return
    }

    if (currentStep === 1 && selectedStyles.length === 0) {
      toast({
        title: "Please select at least one style",
        description: "You need to select at least one style influence before proceeding.",
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

    if (currentStep < workflowSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleStepClick = (stepIndex: number) => {
    // Only allow clicking on completed steps or the next available step
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
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

        <WorkflowSteps steps={workflowSteps} currentStep={currentStep} onStepClick={handleStepClick} />

        <div className="relative mb-12">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-magenta/20 to-teal/20 rounded-lg blur-lg opacity-70"></div>
          <div className="relative bg-black border border-chrome/20 rounded-lg p-6">
            {currentStep === 0 && (
              <MediumSelector onSelect={handleMediumSelect} selectedMedium={selectedMedium} />
            )}

            {currentStep === 1 && (
              <StyleGuideSelector
                selectedStyles={selectedStyles}
                onToggleStyle={handleStyleToggle}
                complexity={complexity}
                onSetComplexity={setComplexity}
                selectedMedium={selectedMedium}
              />
            )}

            {currentStep === 2 && (
              <EnhancedDesignGenerator
                selectedMedium={selectedMedium}
                selectedStyles={selectedStyles}
                complexity={complexity}
                onGenerate={handleDesignGenerate}
                generatedDesign={generatedDesign}
                styles={styles}
              />
            )}

            {currentStep === 3 && selectedMedium && (
              <ProductCustomizer
                selectedMedium={selectedMedium}
                generatedDesign={generatedDesign}
                onAddToCart={handleAddToCart}
                isAddingToCart={isAddingToCart}
              />
            )}
          </div>
        </div>

        <div className="flex justify-between">
          {currentStep > 0 ? (
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

          {currentStep < workflowSteps.length - 1 ? (
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
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="bg-teal hover:bg-teal/80 text-black font-mono uppercase tracking-wider"
            >
              Add to Cart
              <ShoppingCart className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <RetroFooter />
    </div>
  )
}
