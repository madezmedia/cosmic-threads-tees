/**
 * Utility functions for handling image proxying
 */

/**
 * Convert a Printful CDN URL to a proxied URL through our API
 * This helps avoid CORS issues when loading images from Printful's CDN
 * 
 * @param url The original Printful CDN URL
 * @returns The proxied URL through our API
 */
export function getProxiedImageUrl(url: string): string {
  // If the URL is not from Printful's CDN, return it as is
  if (!url || !url.startsWith("https://files.cdn.printful.com/")) {
    return url;
  }
  
  // Encode the URL to ensure it's properly passed as a query parameter
  const encodedUrl = encodeURIComponent(url);
  
  // Return the proxied URL
  return `/api/printful/proxy/image?url=${encodedUrl}`;
}

/**
 * Process an object to replace all Printful CDN URLs with proxied URLs
 * This is useful for processing API responses that contain image URLs
 * 
 * @param obj The object to process
 * @returns A new object with all Printful CDN URLs replaced with proxied URLs
 */
export function proxyPrintfulImages<T>(obj: T): T {
  if (!obj) {
    return obj;
  }
  
  // If it's a string, check if it's a Printful CDN URL
  if (typeof obj === 'string') {
    return getProxiedImageUrl(obj) as unknown as T;
  }
  
  // If it's an array, process each item
  if (Array.isArray(obj)) {
    return obj.map(item => proxyPrintfulImages(item)) as unknown as T;
  }
  
  // If it's an object, process each property
  if (typeof obj === 'object') {
    const result: Record<string, any> = {};
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = proxyPrintfulImages((obj as Record<string, any>)[key]);
      }
    }
    
    return result as T;
  }
  
  // For other types, return as is
  return obj;
}
