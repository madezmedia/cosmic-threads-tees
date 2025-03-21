import { NextResponse } from "next/server";
import { findDesignFriendlyTshirts } from "@/lib/printful-api-v2";
import { withCache } from "@/middleware/api-cache";
import { NextRequest } from "next/server";
import { proxyPrintfulImages } from "@/lib/image-proxy";

/**
 * API route to find design-friendly t-shirts
 * This is specifically for compatibility with the demo page
 * 
 * Query parameters:
 * - printType: "front" for front image print, "all-over" for all-over print
 */
export async function GET(request: NextRequest) {
  return withCache(request, async () => {
    try {
      // Get the print type filter from the query parameters
      const printType = request.nextUrl.searchParams.get("printType");
      
      console.time("findDesignFriendlyTshirts");
      let tshirts = await findDesignFriendlyTshirts();
      console.timeEnd("findDesignFriendlyTshirts");
      
      // Filter by print type if specified
      if (printType) {
        tshirts = tshirts.filter(tshirt => {
          const techniques = tshirt.techniques || [];
          
          if (printType === "front") {
            // Front image print typically uses DTG technique but not DTF
            return techniques.includes("dtg") && !techniques.includes("dtf");
          } else if (printType === "all-over") {
            // All-over print typically uses DTF technique
            return techniques.includes("dtf");
          }
          
          return true;
        });
      }
      
      console.log(`Found ${tshirts.length} design-friendly t-shirts${printType ? ` with print type: ${printType}` : ''}`);
      
      // Process images to use our proxy
      const proxiedTshirts = proxyPrintfulImages(tshirts);
      
      // Return tshirts as an array directly, not as an object property
      // This is what the demo page expects
      return NextResponse.json(proxiedTshirts);
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
