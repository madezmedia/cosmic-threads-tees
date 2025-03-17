import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { prompt, style, complexity } = await request.json()

    // Validate input
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Use the AI SDK to enhance the prompt
    const { text: enhancedPrompt } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Enhance this wall art prompt for an AI image generator: "${prompt}"
      
      Style: ${style || "Any"}
      Complexity level: ${complexity || 50}/100
      
      Make it more detailed, descriptive, and specific. Add artistic elements, color details, 
      and composition suggestions. The result should be a single, cohesive prompt that would 
      create a beautiful wall art piece. Do not include explanations or metadata, just the enhanced prompt.`,
    })

    return NextResponse.json({
      success: true,
      enhancedPrompt: enhancedPrompt.trim(),
    })
  } catch (error) {
    console.error("Error enhancing prompt:", error)
    return NextResponse.json({ error: "Failed to enhance prompt" }, { status: 500 })
  }
}

