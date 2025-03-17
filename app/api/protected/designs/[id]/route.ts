import { type NextRequest, NextResponse } from "next/server"
import redis from "@/lib/redis" // Updated to use default import
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const designId = params.id
    const design = await redis.get(`design:${designId}`)

    if (!design) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 })
    }

    return NextResponse.json({ design })
  } catch (error) {
    console.error("Error fetching design:", error)
    return NextResponse.json({ error: "Failed to fetch design" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const designId = params.id
    const data = await request.json()

    await redis.set(`design:${designId}`, JSON.stringify(data))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating design:", error)
    return NextResponse.json({ error: "Failed to update design" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const designId = params.id
    await redis.del(`design:${designId}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting design:", error)
    return NextResponse.json({ error: "Failed to delete design" }, { status: 500 })
  }
}

