import { NextResponse } from "next/server";
import { findVariant } from "@/lib/printful-api-v2";
import { withCache } from "@/middleware/api-cache";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return withCache(request, async () => {
    try {
      // Get query parameters
      const url = new URL(request.url);
      const productIdParam = url.searchParams.get("productId");
      const color = url.searchParams.get("color");
      const size = url.searchParams.get("size");

      if (!productIdParam || !color || !size) {
        return NextResponse.json(
          { error: "Product ID, color, and size are required" },
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

      console.time(`findVariant-${productId}-${color}-${size}`);
      const variant = await findVariant(productId, color, size);
      console.timeEnd(`findVariant-${productId}-${color}-${size}`);

      if (!variant) {
        return NextResponse.json(
          { error: "Variant not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ variant });
    } catch (error) {
      console.error("Error finding variant:", error);
      return NextResponse.json(
        { error: "Failed to find variant" },
        { status: 500 }
      );
    }
  });
}
