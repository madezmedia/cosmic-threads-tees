import { type NextRequest, NextResponse } from "next/server"
import { handleRequest, fromHeaders } from "@/lib/fal-proxy"

export async function POST(request: NextRequest) {
  return handleRequest({
    id: "nextjs-app-router",
    method: "POST",
    getHeaders: () => fromHeaders(request.headers),
    getHeader: (name) => request.headers.get(name),
    sendHeader: (name, value) => {
      /* Headers are set in sendResponse */
    },
    getRequestBody: async () => await request.text(),
    respondWith: (status, data) => {
      return NextResponse.json(typeof data === "string" ? { error: data } : data, { status })
    },
    sendResponse: async (response) => {
      const body = await response.text()
      const headers = new Headers()
      response.headers.forEach((value, key) => {
        headers.set(key, value)
      })

      return new NextResponse(body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      })
    },
  })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-fal-target-url",
    },
  })
}

