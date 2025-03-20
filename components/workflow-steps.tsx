"use client"

import { CheckCircle2, Circle, ArrowRight } from "lucide-react"

export type WorkflowStep = {
  id: string
  title: string
  description: string
}

interface WorkflowStepsProps {
  steps: WorkflowStep[]
  currentStep: number
  onStepClick?: (stepIndex: number) => void
}

export default function WorkflowSteps({ steps, currentStep, onStepClick }: WorkflowStepsProps) {
  return (
    <div className="mb-12">
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="relative flex-1">
            <div
              className={`flex items-center ${
                index < steps.length - 1 ? "after:content-[''] after:absolute after:top-1/2 after:h-0.5 after:w-full after:translate-y-0" : ""
              } ${
                index < currentStep
                  ? "after:bg-teal"
                  : index === currentStep
                  ? "after:bg-gradient-to-r after:from-teal after:to-chrome/20"
                  : "after:bg-chrome/20"
              }`}
            >
              <button
                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  index < currentStep
                    ? "border-teal bg-teal text-black"
                    : index === currentStep
                    ? "border-teal bg-black text-teal"
                    : "border-chrome/30 bg-black text-chrome/50"
                } ${onStepClick ? "cursor-pointer" : "cursor-default"}`}
                onClick={() => onStepClick?.(index)}
                disabled={!onStepClick}
              >
                {index < currentStep ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <Circle className={`h-6 w-6 ${index === currentStep ? "text-teal" : "text-chrome/50"}`} />
                )}
              </button>
            </div>
            <div
              className={`mt-2 text-center ${
                index === currentStep ? "text-teal font-medium" : index < currentStep ? "text-chrome" : "text-chrome/50"
              }`}
            >
              <p className="text-sm font-mono uppercase tracking-wider">{step.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`text-sm font-mono uppercase tracking-wider ${
              currentStep === 0 ? "text-teal font-medium" : "text-chrome"
            }`}
          >
            Step {currentStep + 1} of {steps.length}
          </div>
          <div className="text-sm font-mono uppercase tracking-wider text-teal font-medium">
            {steps[currentStep].title}
          </div>
        </div>
        <div className="bg-black/30 border border-chrome/20 rounded-lg p-4">
          <p className="text-chrome/70 text-sm">{steps[currentStep].description}</p>
          {currentStep < steps.length - 1 && (
            <div className="flex items-center gap-2 mt-3 text-xs text-teal">
              <span>Next:</span>
              <ArrowRight className="h-3 w-3" />
              <span>{steps[currentStep + 1].title}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
