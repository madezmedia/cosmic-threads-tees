// Configure the FAL client
// In a real app, you would use environment variables
// fal.config({
//   credentials: process.env.FAL_KEY
// });

export interface IdeogramGenerationOptions {
  prompt: string
  aspectRatio?: string
  style?: "auto" | "general" | "realistic" | "design" | "render_3D" | "anime"
  expandPrompt?: boolean
  seed?: number
  negativePrompt?: string
}

export interface GeneratedImage {
  url: string
}

export interface GenerationResult {
  images: GeneratedImage[]
  seed: number
}

// For demo purposes, we'll simulate the API response
const mockGenerateImage = async (options: IdeogramGenerationOptions): Promise<GenerationResult> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 3000))

  // Return a mock result
  return {
    images: [
      {
        url: "/placeholder.svg?height=1024&width=1024&text=Generated+Wall+Art",
      },
    ],
    seed: options.seed || Math.floor(Math.random() * 1000000),
  }
}

export const generateImage = async (options: IdeogramGenerationOptions): Promise<GenerationResult> => {
  try {
    // In a real implementation, we would call the Ideogram API
    // const result = await fal.subscribe("fal-ai/ideogram/v2", {
    //   input: {
    //     prompt: options.prompt,
    //     aspect_ratio: options.aspectRatio || "1:1",
    //     expand_prompt: options.expandPrompt !== undefined ? options.expandPrompt : true,
    //     style: options.style || "auto",
    //     negative_prompt: options.negativePrompt || "",
    //     seed: options.seed
    //   },
    //   logs: true,
    //   onQueueUpdate: (update) => {
    //     if (update.status === "IN_PROGRESS") {
    //       update.logs.map((log) => log.message).forEach(console.log);
    //     }
    //   },
    // });

    // return {
    //   images: result.data.images,
    //   seed: result.data.seed
    // };

    // For demo purposes, use the mock implementation
    return await mockGenerateImage(options)
  } catch (error) {
    console.error("Error generating image with Ideogram:", error)
    throw error
  }
}

export const getAspectRatioFromStyle = (style: string): string => {
  // Map common wall art styles to appropriate aspect ratios
  const styleAspectRatioMap: Record<string, string> = {
    landscape: "16:9",
    portrait: "9:16",
    square: "1:1",
    panoramic: "3:1",
    wide: "16:9",
    tall: "9:16",
  }

  return styleAspectRatioMap[style.toLowerCase()] || "1:1"
}

export const mapStyleToIdeogram = (
  style: string,
): "auto" | "general" | "realistic" | "design" | "render_3D" | "anime" => {
  // Map our application styles to Ideogram styles
  const styleMap: Record<string, "auto" | "general" | "realistic" | "design" | "render_3D" | "anime"> = {
    abstract: "design",
    minimalist: "design",
    impressionist: "general",
    surrealist: "general",
    geometric: "design",
    watercolor: "general",
    photorealistic: "realistic",
    "pop art": "design",
    cubist: "general",
    "art deco": "design",
    "3d render": "render_3D",
    anime: "anime",
  }

  return styleMap[style.toLowerCase()] || "auto"
}

