import { NextResponse } from "next/server"
import { fal } from "@/lib/fal-client"
import { createServerSupabaseClient } from "@/lib/supabase/server"

interface GenerationRequest {
  prompt: string
  style: string
  category: string
  tags: string[]
  mediumId: string
}

// Type for fal.ai response
interface FalResponse {
  images: Array<{
    url: string
  }>
  seed: number
}

// Type for design data
interface DesignData {
  id: string
  image_url: string
}

// Type for project data
interface ProjectData {
  id: string
}

export async function POST(request: Request) {
  try {
    // Get the request body
    const body = await request.json()
    const { requests, projectId }: { requests: GenerationRequest[], projectId?: string } = body

    if (!requests || !Array.isArray(requests) || requests.length === 0) {
      return NextResponse.json({ error: "Invalid requests array" }, { status: 400 })
    }

    console.log(`Starting batch generation of ${requests.length} images`)

    // Initialize Supabase client
    const supabase = createServerSupabaseClient()

    // Create a project if projectId is not provided
    let actualProjectId = projectId
    if (!actualProjectId) {
      const { data, error: projectError } = await supabase
        .from("projects")
        .insert({
          name: "Initial Artwork Collection",
          description: "Auto-generated artwork collection for the website",
          user_id: "system", // You might want to use a specific admin user ID here
          is_public: true,
        } as any)
        .select("id")
        .single()

      if (projectError) {
        console.error("Error creating project:", projectError)
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
      }

      const project = data as ProjectData
      if (project) {
        actualProjectId = project.id
        console.log(`Created new project with ID: ${actualProjectId}`)
      } else {
        return NextResponse.json({ error: "Failed to create project: No data returned" }, { status: 500 })
      }
    }

    // Process each request
    const results = []
    for (const req of requests) {
      try {
        console.log(`Generating image for prompt: ${req.prompt}`)

        // Call fal.ai to generate the image
        const result = await fal.subscribe("fal-ai/flux/dev", {
          input: {
            prompt: `${req.prompt}. Style: ${req.style || "realistic"}`,
            seed: Math.floor(Math.random() * 1000000),
            image_size: "landscape_4_3",
            num_images: 1,
          },
          logs: true,
        })

        // Extract the image URL from the response
        const falResponse = result.data as FalResponse
        const imageUrl = falResponse.images[0].url

        // Store the design in Supabase
        const { data, error: designError } = await supabase
          .from("designs")
          .insert({
            project_id: actualProjectId,
            name: req.prompt.substring(0, 50),
            prompt: req.prompt,
            image_url: imageUrl,
            status: "completed",
            metadata: {
              style: req.style,
              category: req.category,
              tags: req.tags,
              mediumId: req.mediumId,
              generationParams: {
                model: "fal-ai/flux/dev",
                seed: falResponse.seed,
                image_size: "landscape_4_3",
              },
            },
          } as any)
          .select("id, image_url")
          .single()

        if (designError) {
          console.error("Error storing design:", designError)
          results.push({
            prompt: req.prompt,
            success: false,
            error: designError.message,
          })
          continue
        }

        const design = data as DesignData
        if (design) {
          console.log(`Successfully generated and stored design with ID: ${design.id}`)
          results.push({
            prompt: req.prompt,
            success: true,
            designId: design.id,
            imageUrl: design.image_url,
          })
        } else {
          console.error("Error: Design was created but no data was returned")
          results.push({
            prompt: req.prompt,
            success: false,
            error: "Design was created but no data was returned",
          })
        }
      } catch (error) {
        console.error(`Error processing request for prompt "${req.prompt}":`, error)
        results.push({
          prompt: req.prompt,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }

      // Add a small delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    return NextResponse.json({
      success: true,
      projectId: actualProjectId,
      results,
      totalRequests: requests.length,
      successfulRequests: results.filter(r => r.success).length,
      failedRequests: results.filter(r => !r.success).length,
    })
  } catch (error) {
    console.error("Error in batch-generate API route:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    )
  }
}
