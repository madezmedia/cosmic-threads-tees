import { NextResponse } from "next/server";
import { getMockupStyles } from "@/lib/printful-api-v2";
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

      console.time(`getMockupStyles-${productId}`);
      const styles = await getMockupStyles(productId);
      console.timeEnd(`getMockupStyles-${productId}`);

      return NextResponse.json({ styles });
    } catch (error) {
      console.error(`Error fetching mockup styles for product ${params.id}:`, error);
      return NextResponse.json(
        { error: "Failed to fetch mockup styles" },
        { status: 500 }
      );
    }
  });
}
