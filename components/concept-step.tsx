'use client';

import { useState } from "react";
import { useDesign } from "@/context/design-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import StyleSelector from "@/components/style-selector";
import ProductSelector from "@/components/product-selector";
import { Sparkles, Wand2 } from "lucide-react";
import { generateImageWithFalAi } from "@/lib/fal-ai-service";
import { enhancePrompt } from "@/lib/prompt-service";

interface ConceptStepProps {
  onComplete: () => void;
}

export function ConceptStep({ onComplete }: ConceptStepProps) {
  const { state, dispatch } = useDesign();
  const [prompt, setPrompt] = useState(state.prompt || "");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Handle prompt change
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    dispatch({ type: "SET_PROMPT", payload: e.target.value });
  };
  
  // Handle complexity change
  const handleComplexityChange = (value: number[]) => {
    dispatch({ type: "SET_COMPLEXITY", payload: value[0] });
  };
  
  // Handle generate button click
  const handleGenerate = async () => {
    if (!state.medium) {
      alert("Please select a product type first");
      return;
    }
    
    if (!prompt.trim()) {
      alert("Please enter a design prompt");
      return;
    }
    
    setIsGenerating(true);
    dispatch({ type: "SET_IS_GENERATING", payload: true });
    dispatch({ type: "SET_GENERATION_PROGRESS", payload: 0 });
    
    try {
      // First, enhance the prompt
      dispatch({ type: "SET_IS_ENHANCING", payload: true });
      dispatch({ type: "SET_GENERATION_PROGRESS", payload: 10 });
      
      // Call the prompt enhancement service
      const enhancedPrompt = await enhancePrompt(prompt, state.styles.join(", "), state.medium.id);
      dispatch({ type: "SET_ENHANCED_PROMPT", payload: enhancedPrompt });
      dispatch({ type: "SET_GENERATION_PROGRESS", payload: 30 });
      dispatch({ type: "SET_IS_ENHANCING", payload: false });
      
      // Generate the image using fal.ai
      dispatch({ type: "SET_GENERATION_PROGRESS", payload: 40 });
      
      const generationParams = {
        guidance_scale: 7.5 + (state.complexity / 20), // Adjust guidance scale based on complexity
        num_inference_steps: 30 + Math.floor(state.complexity / 5), // More steps for higher complexity
        seed: Math.floor(Math.random() * 1000000),
        image_size: "landscape_4_3",
        style: state.styles.join(", "),
        negative_prompt: "low quality, blurry, distorted, deformed, disfigured, text, watermark",
      };
      
      dispatch({ type: "SET_GENERATION_PROGRESS", payload: 60 });
      
      // Call the fal.ai service
      const result = await generateImageWithFalAi(enhancedPrompt, generationParams);
      dispatch({ type: "SET_GENERATION_PROGRESS", payload: 90 });
      
      // Create the design object
      const design = {
        id: "design-" + Date.now(),
        content: result.imageUrl,
        prompt: prompt,
        enhancedPrompt: enhancedPrompt,
        style: state.styles.join(", "),
        medium: state.medium?.id || "",
        seed: result.seed,
        metadata: result.metadata,
      };
      
      dispatch({ type: "SET_GENERATED_DESIGN", payload: design });
      dispatch({ type: "SET_GENERATION_PROGRESS", payload: 100 });
      setIsGenerating(false);
      dispatch({ type: "SET_IS_GENERATING", payload: false });
      
      // Move to next step
      onComplete();
    } catch (error) {
      console.error("Error generating design:", error);
      setIsGenerating(false);
      dispatch({ type: "SET_IS_GENERATING", payload: false });
      dispatch({ type: "SET_GENERATION_PROGRESS", payload: 0 });
      alert("Failed to generate design. Please try again.");
    }
  };
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-display tracking-tight">Create Your Concept</h2>
      <p className="text-muted-foreground">
        Select a product, choose your style, and describe your design idea.
      </p>
      
      {/* Product Selection */}
      <div className="space-y-4">
        <Label className="text-lg font-mono uppercase tracking-wider">1. Select Product</Label>
        <ProductSelector />
      </div>
      
      {/* Style Selection */}
      <div className="space-y-4">
        <Label className="text-lg font-mono uppercase tracking-wider">2. Choose Style</Label>
        <StyleSelector />
      </div>
      
      {/* Prompt Input */}
      <div className="space-y-4">
        <Label htmlFor="prompt" className="text-lg font-mono uppercase tracking-wider">
          3. Describe Your Design
        </Label>
        <Textarea
          id="prompt"
          placeholder="Describe your design idea in detail... (e.g., A cosmic astronaut floating through a nebula with retro planets and stars)"
          className="min-h-[120px] font-sans border-cosmicPurple/30 bg-deepSpace/50 focus:border-magentaGlow"
          value={prompt}
          onChange={handlePromptChange}
          disabled={isGenerating}
        />
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Wand2 className="h-4 w-4" />
          <span>Be specific about colors, mood, and elements you want to include</span>
        </div>
      </div>
      
      {/* Complexity Slider */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-lg font-mono uppercase tracking-wider">4. Design Complexity</Label>
          <span className="text-sm font-mono">{state.complexity}%</span>
        </div>
        <Slider
          defaultValue={[state.complexity]}
          max={100}
          step={5}
          onValueChange={handleComplexityChange}
          disabled={isGenerating}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Simple</span>
          <span>Complex</span>
        </div>
      </div>
      
      {/* Generate Button */}
      <div className="pt-4">
        <Button
          variant="cosmic"
          size="lg"
          className="w-full"
          onClick={handleGenerate}
          disabled={isGenerating || !state.medium || !prompt.trim()}
        >
          {isGenerating ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Design
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
