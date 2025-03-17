import React from "react"
import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

interface RetroStepsProps {
  currentStep: number
  className?: string
}

const steps = [
  { id: 1, name: "SELECT T-SHIRT" },
  { id: 2, name: "GENERATE DESIGN" },
  { id: 3, name: "PREVIEW & CUSTOMIZE" },
]

export function RetroSteps({ currentStep, className }: RetroStepsProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center text-center font-mono relative",
                  step.id < currentStep ? "text-teal" : step.id === currentStep ? "text-magenta" : "text-chrome/40",
                )}
              >
                <div className="absolute inset-0 border-2 border-current transform rotate-45"></div>
                {step.id < currentStep ? (
                  <CheckIcon className="h-5 w-5" />
                ) : (
                  <span className="font-bold">{step.id}</span>
                )}
              </div>
              <div
                className={cn(
                  "mt-2 text-sm font-mono uppercase tracking-wider",
                  step.id === currentStep ? "text-magenta" : step.id < currentStep ? "text-teal" : "text-chrome/40",
                )}
              >
                {step.name}
              </div>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn("h-px w-full max-w-[8rem] flex-1", index + 1 < currentStep ? "bg-teal" : "bg-chrome/20")}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

