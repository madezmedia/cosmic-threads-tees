import { NextResponse } from "next/server";
import { getCachedCatalogProduct } from "@/lib/printful-api-v2";
import { withCache } from "@/middleware/api-cache";
import { NextRequest } from "next/server";

/**
 * API route to get a specific catalog product by ID
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
      
      const product = await getCachedCatalogProduct(productId);
      
      console.log(`Retrieved product ${productId}: ${product.name}`);
      
      return NextResponse.json({ 
        product,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      return NextResponse.json(
        { 
          error: "Failed to fetch product",
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
  });
}
