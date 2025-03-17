import { CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckoutStepsProps {
  currentStep: number
}

const steps = [
  { id: 1, name: "Information" },
  { id: 2, name: "Shipping" },
  { id: 3, name: "Payment" },
]

export default function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <div className="flex items-center justify-center">
      <ol className="flex w-full max-w-3xl">
        {steps.map((step, index) => (
          <li key={step.id} className="flex-1 relative">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border",
                  step.id < currentStep
                    ? "bg-primary text-primary-foreground border-primary"
                    : step.id === currentStep
                      ? "border-primary text-primary"
                      : "border-gray-300 text-muted-foreground",
                )}
              >
                {step.id < currentStep ? <CheckCircle2 className="h-5 w-5" /> : step.id}
              </div>
              <span className={cn("text-sm mt-2", step.id === currentStep ? "font-medium" : "text-muted-foreground")}>
                {step.name}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={cn(
                  "absolute top-4 left-1/2 w-full h-0.5",
                  step.id < currentStep ? "bg-primary" : "bg-gray-200 dark:bg-gray-700",
                )}
              />
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}

