import { NextResponse } from 'next/server';
import { fetchCachedCatalogProducts, findDesignFriendlyTshirts, type CatalogProduct, PrintfulApiError } from '@/lib/printful-api-v2';

export async function GET(request: Request) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(2, 15);
  
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    
    console.log(`[${requestId}] API: /api/printful/catalog - Request - Category: ${category}`);
    
    // Fetch all catalog products
    let productsResponse;
    
    // If category is t-shirts, use the findDesignFriendlyTshirts function
    // This makes it compatible with the demo page
    if (category === 't-shirts') {
      try {
        productsResponse = await findDesignFriendlyTshirts();
      } catch (error) {
        console.error(`[${requestId}] Error using findDesignFriendlyTshirts, falling back to fetchCachedCatalogProducts`);
        productsResponse = await fetchCachedCatalogProducts();
      }
    } else {
      productsResponse = await fetchCachedCatalogProducts();
    }
    
    // Ensure products is an array
    const products = Array.isArray(productsResponse) ? productsResponse : [];
    
    console.log(`[${requestId}] API: /api/printful/catalog - Products fetched: ${products.length}`);
    
    // Filter products by category
    let filteredProducts = products;
    if (category !== 'all') {
      // Filter based on category
      if (category === 't-shirts') {
        filteredProducts = products.filter((p: CatalogProduct) => 
          p.types?.includes('T-SHIRT') || 
          p.name?.toLowerCase().includes('t-shirt') || 
          p.name?.toLowerCase().includes('tee')
        );
      } else if (category === 'wall-art') {
        filteredProducts = products.filter((p: CatalogProduct) => 
          p.types?.includes('POSTER') || 
          p.types?.includes('CANVAS') || 
          p.name?.toLowerCase().includes('poster') || 
          p.name?.toLowerCase().includes('print') ||
          p.name?.toLowerCase().includes('canvas')
        );
      } else if (category === 'accessories') {
        filteredProducts = products.filter((p: CatalogProduct) => 
          p.types?.includes('MUG') || 
          p.types?.includes('PHONE_CASE') ||
          p.name?.toLowerCase().includes('mug') || 
          p.name?.toLowerCase().includes('phone case')
        );
      }
    }
    
    // Curate the selection (limit to a reasonable number)
    const curatedProducts = filteredProducts.slice(0, 12);
    
    const responseTime = Date.now() - startTime;
    console.log(`[${requestId}] API: /api/printful/catalog - Success - ${curatedProducts.length} products returned - ${responseTime}ms`);
    
    // Return in multiple formats to be compatible with different consumers
    return NextResponse.json({ 
      // Original format
      products: curatedProducts,
      // Demo page format
      tshirts: curatedProducts,
      // Additional metadata
      timestamp: new Date().toISOString(),
      apiVersion: 'v2',
      meta: {
        total: products.length,
        filtered: filteredProducts.length,
        returned: curatedProducts.length,
        category,
        responseTime
      }
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    // Enhanced error logging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = error instanceof PrintfulApiError ? 
      { status: error.status, code: error.code } : {};
    
    console.error(`[${requestId}] API: /api/printful/catalog - Error - ${responseTime}ms`, {
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
