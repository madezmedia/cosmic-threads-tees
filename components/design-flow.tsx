'use client';

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { useDesign } from "@/context/design-context";

// Step components
import { ConceptStep } from "@/components/concept-step";
import { CustomizeStep } from "@/components/customize-step";
import { CheckoutStep } from "@/components/checkout-step";
import DesignPreview from "@/components/design-preview";

export type DesignFlowStep = 'concept' | 'customize' | 'checkout';

interface DesignFlowProps {
  initialStep?: DesignFlowStep;
  className?: string;
}

export function DesignFlow({ initialStep = 'concept', className }: DesignFlowProps) {
  const [activeStep, setActiveStep] = useState<DesignFlowStep>(initialStep);
  const { state } = useDesign();
  
  const steps: DesignFlowStep[] = ['concept', 'customize', 'checkout'];
  const currentIndex = steps.indexOf(activeStep);
  
  const goToNextStep = () => {
    if (currentIndex < steps.length - 1) {
      setActiveStep(steps[currentIndex + 1]);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentIndex > 0) {
      setActiveStep(steps[currentIndex - 1]);
    }
  };

  // Determine if we can proceed to the next step
  const canProceedToCustomize = !!state.generatedDesign;
  const canProceedToCheckout = !!state.medium && !!state.generatedDesign;
  
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 ${className}`}>
      {/* Left panel (8/12 on large screens) */}
      <div className="lg:col-span-8">
        <Tabs value={activeStep} onValueChange={(value) => setActiveStep(value as DesignFlowStep)}>
          <TabsList className="grid grid-cols-3 mb-8 font-mono">
            <TabsTrigger value="concept" className="data-[state=active]:bg-cosmicPurple">
              <span className="mr-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-deepSpace border border-cosmicPurple/50">1</span>
              Concept
            </TabsTrigger>
            <TabsTrigger 
              value="customize" 
              disabled={!canProceedToCustomize}
              className="data-[state=active]:bg-neonTeal data-[state=active]:text-deepSpace"
            >
              <span className="mr-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-deepSpace border border-neonTeal/50">2</span>
              Customize
            </TabsTrigger>
            <TabsTrigger 
              value="checkout" 
              disabled={!canProceedToCheckout}
              className="data-[state=active]:bg-silverChrome data-[state=active]:text-deepSpace"
            >
              <span className="mr-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-deepSpace border border-silverChrome/50">3</span>
              Checkout
            </TabsTrigger>
          </TabsList>
          
          <Card variant="cosmic" className="mb-8 p-6">
            <TabsContent value="concept">
              <ConceptStep onComplete={goToNextStep} />
            </TabsContent>
            
            <TabsContent value="customize">
              <CustomizeStep onComplete={goToNextStep} />
            </TabsContent>
            
            <TabsContent value="checkout">
              <CheckoutStep />
            </TabsContent>
          </Card>
          
          <div className="flex justify-between">
            <Button
              variant="chrome"
              onClick={goToPreviousStep}
              disabled={currentIndex === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            {activeStep === 'concept' && (
              <Button
                variant="cosmic"
                onClick={goToNextStep}
                disabled={!canProceedToCustomize}
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            
            {activeStep === 'customize' && (
              <Button
                variant="neon"
                onClick={goToNextStep}
                disabled={!canProceedToCheckout}
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            
            {activeStep === 'checkout' && (
              <Button
                variant="gradient"
              >
                Complete Order
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </Tabs>
      </div>
      
      {/* Right panel (4/12 on large screens) */}
      <div className="lg:col-span-4">
        <Card variant="glass" className="sticky top-24">
          <div className="p-6">
            <h3 className="text-xl font-display mb-4">Design Preview</h3>
            <DesignPreview />
          </div>
        </Card>
      </div>
    </div>
  );
}
