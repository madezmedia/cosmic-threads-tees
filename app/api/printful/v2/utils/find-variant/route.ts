import { NextResponse } from "next/server";
import { findVariant } from "@/lib/printful-api-v2";
import { withCache } from "@/middleware/api-cache";
import { NextRequest } from "next/server";

/**
 * API route to find a specific variant by product ID, color, and size
 * This is specifically for compatibility with the demo page
 */
export async function GET(request: NextRequest) {
  return withCache(request, async () => {
    try {
      const { searchParams } = new URL(request.url);
      const productId = searchParams.get('productId');
      const color = searchParams.get('color');
      const size = searchParams.get('size');
      
      if (!productId || !color || !size) {
        return NextResponse.json(
          { error: "Product ID, color, and size are required" },
          { status: 400 }
        );
      }
      
      const variant = await findVariant(
        parseInt(productId),
        color,
        size
      );
      
      if (!variant) {
        return NextResponse.json(
          { error: "Variant not found" },
          { status: 404 }
        );
      }
      
      console.log(`Found variant ${variant.id} for product ${productId}, color ${color}, size ${size}`);
      
      return NextResponse.json({ 
        variant,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error finding variant:", error);
      return NextResponse.json(
        { 
          error: "Failed to find variant",
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
  });
}
