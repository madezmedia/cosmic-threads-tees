'use client';

import { useState } from "react";
import { useDesign } from "@/context/design-context";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Sparkles, RefreshCw, Check, Palette, Shirt, Maximize2 } from "lucide-react";

interface CustomizeStepProps {
  onComplete: () => void;
}

export function CustomizeStep({ onComplete }: CustomizeStepProps) {
  const { state, dispatch } = useDesign();
  const [activeTab, setActiveTab] = useState<string>("placement");
  
  // Handle placement option change
  const handlePlacementChange = (value: string) => {
    dispatch({ type: "SET_PLACEMENT_OPTION", payload: value });
  };
  
  // Handle color scheme change
  const handleColorSchemeChange = (value: string) => {
    dispatch({ type: "SET_COLOR_SCHEME", payload: value });
  };
  
  // Handle size change
  const handleSizeChange = (value: number[]) => {
    dispatch({ type: "SET_SIZE", payload: value[0] });
  };
  
  // Handle regenerate button click
  const handleRegenerate = async () => {
    dispatch({ type: "SET_IS_GENERATING", payload: true });
    
    try {
      // Simulate API call with progress updates
      for (let i = 0; i <= 100; i += 10) {
        dispatch({ type: "SET_GENERATION_PROGRESS", payload: i });
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      // Simulate a regenerated design
      const mockDesign = {
        id: "design-" + Date.now(),
        content: "/placeholder.jpg", // Replace with actual generated image
        prompt: state.prompt || "",
        style: state.styles.join(", "),
        medium: state.medium?.id || "",
      };
      
      dispatch({ type: "SET_GENERATED_DESIGN", payload: mockDesign });
      dispatch({ type: "SET_IS_GENERATING", payload: false });
    } catch (error) {
      console.error("Error regenerating design:", error);
      dispatch({ type: "SET_IS_GENERATING", payload: false });
      alert("Failed to regenerate design. Please try again.");
    }
  };
  
  // Placement options based on medium type
  const placementOptions = state.medium?.id === "tshirt" 
    ? [
        { value: "center", label: "Center", icon: <Maximize2 className="h-5 w-5" /> },
        { value: "full", label: "Full Print", icon: <Shirt className="h-5 w-5" /> },
        { value: "pocket", label: "Pocket Area", icon: <Palette className="h-5 w-5" /> },
      ]
    : [
        { value: "center", label: "Center", icon: <Maximize2 className="h-5 w-5" /> },
        { value: "full", label: "Full Coverage", icon: <Maximize2 className="h-5 w-5" /> },
        { value: "pattern", label: "Pattern", icon: <Palette className="h-5 w-5" /> },
      ];
  
  // Color scheme options
  const colorSchemeOptions = [
    { value: "original", label: "Original" },
    { value: "vibrant", label: "Vibrant" },
    { value: "muted", label: "Muted" },
    { value: "monochrome", label: "Monochrome" },
    { value: "dark", label: "Dark" },
    { value: "light", label: "Light" },
  ];
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-display tracking-tight">Customize Your Design</h2>
      <p className="text-muted-foreground">
        Fine-tune your design with placement, color, and size options.
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 font-mono">
          <TabsTrigger value="placement" className="data-[state=active]:bg-neonTeal data-[state=active]:text-deepSpace">
            Placement
          </TabsTrigger>
          <TabsTrigger value="color" className="data-[state=active]:bg-neonTeal data-[state=active]:text-deepSpace">
            Color
          </TabsTrigger>
          <TabsTrigger value="size" className="data-[state=active]:bg-neonTeal data-[state=active]:text-deepSpace">
            Size
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="placement" className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {placementOptions.map((option) => (
              <Card 
                key={option.value}
                variant={state.placementOption === option.value ? "neon" : "glass"}
                className="cursor-pointer transition-all hover:border-neonTeal/50"
                onClick={() => handlePlacementChange(option.value)}
              >
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="h-12 w-12 rounded-full bg-deepSpace/50 flex items-center justify-center mb-3 border border-neonTeal/30">
                    {option.icon}
                  </div>
                  <h3 className="font-mono uppercase tracking-wider text-sm">{option.label}</h3>
                  {state.placementOption === option.value && (
                    <Check className="h-4 w-4 text-neonTeal absolute top-2 right-2" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="color" className="space-y-6">
          <RadioGroup 
            value={state.colorScheme || "original"} 
            onValueChange={handleColorSchemeChange}
            className="grid grid-cols-3 gap-4"
          >
            {colorSchemeOptions.map((option) => (
              <div key={option.value} className="flex items-start space-x-2">
                <RadioGroupItem 
                  value={option.value} 
                  id={`color-${option.value}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`color-${option.value}`}
                  className="flex flex-col items-center justify-center p-4 border rounded-md cursor-pointer peer-data-[state=checked]:border-neonTeal peer-data-[state=checked]:bg-neonTeal/10 border-silverChrome/20 bg-deepSpace/40 hover:bg-deepSpace/60 transition-all"
                >
                  <div className={`h-12 w-12 rounded-full mb-3 border ${getColorPreviewClass(option.value)}`}></div>
                  <span className="font-mono uppercase tracking-wider text-sm">{option.label}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </TabsContent>
        
        <TabsContent value="size" className="space-y-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-mono uppercase tracking-wider">Design Size</Label>
              <span className="text-sm font-mono">{state.size}%</span>
            </div>
            <Slider
              defaultValue={[state.size]}
              max={100}
              step={5}
              onValueChange={handleSizeChange}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Small</span>
              <span>Large</span>
            </div>
            
            <div className="bg-deepSpace/40 rounded-md p-4 border border-silverChrome/20 mt-6">
              <p className="text-sm text-muted-foreground">
                Adjust the size of your design relative to the product. For t-shirts, we recommend 70-90% for best results.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex gap-4 pt-4">
        <Button
          variant="chrome"
          className="flex-1"
          onClick={handleRegenerate}
          disabled={state.isGenerating}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Regenerate
        </Button>
        
        <Button
          variant="neon"
          className="flex-1"
          onClick={onComplete}
        >
          <Check className="mr-2 h-4 w-4" />
          Apply Changes
        </Button>
      </div>
    </div>
  );
}

// Helper function to get color preview class
function getColorPreviewClass(colorScheme: string): string {
  switch (colorScheme) {
    case "vibrant":
      return "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500";
    case "muted":
      return "bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600";
    case "monochrome":
      return "bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900";
    case "dark":
      return "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700";
    case "light":
      return "bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300";
    case "original":
    default:
      return "bg-gradient-to-r from-cosmicPurple via-magentaGlow to-neonTeal";
  }
}
