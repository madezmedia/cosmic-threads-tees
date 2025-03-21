import { NextResponse } from 'next/server';
import { getCachedCatalogVariants, getProductColors, getProductSizes, type CatalogVariant, PrintfulApiError } from '@/lib/printful-api-v2';

export async function GET(request: Request) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(2, 15);
  
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    console.log(`[${requestId}] API: /api/printful/variants - Request - ProductId: ${productId}`);
    
    if (!productId) {
      console.warn(`[${requestId}] API: /api/printful/variants - Error - Missing productId parameter`);
      return NextResponse.json({ 
        error: 'Product ID is required',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }
    
    const productIdNum = parseInt(productId);
    
    // Get variants
    const variantsResponse = await getCachedCatalogVariants(productIdNum);
    
    // Ensure variants is an array
    const variants = Array.isArray(variantsResponse) ? variantsResponse : [];
    
    console.log(`[${requestId}] API: /api/printful/variants - Variants fetched: ${variants.length}`);
    
    // Group variants by color
    const colorGroups: Record<string, CatalogVariant[]> = {};
    
    variants.forEach(variant => {
      if (!colorGroups[variant.color]) {
        colorGroups[variant.color] = [];
      }
      colorGroups[variant.color].push(variant);
    });
    
    // Get unique sizes and sort them
    const sizes = [...new Set(variants.map(v => v.size))].sort();
    
    // Get color information
    const colors = Object.keys(colorGroups).map(color => ({
      name: color,
      code: colorGroups[color][0].color_code,
      image: colorGroups[color][0].variant_image_url
    }));
    
    // Try to get colors and sizes using the dedicated functions
    // This makes it more compatible with the demo page
    let apiColors: { name: string; code: string; }[] = [];
    let apiSizes: string[] = [];
    
    try {
      apiColors = await getProductColors(productIdNum);
    } catch (error) {
      console.error(`[${requestId}] Error getting colors with getProductColors, using derived colors`);
    }
    
    try {
      apiSizes = await getProductSizes(productIdNum);
    } catch (error) {
      console.error(`[${requestId}] Error getting sizes with getProductSizes, using derived sizes`);
    }
    
    const responseTime = Date.now() - startTime;
    console.log(`[${requestId}] API: /api/printful/variants - Success - ${variants.length} variants, ${colors.length} colors, ${sizes.length} sizes - ${responseTime}ms`);
    
    return NextResponse.json({ 
      // Original format
      variants,
      colorGroups,
      sizes: apiSizes.length > 0 ? apiSizes : sizes,
      colors: apiColors.length > 0 ? apiColors : colors,
      // Additional metadata
      timestamp: new Date().toISOString(),
      apiVersion: 'v2',
      meta: {
        productId: productIdNum,
        variantCount: variants.length,
        colorCount: colors.length,
        sizeCount: sizes.length,
        responseTime
      }
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    // Enhanced error logging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = error instanceof PrintfulApiError ? 
      { status: error.status, code: error.code } : {};
    
    console.error(`[${requestId}] API: /api/printful/variants - Error - ${responseTime}ms`, {
      message: errorMessage,
      timestamp: new Date().toISOString(),
      ...errorDetails
    });
    
    return NextResponse.json({ 
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: error instanceof PrintfulApiError ? error.status : 500 });
  }
}
