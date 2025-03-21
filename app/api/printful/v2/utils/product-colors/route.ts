import { NextResponse } from "next/server";
import { getProductColors } from "@/lib/printful-api-v2";
import { withCache } from "@/middleware/api-cache";
import { NextRequest } from "next/server";

/**
 * API route to get product colors
 * This is specifically for compatibility with the demo page
 */
export async function GET(request: NextRequest) {
  return withCache(request, async () => {
    try {
      const { searchParams } = new URL(request.url);
      const productId = searchParams.get('productId');
      
      if (!productId) {
        return NextResponse.json(
          { error: "Product ID is required" },
          { status: 400 }
        );
      }
      
      const colors = await getProductColors(parseInt(productId));
      
      console.log(`Found ${colors.length} colors for product ${productId}`);
      
      return NextResponse.json({ 
        colors,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error fetching product colors:", error);
      return NextResponse.json(
        { 
          error: "Failed to fetch product colors",
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
  });
}
