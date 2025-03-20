"use client"

import { useDesign } from "@/context/design-context"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Sparkles, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DesignPreview() {
  const { state, dispatch } = useDesign()
  const { medium, styles, complexity, placementOption, generatedDesign, isGenerating, generationProgress } = state

  // Function to handle regeneration
  const handleRegenerate = () => {
    // In a real implementation, this would trigger the generation process
    // For now, we'll just set isGenerating to true
    dispatch({ type: "SET_IS_GENERATING", payload: true })
  }

  return (
    <Card className="bg-black border-chrome/20 sticky top-24">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-display font-bold mb-6 text-chrome">DESIGN PREVIEW</h2>

        <div className="aspect-square bg-black/50 border border-chrome/30 rounded-lg flex items-center justify-center overflow-hidden">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center text-center p-8">
              <div className="relative h-24 w-24 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-chrome/20"></div>
                <div
                  className="absolute inset-0 rounded-full border-4 border-t-magenta border-r-transparent border-b-transparent border-l-transparent animate-spin"
                  style={{ animationDuration: "1.5s" }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-mono text-magenta">{Math.round(generationProgress)}%</span>
                </div>
              </div>
              <p className="text-lg font-medium text-chrome">Generating your design...</p>
              <p className="text-sm text-chrome/60 mt-2 font-mono">
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
              <p className="text-lg font-medium text-chrome">Ready to generate</p>
              <p className="text-sm text-chrome/60 mt-2 font-mono">
                Complete your selections and click Generate
              </p>
            </div>
          ) : (
            <div className="text-center p-8">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-chrome/40" />
              <p className="text-lg font-medium text-chrome">No design generated yet</p>
              <p className="text-sm text-chrome/60 mt-2 font-mono">
                Select a product type to get started
              </p>
            </div>
          )}
        </div>

        {generatedDesign && (
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="border-chrome/30 text-chrome hover:bg-chrome/10 font-mono uppercase tracking-wider"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
          </div>
        )}

        {/* Design details section */}
        {(medium || styles.length > 0 || generatedDesign) && (
          <div className="mt-6 bg-black/40 border border-chrome/20 rounded-lg p-4 space-y-3">
            <Label className="text-sm font-mono uppercase tracking-wider text-chrome mb-2 block">
              Design Details
            </Label>
            
            {medium && (
              <div className="flex items-center gap-2">
                <span className="text-chrome text-sm">Product:</span>
                <Badge className="bg-magenta/20 text-magenta">{medium.name}</Badge>
              </div>
            )}
            
            {styles.length > 0 && (
              <div>
                <span className="text-chrome text-sm">Styles:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {styles.map((styleId) => (
                    <Badge key={styleId} className="bg-teal/20 text-teal">
                      {styleId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {placementOption && (
              <div className="flex items-center gap-2">
                <span className="text-chrome text-sm">Placement:</span>
                <Badge className="bg-chrome/20 text-chrome">
                  {placementOption.charAt(0).toUpperCase() + placementOption.slice(1)}
                </Badge>
              </div>
            )}
            
            {complexity > 0 && (
              <div>
                <span className="text-chrome text-sm">Complexity: {complexity}%</span>
                <div className="h-1.5 w-full bg-chrome/20 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-teal rounded-full"
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
