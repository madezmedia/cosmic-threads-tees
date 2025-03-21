import { NextResponse } from "next/server";
import { findDesignFriendlyTshirts } from "@/lib/printful-api-v2";
import { withCache } from "@/middleware/api-cache";
import { NextRequest } from "next/server";

/**
 * API route to find design-friendly t-shirts
 * This is specifically for compatibility with the demo page
 */
export async function GET(request: NextRequest) {
  return withCache(request, async () => {
    try {
      console.time("findDesignFriendlyTshirts");
      const tshirts = await findDesignFriendlyTshirts();
      console.timeEnd("findDesignFriendlyTshirts");
      
      console.log(`Found ${tshirts.length} design-friendly t-shirts`);
      
      // Return tshirts as an array directly, not as an object property
      // This is what the demo page expects
      return NextResponse.json(tshirts);
    } catch (error) {
      console.error("Error fetching design-friendly t-shirts:", error);
      return NextResponse.json(
        { 
          error: "Failed to fetch design-friendly t-shirts",
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
  });
}
