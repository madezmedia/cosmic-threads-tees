import { NextResponse } from "next/server";
import { fetchCatalogProducts } from "@/lib/printful-api-v2";
import { withCache } from "@/middleware/api-cache";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return withCache(request, async () => {
    try {
      // Get query parameters
      const url = new URL(request.url);
      const types = url.searchParams.get("types")?.split(",") || undefined;
      const techniques = url.searchParams.get("techniques")?.split(",") || undefined;
      const limit = url.searchParams.get("limit") ? parseInt(url.searchParams.get("limit")!) : undefined;
      const offset = url.searchParams.get("offset") ? parseInt(url.searchParams.get("offset")!) : undefined;

      console.time("fetchCatalogProducts");
      // Fetch products
      const products = await fetchCatalogProducts({
        types,
        techniques,
        limit,
        offset,
      });
      console.timeEnd("fetchCatalogProducts");

      return NextResponse.json({ products });
    } catch (error) {
      console.error("Error fetching catalog products:", error);
      return NextResponse.json(
        { error: "Failed to fetch catalog products" },
        { status: 500 }
      );
    }
  });
}
