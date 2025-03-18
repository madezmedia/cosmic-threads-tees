import { NextResponse } from "next/server";
import { generateMockup, checkMockupStatus } from "@/lib/printful-api-v2";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, variantId, imageUrl, placement, mockupStyleId } = body;

    if (!productId || !variantId || !imageUrl) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Generate mockup
    const mockupResult = await generateMockup(
      productId,
      variantId,
      imageUrl,
      placement || "front",
      mockupStyleId
    );

    // If the mockup generation is still in progress, poll for the result
    if (mockupResult.status === "pending") {
      // Wait for a short time to allow the mockup to be generated
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Check the status of the mockup generation
      const finalResult = await checkMockupStatus(mockupResult.task_id);
      return NextResponse.json({ mockups: finalResult.mockups });
    }

    return NextResponse.json({ mockups: mockupResult.mockups });
  } catch (error) {
    console.error("Error generating mockup:", error);
    return NextResponse.json(
      { error: "Failed to generate mockup" },
      { status: 500 }
    );
  }
}
