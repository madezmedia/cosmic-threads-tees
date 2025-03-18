import { NextResponse } from "next/server";
import { getProductSizes } from "@/lib/printful-api-v2";
import { withCache } from "@/middleware/api-cache";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return withCache(request, async () => {
    try {
      // Get query parameters
      const url = new URL(request.url);
      const productIdParam = url.searchParams.get("productId");

      if (!productIdParam) {
        return NextResponse.json(
          { error: "Product ID is required" },
          { status: 400 }
        );
      }

      const productId = Number.parseInt(productIdParam);

      if (isNaN(productId)) {
        return NextResponse.json(
          { error: "Invalid product ID" },
          { status: 400 }
        );
      }

      console.time(`getProductSizes-${productId}`);
      const sizes = await getProductSizes(productId);
      console.timeEnd(`getProductSizes-${productId}`);
      
      return NextResponse.json({ sizes });
    } catch (error) {
      console.error("Error fetching product sizes:", error);
      return NextResponse.json(
        { error: "Failed to fetch product sizes" },
        { status: 500 }
      );
    }
  });
}
