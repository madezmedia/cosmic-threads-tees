"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PromptTemplatesProps {
  onSelect: (prompt: string) => void
}

const templates = {
  retro: [
    "Retro-futuristic space station with planets and stars in neon colors",
    "Atomic age pattern with boomerang shapes and starburst designs",
    "Mid-century modern rocket ship with geometric patterns",
  ],
  synthwave: [
    "Synthwave sunset with grid lines and neon palm trees",
    "Digital landscape with neon mountains and retro sun",
    "Cyberpunk city skyline with neon lights and flying cars",
  ],
  scifi: [
    "Retrofuturistic robot with chrome details and glowing elements",
    "Vintage sci-fi book cover style alien landscape",
    "Space age control panel with buttons and dials",
  ],
  typography: [
    "Bold typography saying 'COSMIC VOYAGER' with space background",
    "Retro-futuristic 'ATOMIC AGE' text with starburst effects",
    "Neon sign style 'TOMORROW TODAY' with electric glow",
  ],
}

export default function PromptTemplates({ onSelect }: PromptTemplatesProps) {
  return (
    <Card className="bg-black border-chrome/20">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-chrome text-xl">PROMPT TEMPLATES</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="retro">
          <TabsList className="grid grid-cols-4 mb-4 bg-black/50">
            <TabsTrigger value="retro" className="data-[state=active]:bg-teal data-[state=active]:text-black">
              Retro
            </TabsTrigger>
            <TabsTrigger value="synthwave" className="data-[state=active]:bg-teal data-[state=active]:text-black">
              Synthwave
            </TabsTrigger>
            <TabsTrigger value="scifi" className="data-[state=active]:bg-teal data-[state=active]:text-black">
              Sci-Fi
            </TabsTrigger>
            <TabsTrigger value="typography" className="data-[state=active]:bg-teal data-[state=active]:text-black">
              Typography
            </TabsTrigger>
          </TabsList>

          {Object.entries(templates).map(([category, prompts]) => (
            <TabsContent key={category} value={category} className="space-y-2">
              {prompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto py-3 text-chrome/80 hover:text-chrome hover:bg-chrome/5 font-mono"
                  onClick={() => onSelect(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

