import { NextResponse } from "next/server";
import { getCatalogVariants } from "@/lib/printful-api-v2";
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

      console.time(`getCatalogVariants-${productId}`);
      const variants = await getCatalogVariants(productId);
      console.timeEnd(`getCatalogVariants-${productId}`);

      return NextResponse.json({ variants });
    } catch (error) {
      console.error(`Error fetching catalog variants for product ${params.id}:`, error);
      return NextResponse.json(
        { error: "Failed to fetch catalog variants" },
        { status: 500 }
      );
    }
  });
}
