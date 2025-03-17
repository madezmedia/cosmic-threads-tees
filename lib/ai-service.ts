import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { Design } from "./types"

// Update the generateDesign function to properly use the FAL API
export async function generateDesign(prompt: string, designType: "text" | "image", settings: any): Promise<Design> {
  try {
    // For text designs, return a text-based design
    if (designType === "text") {
      return {
        id: Date.now(),
        type: "text",
        content: prompt,
        prompt,
        settings,
      }
    }

    // For image designs, use the FAL API
    console.log("Generating image with FAL API...")

    // In a real implementation, we would call the FAL API here
    // Since we have FAL_KEY in the environment variables, we can use it
    const imageUrl = await generateImageWithFal(prompt, settings.style)

    return {
      id: Date.now(),
      type: "image",
      content: imageUrl,
      prompt,
      settings: {
        ...settings,
        seed: Math.floor(Math.random() * 1000000),
      },
    }
  } catch (error) {
    console.error("Error generating design:", error)

    // Return a fallback design on error
    return {
      id: Date.now(),
      type: "image",
      content: `/placeholder.svg?height=800&width=1200&text=${encodeURIComponent(prompt.substring(0, 20))}`,
      prompt,
      settings,
    }
  }
}

// Add a new function to call the FAL API
async function generateImageWithFal(prompt: string, style: string): Promise<string> {
  try {
    // Make a request to the FAL API
    const response = await fetch("https://api.fal.ai/v1/text-to-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Key ${process.env.FAL_KEY}`,
      },
      body: JSON.stringify({
        prompt: `${prompt}. Style: ${style}`,
        model_name: "stable-diffusion-xl-v1-0",
        height: 1024,
        width: 1024,
        num_images: 1,
      }),
    })

    if (!response.ok) {
      throw new Error(`FAL API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Extract the image URL from the response
    const imageUrl = data.images[0].url

    if (!imageUrl || !imageUrl.startsWith("http")) {
      throw new Error("Invalid image URL received from FAL API")
    }

    console.log("Generated image URL:", imageUrl)
    return imageUrl
  } catch (error) {
    console.error("Error calling FAL API:", error)
    throw error
  }
}

export async function generateWallArtDesign(prompt: string, style: string, complexity: number): Promise<Design> {
  try {
    // Use the AI SDK to generate a description of the wall art
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Create a detailed description of a wall art piece based on this idea: ${prompt}. Style: ${style}. Complexity: ${complexity}/100. Focus on visual elements, colors, and composition.`,
    })

    // Generate the image using FAL API
    const imageUrl = await generateImageWithFal(prompt, style)

    return {
      id: Date.now(),
      type: "image",
      content: imageUrl,
      prompt,
      settings: {
        style,
        complexity,
        description: text.trim(),
      },
    }
  } catch (error) {
    console.error("Error generating wall art design:", error)
    // Fallback to mock data if API call fails
    return {
      id: Date.now(),
      type: "image",
      content: `/placeholder.svg?height=800&width=1200&text=${encodeURIComponent(prompt.substring(0, 20))}`,
      prompt,
      settings: {
        style,
        complexity,
        description: "A beautiful wall art piece based on your prompt.",
      },
    }
  }
}

