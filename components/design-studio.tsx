"use client"

import { useState } from "react"
import { DesignProvider } from "@/context/design-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductSelector from "@/components/product-selector"
import StyleSelector from "@/components/style-selector"
import PromptEditor from "@/components/prompt-editor"
import DesignOptions from "@/components/design-options"
import DesignPreview from "@/components/design-preview"
import GenerationControls from "@/components/generation-controls"

export default function DesignStudio() {
  const [activeTab, setActiveTab] = useState("product")

  return (
    <DesignProvider>
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="relative mb-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-magenta to-teal opacity-70 blur-sm"></div>
          <h1 className="relative text-center text-4xl md:text-5xl font-display font-bold tracking-tight bg-black px-4 py-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal via-chrome to-magenta">
              DESIGN YOUR COSMIC THREADS
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left panel (8/12 on large screens) */}
          <div className="lg:col-span-8">
            <Tabs defaultValue="product" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-8 bg-black/50">
                <TabsTrigger value="product" className="data-[state=active]:bg-magenta data-[state=active]:text-white">
                  Product
                </TabsTrigger>
                <TabsTrigger value="style" className="data-[state=active]:bg-magenta data-[state=active]:text-white">
                  Style
                </TabsTrigger>
                <TabsTrigger value="prompt" className="data-[state=active]:bg-magenta data-[state=active]:text-white">
                  Prompt
                </TabsTrigger>
                <TabsTrigger value="options" className="data-[state=active]:bg-magenta data-[state=active]:text-white">
                  Options
                </TabsTrigger>
              </TabsList>

              <div className="relative mb-8">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-magenta/20 to-teal/20 rounded-lg blur-lg opacity-70"></div>
                <div className="relative bg-black border border-chrome/20 rounded-lg p-6">
                  <TabsContent value="product">
                    <ProductSelector />
                  </TabsContent>

                  <TabsContent value="style">
                    <StyleSelector />
                  </TabsContent>

                  <TabsContent value="prompt">
                    <PromptEditor />
                  </TabsContent>

                  <TabsContent value="options">
                    <DesignOptions />
                  </TabsContent>
                </div>
              </div>

              <GenerationControls />
            </Tabs>
          </div>

          {/* Right panel (4/12 on large screens) */}
          <div className="lg:col-span-4">
            <DesignPreview />
          </div>
        </div>
      </div>
    </DesignProvider>
  )
}
