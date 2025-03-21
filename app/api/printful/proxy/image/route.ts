import { NextRequest, NextResponse } from "next/server";
import { withCache } from "@/middleware/api-cache";

/**
 * API route to proxy image requests to Printful CDN
 * This solves CORS issues when loading images directly from Printful's CDN
 */
export async function GET(request: NextRequest) {
  return withCache(request, async () => {
    try {
      // Get the image URL from the query parameter
      const url = request.nextUrl.searchParams.get("url");
      
      if (!url) {
        return NextResponse.json(
          { error: "Missing URL parameter" },
          { status: 400 }
        );
      }
      
      // Validate that the URL is from Printful's CDN
      if (!url.startsWith("https://files.cdn.printful.com/")) {
        return NextResponse.json(
          { error: "Only Printful CDN URLs are allowed" },
          { status: 400 }
        );
      }
      
      // Fetch the image from Printful's CDN
      const response = await fetch(url);
      
      if (!response.ok) {
        return NextResponse.json(
          { error: `Failed to fetch image: ${response.statusText}` },
          { status: response.status }
        );
      }
      
      // Get the image data and content type
      const imageData = await response.arrayBuffer();
      const contentType = response.headers.get("content-type") || "image/jpeg";
      
      // Create a new response with the image data
      const imageResponse = new NextResponse(imageData, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=86400", // Cache for 24 hours
        },
      });
      
      return imageResponse;
    } catch (error) {
      console.error("Error proxying image:", error);
      return NextResponse.json(
        { 
          error: "Failed to proxy image",
          details: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
    }
  });
}
