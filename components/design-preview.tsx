"use client"

import { useDesign } from "@/context/design-context"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Sparkles, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateImageWithFalAi } from "@/lib/fal-ai-service"
import { enhancePrompt } from "@/lib/prompt-service"

export default function DesignPreview() {
  const { state, dispatch } = useDesign()
  const { medium, styles, complexity, placementOption, generatedDesign, isGenerating, generationProgress } = state

  // Function to handle regeneration
  const handleRegenerate = async () => {
    if (!state.prompt || !state.medium) {
      return;
    }
    
    dispatch({ type: "SET_IS_GENERATING", payload: true });
    dispatch({ type: "SET_GENERATION_PROGRESS", payload: 0 });
    
    try {
      // First, use the existing enhanced prompt or generate a new one
      const enhancedPrompt = state.enhancedPrompt || 
        await enhancePrompt(state.prompt, state.styles.join(", "), state.medium.id);
      
      dispatch({ type: "SET_ENHANCED_PROMPT", payload: enhancedPrompt });
      dispatch({ type: "SET_GENERATION_PROGRESS", payload: 30 });
      
      // Generate the image using fal.ai with a new seed
      const generationParams = {
        guidance_scale: 7.5 + (state.complexity / 20),
        num_inference_steps: 30 + Math.floor(state.complexity / 5),
        seed: Math.floor(Math.random() * 1000000), // New random seed for variation
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
        prompt: state.prompt,
        enhancedPrompt: enhancedPrompt,
        style: state.styles.join(", "),
        medium: state.medium?.id || "",
        seed: result.seed,
        metadata: result.metadata,
      };
      
      dispatch({ type: "SET_GENERATED_DESIGN", payload: design });
      dispatch({ type: "SET_GENERATION_PROGRESS", payload: 100 });
      dispatch({ type: "SET_IS_GENERATING", payload: false });
    } catch (error) {
      console.error("Error regenerating design:", error);
      dispatch({ type: "SET_IS_GENERATING", payload: false });
      dispatch({ type: "SET_GENERATION_PROGRESS", payload: 0 });
      alert("Failed to regenerate design. Please try again.");
    }
  }

  return (
    <Card variant="glass" className="sticky top-24">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-display mb-6 text-gradient bg-gradient-to-r from-cosmicPurple to-magentaGlow bg-clip-text text-transparent">Design Preview</h2>

        <div className="aspect-square bg-deepSpace/50 border border-silverChrome/30 rounded-lg flex items-center justify-center overflow-hidden">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center text-center p-8">
              <div className="relative h-24 w-24 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-silverChrome/20"></div>
                <div
                  className="absolute inset-0 rounded-full border-4 border-t-magentaGlow border-r-transparent border-b-transparent border-l-transparent animate-spin"
                  style={{ animationDuration: "1.5s" }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-mono text-magentaGlow">{Math.round(generationProgress)}%</span>
                </div>
              </div>
              <p className="text-lg font-medium text-silverChrome">Generating your design...</p>
              <p className="text-sm text-silverChrome/60 mt-2 font-mono">
                Our AI is creating something cosmic just for you
              </p>
            </div>
          ) : generatedDesign ? (
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <img
                src={generatedDesign.content}
                alt="Generated design"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : medium ? (
            <div className="text-center p-8">
              <img
                src={medium.previewImage}
                alt={medium.name}
                className="h-32 w-32 mx-auto mb-4 object-contain opacity-30"
              />
              <p className="text-lg font-medium text-silverChrome">Ready to generate</p>
              <p className="text-sm text-silverChrome/60 mt-2 font-mono">
                Complete your selections and click Generate
              </p>
            </div>
          ) : (
            <div className="text-center p-8">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-silverChrome/40" />
              <p className="text-lg font-medium text-silverChrome">No design generated yet</p>
              <p className="text-sm text-silverChrome/60 mt-2 font-mono">
                Select a product type to get started
              </p>
            </div>
          )}
        </div>

        {generatedDesign && (
          <div className="mt-4 flex justify-end">
            <Button
              variant="chrome"
              size="sm"
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="font-mono uppercase tracking-wider"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
          </div>
        )}

        {/* Design details section */}
        {(medium || styles.length > 0 || generatedDesign) && (
          <div className="mt-6 bg-deepSpace/40 border border-silverChrome/20 rounded-lg p-4 space-y-3">
            <Label variant="chrome" className="text-sm font-mono uppercase tracking-wider mb-2 block">
              Design Details
            </Label>
            
            {medium && (
              <div className="flex items-center gap-2">
                <span className="text-silverChrome text-sm">Product:</span>
                <Badge variant="cosmic">{medium.name}</Badge>
              </div>
            )}
            
            {styles.length > 0 && (
              <div>
                <span className="text-silverChrome text-sm">Styles:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {styles.map((styleId) => (
                    <Badge key={styleId} variant="neon">
                      {styleId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {placementOption && (
              <div className="flex items-center gap-2">
                <span className="text-silverChrome text-sm">Placement:</span>
                <Badge variant="chrome">
                  {placementOption.charAt(0).toUpperCase() + placementOption.slice(1)}
                </Badge>
              </div>
            )}
            
            {complexity > 0 && (
              <div>
                <span className="text-silverChrome text-sm">Complexity: {complexity}%</span>
                <div className="h-1.5 w-full bg-silverChrome/20 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-gradient-to-r from-cosmicPurple to-neonTeal rounded-full"
                    style={{ width: `${complexity}%`, transition: "width 0.3s ease" }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
