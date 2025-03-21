import { NextResponse } from "next/server";
import { getCachedMockupStyles } from "@/lib/printful-api-v2";
import { withCache } from "@/middleware/api-cache";
import { NextRequest } from "next/server";

/**
 * API route to get mockup styles of a specific catalog product
 * This is specifically for compatibility with the demo page
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withCache(request, async () => {
    try {
      const productId = parseInt(params.id);
      
      if (isNaN(productId)) {
        return NextResponse.json(
          { error: "Invalid product ID" },
          { status: 400 }
        );
      }
      
      const styles = await getCachedMockupStyles(productId);
      
      console.log(`Retrieved ${styles.length} mockup styles for product ${productId}`);
      
      return NextResponse.json({ 
        styles,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error fetching mockup styles:", error);
      return NextResponse.json(
        { 
          error: "Failed to fetch mockup styles",
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
  });
}
