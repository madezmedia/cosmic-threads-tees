import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    // Parse query parameters
    const url = new URL(request.url)
    const projectId = url.searchParams.get("projectId")
    const style = url.searchParams.get("style")
    const medium = url.searchParams.get("medium")
    const limit = parseInt(url.searchParams.get("limit") || "20", 10)
    const offset = parseInt(url.searchParams.get("offset") || "0", 10)

    // Initialize Supabase client
    const supabase = createServerSupabaseClient()

    // Build the query
    let query = supabase
      .from("designs")
      .select(`
        id,
        name,
        prompt,
        image_url,
        status,
        metadata,
        created_at,
        project_id,
        projects(name)
      `)
      .eq("status" as any, "completed")
      .order("created_at", { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1)

    // Apply filters if provided
    if (projectId) {
      query = query.eq("project_id" as any, projectId)
    }

    if (style) {
      query = query.filter("metadata->category" as any, "eq", style as any)
    }

    if (medium) {
      query = query.filter("metadata->mediumId" as any, "eq", medium as any)
    }

    // Execute the query
    const { data, error, count } = await query

    if (error) {
      console.error("Error fetching gallery images:", error)
      return NextResponse.json({ error: "Failed to fetch gallery images" }, { status: 500 })
    }

    // Format the response
    const formattedData = data ? data.map((design: any) => ({
      id: design.id,
      name: design.name,
      prompt: design.prompt,
      imageUrl: design.image_url,
      projectId: design.project_id,
      projectName: design.projects?.name,
      style: design.metadata?.category,
      styleName: design.metadata?.style,
      medium: design.metadata?.mediumId,
      tags: design.metadata?.tags || [],
      createdAt: design.created_at,
    })) : []

    // Get available styles and mediums for filtering
    const { data: styles, error: stylesError } = await supabase
      .from("designs")
      .select("metadata->category, metadata->style")
      .eq("status" as any, "completed")
      .is("metadata->category" as any, "not.null" as any)
      .limit(100)

    const { data: mediums, error: mediumsError } = await supabase
      .from("designs")
      .select("metadata->mediumId")
      .eq("status" as any, "completed")
      .is("metadata->mediumId" as any, "not.null" as any)
      .limit(100)

    // Extract unique styles and mediums
    const uniqueStyles = styles && !stylesError
      ? Array.from(new Set(styles.map((s: any) => s.category))).map((category: any) => {
          const style = styles.find((s: any) => s.category === category)
          return {
            id: category,
            name: style?.style || category,
          }
        })
      : []

    const uniqueMediums = mediums && !mediumsError
      ? Array.from(new Set(mediums.map((m: any) => m.mediumId))).map((id: any) => ({
          id,
          name: id.charAt(0).toUpperCase() + id.slice(1),
        }))
      : []

    return NextResponse.json({
      designs: formattedData,
      filters: {
        styles: uniqueStyles,
        mediums: uniqueMediums,
      },
      pagination: {
        total: count || formattedData.length,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit,
      },
    })
  } catch (error) {
    console.error("Error in gallery API route:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    )
  }
}
