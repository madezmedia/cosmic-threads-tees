import { type NextRequest, NextResponse } from "next/server"
import redis from "@/lib/redis" // Updated to use default import
import { v4 as uuidv4 } from "uuid"

export async function GET() {
  try {
    // Get all design keys
    const keys = await redis.keys("design:*")

    // If no designs, return empty array
    if (!keys || keys.length === 0) {
      return NextResponse.json({ designs: [] })
    }

    // Get all designs
    const designs = await Promise.all(
      keys.map(async (key) => {
        const design = await redis.get(key)
        return { id: key.replace("design:", ""), ...JSON.parse(design as string) }
      }),
    )

    return NextResponse.json({ designs })
  } catch (error) {
    console.error("Error fetching designs:", error)
    return NextResponse.json({ error: "Failed to fetch designs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const id = uuidv4()

    await redis.set(`design:${id}`, JSON.stringify({ ...data, id, createdAt: new Date().toISOString() }))

    return NextResponse.json({ id, success: true })
  } catch (error) {
    console.error("Error creating design:", error)
    return NextResponse.json({ error: "Failed to create design" }, { status: 500 })
  }
}

