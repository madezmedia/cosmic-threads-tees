import { NextResponse } from "next/server"
import { fal } from "@/lib/fal-client"

export async function POST(request: Request) {
  try {
    const { prompt, style } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    console.log("Calling FAL API with prompt:", prompt, "and style:", style)

    try {
      // Use the FAL client to generate the image
      const result = await fal.subscribe("fal-ai/flux/dev", {
        input: {
          prompt: `${prompt}. Style: ${style || "realistic"}`,
          seed: Math.floor(Math.random() * 1000000),
          image_size: "landscape_4_3",
          num_images: 1,
        },
        logs: true,
      })

      console.log("FAL API response:", result.data)

      // Extract the image URL from the response
      const imageUrl = result.data.images[0].url

      return NextResponse.json({ imageUrl })
    } catch (falError) {
      console.error("FAL API error:", falError)

      // Return a placeholder image instead of failing
      return NextResponse.json({
        imageUrl: `/placeholder.svg?height=1024&width=1024&text=${encodeURIComponent(prompt.substring(0, 20))}`,
        warning: "Failed to generate image with FAL API",
      })
    }
  } catch (error) {
    console.error("Error in generate-image API route:", error)

    // Return a placeholder image as a fallback
    return NextResponse.json(
      {
        imageUrl: `/placeholder.svg?height=1024&width=1024&text=Error+Generating+Image`,
        error: "Failed to generate image",
      },
      { status: 200 },
    ) // Return 200 with fallback image instead of 500
  }
}

