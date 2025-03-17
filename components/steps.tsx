import React from "react"
import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

interface StepsProps {
  currentStep: number
  className?: string
  children: React.ReactNode
}

export function Steps({ currentStep, className, children }: StepsProps) {
  // Count the number of steps
  const steps = React.Children.toArray(children)
  const totalSteps = steps.length

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 text-center font-medium",
                  index + 1 < currentStep
                    ? "border-primary bg-primary text-primary-foreground"
                    : index + 1 === currentStep
                      ? "border-primary text-primary"
                      : "border-gray-300 text-gray-500 dark:border-gray-600",
                )}
              >
                {index + 1 < currentStep ? <CheckIcon className="h-5 w-5" /> : index + 1}
              </div>
              <div
                className={cn(
                  "mt-2 text-sm font-medium",
                  index + 1 === currentStep ? "text-primary" : "text-gray-500 dark:text-gray-400",
                )}
              >
                {step}
              </div>
            </div>

            {/* Connector line */}
            {index < totalSteps - 1 && (
              <div
                className={cn(
                  "h-0.5 w-full max-w-[8rem] flex-1",
                  index + 1 < currentStep ? "bg-primary" : "bg-gray-200 dark:bg-gray-700",
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

interface StepProps {
  title: string
}

export function Step({ title }: StepProps) {
  return <div>{title}</div>
}

