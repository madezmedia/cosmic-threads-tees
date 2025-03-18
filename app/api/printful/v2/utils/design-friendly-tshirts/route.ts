import { NextResponse } from "next/server";
import { findDesignFriendlyTshirts } from "@/lib/printful-api-v2";
import { withCache } from "@/middleware/api-cache";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return withCache(request, async () => {
    try {
      console.time("findDesignFriendlyTshirts");
      const tshirts = await findDesignFriendlyTshirts();
      console.timeEnd("findDesignFriendlyTshirts");
      return NextResponse.json({ tshirts });
    } catch (error) {
      console.error("Error fetching design-friendly t-shirts:", error);
      return NextResponse.json(
        { error: "Failed to fetch design-friendly t-shirts" },
        { status: 500 }
      );
    }
  });
}
