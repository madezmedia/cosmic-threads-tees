import { NextResponse } from "next/server";
import { getCatalogProduct } from "@/lib/printful-api-v2";
import { withCache } from "@/middleware/api-cache";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withCache(request, async () => {
    try {
      const productId = Number.parseInt(params.id);

      if (isNaN(productId)) {
        return NextResponse.json(
          { error: "Invalid product ID" },
          { status: 400 }
        );
      }

      console.time(`getCatalogProduct-${productId}`);
      const product = await getCatalogProduct(productId);
      console.timeEnd(`getCatalogProduct-${productId}`);

      return NextResponse.json({ product });
    } catch (error) {
      console.error(`Error fetching catalog product ${params.id}:`, error);
      return NextResponse.json(
        { error: "Failed to fetch catalog product" },
        { status: 500 }
      );
    }
  });
}
