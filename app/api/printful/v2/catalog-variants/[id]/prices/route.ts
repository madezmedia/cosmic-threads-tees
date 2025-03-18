import { NextResponse } from "next/server";
import { getVariantPrices } from "@/lib/printful-api-v2";
import { withCache } from "@/middleware/api-cache";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withCache(request, async () => {
    try {
      const variantId = Number.parseInt(params.id);

      if (isNaN(variantId)) {
        return NextResponse.json(
          { error: "Invalid variant ID" },
          { status: 400 }
        );
      }

      console.time(`getVariantPrices-${variantId}`);
      const prices = await getVariantPrices(variantId);
      console.timeEnd(`getVariantPrices-${variantId}`);

      return NextResponse.json({ prices });
    } catch (error) {
      console.error(`Error fetching prices for variant ${params.id}:`, error);
      return NextResponse.json(
        { error: "Failed to fetch variant prices" },
        { status: 500 }
      );
    }
  });
}
