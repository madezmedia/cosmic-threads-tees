# Printful API v2 Integration Guide

This guide provides best practices and implementation details for integrating the Printful API v2 into the Cosmic Threads application.

## Table of Contents

1. [API Structure](#api-structure)
2. [Data Models](#data-models)
3. [Common Patterns](#common-patterns)
4. [Error Handling](#error-handling)
5. [Image Handling](#image-handling)
6. [Performance Optimization](#performance-optimization)
7. [Integration Examples](#integration-examples)

## API Structure

The Printful API v2 integration is structured as follows:

### API Routes

| Route | Description |
|-------|-------------|
| `/api/printful/catalog` | Fetches and filters catalog products by category |
| `/api/printful/variants` | Gets product variants with colors and sizes |
| `/api/printful/v2/utils/design-friendly-tshirts` | Fetches t-shirts suitable for designs |
| `/api/printful/v2/utils/product-colors` | Gets available colors for a product |
| `/api/printful/v2/utils/product-sizes` | Gets available sizes for a product |
| `/api/printful/v2/utils/find-variant` | Finds a specific variant by product ID, color, and size |
| `/api/printful/v2/catalog-products/[id]` | Gets details for a specific product |
| `/api/printful/v2/catalog-products/[id]/variants` | Gets variants for a specific product |
| `/api/printful/v2/catalog-products/[id]/mockup-styles` | Gets mockup styles for a product |
| `/api/printful/v2/mockups` | Generates mockups for a product with a design |

### Service Layer

The service layer is implemented in `lib/printful-api-v2.ts` and provides:

- Type definitions for API responses
- Caching for improved performance
- Error handling and logging
- Utility functions for common operations

## Data Models

### Product Data Structure

The Printful API v2 returns product data in a nested structure:

```typescript
interface PrintfulProductResponse {
  product: {
    data: {
      id: number;
      name: string;
      description: string;
      brand: string;
      model: string;
      image: string;
      is_discontinued: boolean;
      type: string;
      colors: Array<{
        name: string;
        code: string;
        // Additional color properties
      }>;
      sizes: string[];
      techniques: Array<{
        name: string;
        id: string;
        // Additional technique properties
      }>;
      placements: Array<{
        id: string;
        name: string;
        // Additional placement properties
      }>;
      // Additional product properties
    };
    extra: any[];
  };
  timestamp: string;
}
```

**Important Note**: Always access product data through `data.product.data` rather than directly through `data.product`.

### Variant Data Structure

Variants represent specific combinations of product, color, and size:

```typescript
interface PrintfulVariant {
  id: number;
  product_id: number;
  name: string;
  size: string;
  color: string;
  color_code: string;
  price: string;
  in_stock: boolean;
  // Additional variant properties
}
```

## Common Patterns

### Fetching Product Details

When fetching product details, always handle the nested data structure:

```javascript
async function getProductDetails(productId) {
  try {
    const response = await fetch(`/api/printful/v2/catalog-products/${productId}`);
    const data = await response.json();
    
    // Check for the nested product data structure
    if (data.product && data.product.data) {
      // Store the actual product data
      const productData = data.product.data;
      
      // Use the product data
      displayProductDetails(productData);
      
      // Use product's existing colors and sizes data
      if (productData.colors && Array.isArray(productData.colors)) {
        displayColorOptions(productData.colors);
      }
      
      if (productData.sizes && Array.isArray(productData.sizes)) {
        displaySizeOptions(productData.sizes);
      }
    }
  } catch (error) {
    console.error('Error:', error);
    // Handle error appropriately
  }
}
```

### Finding Variants

To find a specific variant by product ID, color, and size:

```javascript
async function findVariant(productId, colorName, size) {
  try {
    const response = await fetch(`/api/printful/v2/utils/find-variant?productId=${productId}&color=${colorName}&size=${size}`);
    const data = await response.json();
    
    if (data.variant) {
      return data.variant;
    }
    return null;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}
```

### Generating Mockups

To generate a mockup with a design:

```javascript
async function generateMockup(productId, variantId, imageUrl, placement = 'front', mockupStyleId = null) {
  try {
    const payload = {
      productId,
      variantId,
      imageUrl,
      placement,
      mockupStyleId: mockupStyleId || undefined
    };
    
    const response = await fetch('/api/printful/v2/mockups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    
    if (data.mockups && data.mockups.length > 0) {
      return data.mockups[0];
    }
    return null;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}
```

## Error Handling

### Common Error Patterns

1. **Missing or Malformed Data**: Always check if the expected data exists before accessing it.

```javascript
// Bad
const productName = data.product.data.name; // May cause TypeError if data.product or data.product.data is undefined

// Good
const productName = data.product?.data?.name || 'Unknown Product';
```

2. **API Failures**: Handle API failures gracefully with appropriate error messages.

```javascript
try {
  const response = await fetch('/api/printful/v2/catalog-products/123');
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  // Process data
} catch (error) {
  console.error('Error fetching product:', error);
  displayErrorMessage('Failed to load product details. Please try again later.');
}
```

3. **Type Checking**: Always check if arrays are actually arrays before using array methods.

```javascript
// Bad
styles.forEach(style => { /* ... */ }); // May cause TypeError if styles is not an array

// Good
if (Array.isArray(styles) && styles.length > 0) {
  styles.forEach(style => { /* ... */ });
} else {
  console.log('No styles available or invalid format:', styles);
  // Handle the case where styles is not an array
}
```

## Image Handling

### Image Proxy

Printful CDN images should be proxied through our image proxy service to:
- Avoid CORS issues
- Enable image optimization
- Provide caching
- Ensure consistent loading behavior

Use the `getProxiedImageUrl` function from `lib/image-proxy.ts`:

```javascript
function getProxiedImageUrl(url) {
  // If the URL is not from Printful's CDN, return it as is
  if (!url || !url.startsWith("https://files.cdn.printful.com/")) {
    return url;
  }
  
  // Encode the URL to ensure it's properly passed as a query parameter
  const encodedUrl = encodeURIComponent(url);
  
  // Return the proxied URL
  return `/api/printful/proxy/image?url=${encodedUrl}`;
}
```

### Processing Nested Image URLs

For objects with nested image URLs, use the `proxyPrintfulImages` function:

```javascript
function proxyPrintfulImages(obj) {
  if (!obj) {
    return obj;
  }
  
  // If it's a string, check if it's a Printful CDN URL
  if (typeof obj === 'string') {
    return getProxiedImageUrl(obj);
  }
  
  // If it's an array, process each item
  if (Array.isArray(obj)) {
    return obj.map(item => proxyPrintfulImages(item));
  }
  
  // If it's an object, process each property
  if (typeof obj === 'object') {
    const result = {};
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = proxyPrintfulImages(obj[key]);
      }
    }
    
    return result;
  }
  
  // For other types, return as is
  return obj;
}
```

## Performance Optimization

### Caching

The Printful API v2 integration uses a dual-layer caching system:

1. **Service-level caching** in the API service module
2. **API route-level caching** via middleware

This significantly improves performance for slow API calls, with a default TTL of 1 hour to balance freshness and performance.

### Optimizing API Calls

1. **Use Existing Data**: When possible, use data that's already available instead of making additional API calls.

```javascript
// Instead of this:
await getProductColors(productId);
await getProductSizes(productId);

// Do this if the data is already available:
if (product.colors && Array.isArray(product.colors)) {
  displayColorOptions(product.colors);
}

if (product.sizes && Array.isArray(product.sizes)) {
  displaySizeOptions(product.sizes);
}
```

2. **Batch Requests**: When possible, batch multiple requests into a single API call.

3. **Implement Pagination**: For large datasets, implement pagination to load data as needed.

## Integration Examples

### Product Listing Component

```jsx
import React, { useState, useEffect } from 'react';
import { getProxiedImageUrl } from '@/lib/image-proxy';

export function ProductListing({ category }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch(`/api/printful/catalog?category=${category}`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Extract products from the response
        const productList = data.result?.products || [];
        setProducts(productList);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category]);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div className="error">{error}</div>;
  if (products.length === 0) return <div>No products found.</div>;

  return (
    <div className="product-grid">
      {products.map(product => (
        <div key={product.id} className="product-card">
          <img 
            src={getProxiedImageUrl(product.image)} 
            alt={product.name} 
          />
          <h3>{product.name}</h3>
          <p>{product.description?.substring(0, 100)}...</p>
          <button>View Details</button>
        </div>
      ))}
    </div>
  );
}
```

### Product Detail Component

```jsx
import React, { useState, useEffect } from 'react';
import { getProxiedImageUrl } from '@/lib/image-proxy';

export function ProductDetail({ productId }) {
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProductDetails() {
      try {
        setLoading(true);
        const response = await fetch(`/api/printful/v2/catalog-products/${productId}`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check for the nested product data structure
        if (data.product?.data) {
          setProduct(data.product.data);
        } else {
          throw new Error('Invalid product data structure');
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchProductDetails();
  }, [productId]);

  if (loading) return <div>Loading product details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <div className="product-detail">
      <div className="product-image">
        <img 
          src={getProxiedImageUrl(product.image)} 
          alt={product.name} 
        />
      </div>
      
      <div className="product-info">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        
        {product.colors && Array.isArray(product.colors) && (
          <div className="color-options">
            <h3>Colors</h3>
            <div className="color-swatches">
              {product.colors.map(color => (
                <button
                  key={color.name}
                  className={`color-swatch ${selectedColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color.code }}
                  onClick={() => setSelectedColor(color)}
                  aria-label={color.name}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}
        
        {product.sizes && Array.isArray(product.sizes) && (
          <div className="size-options">
            <h3>Sizes</h3>
            <div className="size-buttons">
              {product.sizes.map(size => (
                <button
                  key={size}
                  className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <button className="add-to-cart-button" disabled={!selectedColor || !selectedSize}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
```

### Mockup Generator Component

```jsx
import React, { useState } from 'react';
import { getProxiedImageUrl } from '@/lib/image-proxy';

export function MockupGenerator({ productId, designImageUrl }) {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [mockupImage, setMockupImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  // Fetch product details on component mount
  React.useEffect(() => {
    async function fetchProductDetails() {
      try {
        const response = await fetch(`/api/printful/v2/catalog-products/${productId}`);
        const data = await response.json();
        
        if (data.product?.data) {
          setProduct(data.product.data);
          
          // Use product's existing colors and sizes data
          if (data.product.data.colors && Array.isArray(data.product.data.colors)) {
            setColors(data.product.data.colors);
          }
          
          if (data.product.data.sizes && Array.isArray(data.product.data.sizes)) {
            setSizes(data.product.data.sizes);
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details.');
      }
    }

    fetchProductDetails();
  }, [productId]);

  async function generateMockup() {
    if (!selectedColor || !selectedSize) {
      setError('Please select a color and size.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // First find the variant ID
      const variantResponse = await fetch(
        `/api/printful/v2/utils/find-variant?productId=${productId}&color=${selectedColor.name}&size=${selectedSize}`
      );
      const variantData = await variantResponse.json();
      
      if (!variantData.variant) {
        throw new Error('Could not find a matching variant.');
      }
      
      // Generate the mockup
      const mockupResponse = await fetch('/api/printful/v2/mockups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          variantId: variantData.variant.id,
          imageUrl: designImageUrl,
          placement: 'front'
        })
      });
      
      const mockupData = await mockupResponse.json();
      
      if (mockupData.mockups && mockupData.mockups.length > 0) {
        // Get the mockup URL and proxy it
        const mockupUrl = mockupData.mockups[0].mockup_url;
        setMockupImage(getProxiedImageUrl(mockupUrl));
      } else {
        throw new Error('Failed to generate mockup.');
      }
    } catch (err) {
      console.error('Error generating mockup:', err);
      setError(err.message || 'Failed to generate mockup.');
    } finally {
      setLoading(false);
    }
  }

  if (!product) return <div>Loading product...</div>;

  return (
    <div className="mockup-generator">
      <h2>Generate {product.name} Mockup</h2>
      
      <div className="options-container">
        <div className="color-selection">
          <h3>Select Color</h3>
          <div className="color-swatches">
            {colors.map(color => (
              <button
                key={color.name}
                className={`color-swatch ${selectedColor?.name === color.name ? 'selected' : ''}`}
                style={{ backgroundColor: color.code }}
                onClick={() => setSelectedColor(color)}
                aria-label={color.name}
                title={color.name}
              />
            ))}
          </div>
        </div>
        
        <div className="size-selection">
          <h3>Select Size</h3>
          <div className="size-buttons">
            {sizes.map(size => (
              <button
                key={size}
                className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="design-preview">
        <h3>Your Design</h3>
        <img src={designImageUrl} alt="Your design" className="design-image" />
      </div>
      
      <button 
        className="generate-button" 
        onClick={generateMockup}
        disabled={loading || !selectedColor || !selectedSize}
      >
        {loading ? 'Generating...' : 'Generate Mockup'}
      </button>
      
      {error && <div className="error-message">{error}</div>}
      
      {mockupImage && (
        <div className="mockup-result">
          <h3>Generated Mockup</h3>
          <img src={mockupImage} alt="Generated mockup" className="mockup-image" />
        </div>
      )}
    </div>
  );
}
```

## Conclusion

Following these best practices will ensure a robust and performant integration with the Printful API v2. Key takeaways:

1. Always handle the nested data structure correctly
2. Implement proper error handling and type checking
3. Use the image proxy for all Printful CDN images
4. Leverage caching for improved performance
5. Use existing data when possible to minimize API calls

For any questions or issues, refer to the [Printful API v2 Documentation](https://developers.printful.com/docs/) or contact the development team.
