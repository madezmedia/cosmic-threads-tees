import { NextResponse } from "next/server"
import { getAuthHeader } from "@/lib/printful-api"

const PRINTFUL_API_URL = "https://api.printful.com"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productId, variantId, imageUrl } = body

    if (!productId || !variantId || !imageUrl) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Create mockup generation task
    const response = await fetch(`${PRINTFUL_API_URL}/mockup-generator/create-task/${productId}`, {
      method: "POST",
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        variant_ids: [variantId],
        format: "jpg",
        files: [
          {
            placement: "default",
            image_url: imageUrl,
            position: {
              area_width: 1800,
              area_height: 1800,
              width: 1800,
              height: 1800,
              top: 0,
              left: 0,
            },
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`Printful API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Get task result
    const taskId = data.result.task_key
    const resultResponse = await fetch(`${PRINTFUL_API_URL}/mockup-generator/task?task_key=${taskId}`, {
      headers: getAuthHeader(),
    })

    if (!resultResponse.ok) {
      throw new Error(`Printful API error: ${resultResponse.status} ${resultResponse.statusText}`)
    }

    const resultData = await resultResponse.json()
    return NextResponse.json({ mockups: resultData.result.mockups })
  } catch (error) {
    console.error("Error generating mockup:", error)
    return NextResponse.json({ error: "Failed to generate mockup" }, { status: 500 })
  }
}

