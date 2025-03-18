/**
 * Printful API v2 service
 * This file handles interactions with the Printful API v2 beta
 */

import { getAuthHeader } from './printful-api';

// Base URL for Printful API v2
const PRINTFUL_API_V2_URL = "https://api.printful.com/v2";

// Custom error class for Printful API errors
export class PrintfulApiError extends Error {
  status: number;
  code: string;
  
  constructor(message: string, status: number, code: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = "PrintfulApiError";
  }
}

// Wrapper function for API calls
async function callPrintfulApi<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(`${PRINTFUL_API_V2_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new PrintfulApiError(
        error.message || "Unknown Printful API error",
        response.status,
        error.code || "unknown"
      );
    }
    
    const data = await response.json();
    
    // Check if the response has a result property
    if (data.result !== undefined) {
      return data.result;
    }
    
    // If there's no result property, return the data directly
    return data;
  } catch (error) {
    console.error(`Printful API v2 error (${endpoint}):`, error);
    throw error;
  }
}

// In-memory cache
const cache = new Map<string, {data: any, timestamp: number}>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// Cached API call wrapper
async function cachedApiCall<T>(
  cacheKey: string,
  apiFn: () => Promise<T>
): Promise<T> {
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }
  
  const data = await apiFn();
  cache.set(cacheKey, {data, timestamp: Date.now()});
  return data;
}

// Types for Printful API v2 responses

// Product image
export interface ProductImage {
  id: number;
  type: string;
  url: string;
  options?: {
    background_color?: string;
    orientation?: string;
    size_guide?: boolean;
    on_model?: boolean;
    lifestyle?: boolean;
    generated_image?: boolean;
    frame?: boolean;
  };
}

// Dimensions
export interface Dimensions {
  unit: string;
  width: number;
  height: number;
  length: number;
}

// Catalog Product
export interface CatalogProduct {
  id: number;
  main_category_id: number;
  product_image_url: string;
  product_images: ProductImage[];
  dimensions: Dimensions;
  name: string;
  product_variant_id: number;
  weight: number;
  weight_unit: string;
  description: string;
  is_discontinued: boolean;
  available_placements: {
    [key: string]: {
      technique: string;
      width: number;
      height: number;
      width_unit: string;
      height_unit: string;
    };
  };
  techniques: string[];
  types: string[];
}

// Catalog Variant
export interface CatalogVariant {
  id: number;
  catalog_product_id: number;
  name: string;
  size: string;
  color: string;
  color_code: string;
  in_stock: boolean;
  dimensions: Dimensions;
  item_weight: number;
  weight_unit: string;
  is_discontinued: boolean;
  availability_status: string;
  availability_regions: {
    [key: string]: string;
  };
  variant_image_url: string;
  variant_images: ProductImage[];
}

// Price Info
export interface PriceInfo {
  currency: string;
  amount: number;
  discount_amount?: number;
  discount_percent?: number;
  bulk_discounts?: {
    quantity: number;
    amount: number;
    percent: number;
  }[];
}

// Mockup Style
export interface MockupStyle {
  id: number;
  name: string;
  background_color: string;
  size_guide: boolean;
  on_model: boolean;
  lifestyle: boolean;
  generated_image: boolean;
  frame: boolean;
  orientation: string;
  preview_image_url: string;
}

// Mockup Template
export interface MockupTemplate {
  id: number;
  placement: string;
  orientation: string;
  background_color: string;
  size_guide: boolean;
  on_model: boolean;
  lifestyle: boolean;
  generated_image: boolean;
  frame: boolean;
  preview_image_url: string;
}

// Mockup Result
export interface MockupResult {
  task_id: string;
  status: string;
  mockups: {
    placement: string;
    variant_ids: number[];
    mockup_url: string;
    extra: any[];
  }[];
}

/**
 * Fetch catalog products with optional filtering
 */
export async function fetchCatalogProducts(
  options: {
    types?: string[],
    techniques?: string[],
    limit?: number,
    offset?: number
  } = {}
): Promise<CatalogProduct[]> {
  const { types, techniques, limit = 100, offset = 0 } = options;
  
  let queryParams = new URLSearchParams();
  
  if (types && types.length > 0) {
    queryParams.append('types', types.join(','));
  }
  
  if (techniques && techniques.length > 0) {
    queryParams.append('techniques', techniques.join(','));
  }
  
  queryParams.append('limit', limit.toString());
  queryParams.append('offset', offset.toString());
  
  return callPrintfulApi<CatalogProduct[]>(`/catalog-products?${queryParams.toString()}`);
}

/**
 * Fetch catalog products with caching
 */
export async function fetchCachedCatalogProducts(
  options: {
    types?: string[],
    techniques?: string[],
    limit?: number,
    offset?: number
  } = {}
): Promise<CatalogProduct[]> {
  const { types, techniques, limit = 100, offset = 0 } = options;
  
  // Create a cache key based on the options
  const cacheKey = `catalog_products_${JSON.stringify(options)}`;
  
  return cachedApiCall(cacheKey, () => fetchCatalogProducts(options));
}

/**
 * Find t-shirts suitable for AI-generated designs
 */
export async function findDesignFriendlyTshirts(): Promise<CatalogProduct[]> {
  return fetchCatalogProducts({
    types: ["T-SHIRT"],
    techniques: ["dtg"],
  });
}

/**
 * Get a specific catalog product by ID
 */
export async function getCatalogProduct(productId: number): Promise<CatalogProduct> {
  return callPrintfulApi<CatalogProduct>(`/catalog-products/${productId}`);
}

/**
 * Get a specific catalog product by ID with caching
 */
export async function getCachedCatalogProduct(productId: number): Promise<CatalogProduct> {
  return cachedApiCall(`catalog_product_${productId}`, () => getCatalogProduct(productId));
}

/**
 * Get catalog variants for a specific product
 */
export async function getCatalogVariants(productId: number): Promise<CatalogVariant[]> {
  return callPrintfulApi<CatalogVariant[]>(`/catalog-products/${productId}/catalog-variants`);
}

/**
 * Get catalog variants for a specific product with caching
 */
export async function getCachedCatalogVariants(productId: number): Promise<CatalogVariant[]> {
  return cachedApiCall(`catalog_variants_${productId}`, () => getCatalogVariants(productId));
}

/**
 * Get pricing information for a specific variant
 */
export async function getVariantPrices(variantId: number): Promise<PriceInfo[]> {
  return callPrintfulApi<PriceInfo[]>(`/catalog-variants/${variantId}/prices`);
}

/**
 * Get pricing information for a specific variant with caching
 */
export async function getCachedVariantPrices(variantId: number): Promise<PriceInfo[]> {
  return cachedApiCall(`variant_prices_${variantId}`, () => getVariantPrices(variantId));
}

/**
 * Get mockup styles for a specific product
 */
export async function getMockupStyles(productId: number): Promise<MockupStyle[]> {
  return callPrintfulApi<MockupStyle[]>(`/catalog-products/${productId}/mockup-styles`);
}

/**
 * Get mockup styles for a specific product with caching
 */
export async function getCachedMockupStyles(productId: number): Promise<MockupStyle[]> {
  return cachedApiCall(`mockup_styles_${productId}`, () => getMockupStyles(productId));
}

/**
 * Get mockup templates for a specific product
 */
export async function getMockupTemplates(productId: number): Promise<MockupTemplate[]> {
  return callPrintfulApi<MockupTemplate[]>(`/catalog-products/${productId}/mockup-templates`);
}

/**
 * Get mockup templates for a specific product with caching
 */
export async function getCachedMockupTemplates(productId: number): Promise<MockupTemplate[]> {
  return cachedApiCall(`mockup_templates_${productId}`, () => getMockupTemplates(productId));
}

/**
 * Generate a mockup for a specific product and variant
 */
export async function generateMockup(
  productId: number, 
  variantId: number, 
  designUrl: string,
  placement: string = "front",
  mockupStyleId?: number
): Promise<MockupResult> {
  const payload = {
    format: "jpg",
    products: [
      {
        source: "catalog",
        mockup_style_ids: mockupStyleId ? [mockupStyleId] : undefined,
        catalog_product_id: productId,
        catalog_variant_ids: [variantId],
        placements: [
          {
            placement,
            technique: "dtg",
            layers: [
              {
                type: "file",
                url: designUrl
              }
            ]
          }
        ]
      }
    ]
  };
  
  return callPrintfulApi<MockupResult>('/mockup-tasks', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

/**
 * Check the status of a mockup generation task
 */
export async function checkMockupStatus(taskId: string): Promise<MockupResult> {
  return callPrintfulApi<MockupResult>(`/mockup-tasks?id=${taskId}`);
}

/**
 * Get all available colors for a product
 */
export async function getProductColors(productId: number): Promise<{name: string, code: string}[]> {
  const variants = await getCachedCatalogVariants(productId);
  
  // Extract unique colors
  const colorMap = new Map<string, {name: string, code: string}>();
  
  variants.forEach(variant => {
    if (!colorMap.has(variant.color_code)) {
      colorMap.set(variant.color_code, {
        name: variant.color,
        code: variant.color_code
      });
    }
  });
  
  return Array.from(colorMap.values());
}

/**
 * Get all available sizes for a product
 */
export async function getProductSizes(productId: number): Promise<string[]> {
  const variants = await getCachedCatalogVariants(productId);
  
  // Extract unique sizes
  const sizes = new Set<string>();
  
  variants.forEach(variant => {
    sizes.add(variant.size);
  });
  
  return Array.from(sizes);
}

/**
 * Find a specific variant by product ID, color, and size
 */
export async function findVariant(
  productId: number,
  color: string,
  size: string
): Promise<CatalogVariant | undefined> {
  const variants = await getCachedCatalogVariants(productId);
  
  return variants.find(variant => 
    variant.color.toLowerCase() === color.toLowerCase() && 
    variant.size.toLowerCase() === size.toLowerCase()
  );
}
