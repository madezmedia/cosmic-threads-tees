# Printful API v2 Integration

This document provides an overview of the Printful API v2 beta integration for the Cosmic Threads T-shirt design platform.

## Overview

The Printful API v2 beta provides enhanced functionality for catalog browsing, variant selection, and mockup generation. This integration allows Cosmic Threads to leverage these new features while maintaining compatibility with the existing v1 API for order processing.

## Implementation

The integration consists of:

1. A TypeScript service module (`lib/printful-api-v2.ts`) that provides strongly-typed interfaces and functions for interacting with the Printful API v2 beta
2. Next.js API routes that expose the functionality to the frontend
3. A caching middleware for improved API performance
4. A demo page that showcases the integration

## API Service Module

The `lib/printful-api-v2.ts` module provides:

- TypeScript interfaces for Printful API v2 responses
- Functions for interacting with the Printful API v2 endpoints
- Error handling and response parsing
- In-memory caching for improved performance
- Utility functions for common operations

## Caching System

The integration includes two levels of caching to improve performance:

1. **Service-level caching** in the `lib/printful-api-v2.ts` module:
   - Caches API responses in memory
   - Provides cached versions of API functions with the `getCached` prefix
   - Default TTL of 1 hour

2. **API route caching** via the `middleware/api-cache.ts` middleware:
   - Caches API responses at the Next.js API route level
   - Applies to all GET requests
   - Provides detailed logging for cache hits and misses
   - Default TTL of 1 hour
   - Automatically handles cache invalidation

This dual-layer caching system significantly improves performance, especially for slow API calls like fetching design-friendly t-shirts.

## API Routes

The following API routes are available:

### Catalog Products

- `GET /api/printful/v2/catalog-products` - List catalog products with optional filtering
- `GET /api/printful/v2/catalog-products/[id]` - Get a specific catalog product
- `GET /api/printful/v2/catalog-products/[id]/variants` - Get variants for a specific product
- `GET /api/printful/v2/catalog-products/[id]/mockup-styles` - Get mockup styles for a specific product
- `GET /api/printful/v2/catalog-products/[id]/mockup-templates` - Get mockup templates for a specific product

### Catalog Variants

- `GET /api/printful/v2/catalog-variants/[id]/prices` - Get pricing information for a specific variant

### Mockups

- `POST /api/printful/v2/mockups` - Generate a mockup for a specific product and variant

### Utility Endpoints

- `GET /api/printful/v2/utils/product-colors` - Get all available colors for a product
- `GET /api/printful/v2/utils/product-sizes` - Get all available sizes for a product
- `GET /api/printful/v2/utils/find-variant` - Find a specific variant by product ID, color, and size
- `GET /api/printful/v2/utils/design-friendly-tshirts` - Find t-shirts suitable for AI-generated designs

## Performance Monitoring

All API routes include performance monitoring using `console.time()` and `console.timeEnd()` to track the execution time of API calls. This helps identify slow API calls and optimize performance.

## Demo Page

A demo page is available at `/printful-v2-demo.html` that showcases the integration. The demo allows you to:

1. Browse design-friendly t-shirts
2. View product details
3. Select colors and sizes
4. Generate mockups with your design

## Usage Examples

### Fetching Design-Friendly T-shirts

```typescript
import { findDesignFriendlyTshirts } from '@/lib/printful-api-v2';

// Get t-shirts suitable for AI-generated designs
const tshirts = await findDesignFriendlyTshirts();
```

### Getting Product Details

```typescript
import { getCatalogProduct } from '@/lib/printful-api-v2';

// Get details for a specific product
const product = await getCatalogProduct(productId);
```

### Getting Product Variants

```typescript
import { getCatalogVariants } from '@/lib/printful-api-v2';

// Get variants for a specific product
const variants = await getCatalogVariants(productId);
```

### Generating a Mockup

```typescript
import { generateMockup } from '@/lib/printful-api-v2';

// Generate a mockup
const mockupResult = await generateMockup(
  productId,
  variantId,
  designUrl,
  'front', // placement
  mockupStyleId // optional
);
```

## Error Handling

The API service module includes a custom `PrintfulApiError` class that provides detailed error information. All API functions include proper error handling and will throw this error type when an API request fails.

```typescript
try {
  const product = await getCatalogProduct(productId);
} catch (error) {
  if (error instanceof PrintfulApiError) {
    console.error(`Printful API error: ${error.message} (${error.status})`);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## Using the Caching Middleware

The caching middleware can be used in any API route to improve performance:

```typescript
import { withCache } from '@/middleware/api-cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return withCache(request, async () => {
    // Your API route logic here
    return NextResponse.json({ data: 'your data' });
  });
}
```

## Integration with Existing Code

The v2 API integration is designed to work alongside the existing v1 API integration. The v1 API is still used for order processing, while the v2 API is used for catalog browsing, variant selection, and mockup generation.

## Future Improvements

1. Add support for more product types beyond t-shirts
2. Implement order creation using the v2 API when it becomes available
3. Add support for more mockup generation options
4. Improve error handling and retry logic
5. Replace in-memory caching with Redis for distributed caching
6. Add cache invalidation endpoints for admin use
