import { NextResponse } from "next/server";
import { generateMockup, checkMockupStatus } from "@/lib/printful-api-v2";
import { NextRequest } from "next/server";

/**
 * API route to generate mockups
 * This is specifically for compatibility with the demo page
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, variantId, imageUrl, placement = 'front', mockupStyleId } = body;
    
    if (!productId || !variantId || !imageUrl) {
      return NextResponse.json(
        { error: "Product ID, variant ID, and image URL are required" },
        { status: 400 }
      );
    }
    
    console.log(`Generating mockup for product ${productId}, variant ${variantId}, placement ${placement}`);
    
    // Generate the mockup
    const mockupResult = await generateMockup(
      parseInt(productId),
      parseInt(variantId),
      imageUrl,
      placement,
      mockupStyleId ? parseInt(mockupStyleId) : undefined
    );
    
    // If the mockup is not ready yet, check its status
    if (mockupResult.status === 'pending') {
      let finalResult = mockupResult;
      let attempts = 0;
      const maxAttempts = 10;
      
      // Poll for the mockup status
      while (finalResult.status === 'pending' && attempts < maxAttempts) {
        console.log(`Mockup generation in progress, checking status (attempt ${attempts + 1}/${maxAttempts})...`);
        
        // Wait a bit before checking again
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check the status
        finalResult = await checkMockupStatus(mockupResult.task_id);
        attempts++;
      }
      
      if (finalResult.status === 'pending') {
        console.log('Mockup generation timed out');
        return NextResponse.json(
          { 
            error: "Mockup generation timed out",
            task_id: mockupResult.task_id,
            timestamp: new Date().toISOString()
          },
          { status: 408 }
        );
      }
      
      console.log('Mockup generation completed');
      return NextResponse.json({ 
        mockups: finalResult.mockups,
        timestamp: new Date().toISOString()
      });
    }
    
    // If the mockup is already ready, return it
    console.log('Mockup generation completed immediately');
    return NextResponse.json({ 
      mockups: mockupResult.mockups,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error generating mockup:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate mockup",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
