import { NextResponse } from "next/server";
import { getMockupTemplates } from "@/lib/printful-api-v2";
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

      console.time(`getMockupTemplates-${productId}`);
      const templates = await getMockupTemplates(productId);
      console.timeEnd(`getMockupTemplates-${productId}`);

      return NextResponse.json({ templates });
    } catch (error) {
      console.error(`Error fetching mockup templates for product ${params.id}:`, error);
      return NextResponse.json(
        { error: "Failed to fetch mockup templates" },
        { status: 500 }
      );
    }
  });
}
