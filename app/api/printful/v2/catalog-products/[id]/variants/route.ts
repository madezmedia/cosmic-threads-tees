import { NextResponse } from "next/server";
import { getCachedCatalogVariants } from "@/lib/printful-api-v2";
import { withCache } from "@/middleware/api-cache";
import { NextRequest } from "next/server";

/**
 * API route to get variants of a specific catalog product
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
      
      const variants = await getCachedCatalogVariants(productId);
      
      console.log(`Retrieved ${variants.length} variants for product ${productId}`);
      
      return NextResponse.json({ 
        variants,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error fetching variants:", error);
      return NextResponse.json(
        { 
          error: "Failed to fetch variants",
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
  });
}
