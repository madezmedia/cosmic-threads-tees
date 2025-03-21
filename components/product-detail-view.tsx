"use client";

import { useState, useEffect } from "react";
import { proxyPrintfulImages, getProxiedImageUrl } from "@/lib/image-proxy";

interface ProductDetailViewProps {
  productId: number;
  designImageUrl?: string;
  onVariantSelect?: (variantId: number) => void;
}

interface Color {
  name: string;
  code: string;
}

interface MockupStyle {
  id: number;
  name: string;
  preview_url?: string;
}

export default function ProductDetailView({
  productId,
  designImageUrl,
  onVariantSelect,
}: ProductDetailViewProps) {
  const [product, setProduct] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [mockupStyles, setMockupStyles] = useState<MockupStyle[]>([]);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedMockupStyle, setSelectedMockupStyle] = useState<MockupStyle | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [mockupUrl, setMockupUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product details when productId changes
  useEffect(() => {
    if (!productId) return;
    
    setIsLoading(true);
    setError(null);
    
    const fetchProductDetails = async () => {
      try {
        // Fetch product details
        const productResponse = await fetch(`/api/printful/v2/catalog-products/${productId}`);
        const productData = await productResponse.json();
        
        if (!productResponse.ok) {
          throw new Error(productData.message || "Failed to fetch product details");
        }
        
        if (productData.product) {
          setProduct(productData.product);
          
          // Fetch variants
          await fetchVariants(productId);
          
          // Fetch colors
          await fetchColors(productId);
          
          // Fetch sizes
          await fetchSizes(productId);
          
          // Fetch mockup styles
          await fetchMockupStyles(productId);
        } else {
          throw new Error("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [productId]);

  // Fetch variants
  const fetchVariants = async (id: number) => {
    try {
      const response = await fetch(`/api/printful/v2/catalog-products/${id}/variants`);
      const data = await response.json();
      
      if (data.variants) {
        setVariants(data.variants);
      }
    } catch (err) {
      console.error("Error fetching variants:", err);
    }
  };

  // Fetch colors
  const fetchColors = async (id: number) => {
    try {
      const response = await fetch(`/api/printful/v2/utils/product-colors?productId=${id}`);
      const data = await response.json();
      
      if (data.colors) {
        setColors(data.colors);
        // Select the first color by default
        if (data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }
      }
    } catch (err) {
      console.error("Error fetching colors:", err);
    }
  };

  // Fetch sizes
  const fetchSizes = async (id: number) => {
    try {
      const response = await fetch(`/api/printful/v2/utils/product-sizes?productId=${id}`);
      const data = await response.json();
      
      if (data.sizes) {
        setSizes(data.sizes);
        // Select the first size by default
        if (data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      }
    } catch (err) {
      console.error("Error fetching sizes:", err);
    }
  };

  // Fetch mockup styles
  const fetchMockupStyles = async (id: number) => {
    try {
      const response = await fetch(`/api/printful/v2/catalog-products/${id}/mockup-styles`);
      const data = await response.json();
      
      if (data.styles) {
        setMockupStyles(data.styles);
      }
    } catch (err) {
      console.error("Error fetching mockup styles:", err);
    }
  };

  // Find variant based on selected color and size
  const findVariant = async () => {
    if (!product || !selectedColor || !selectedSize) {
      return null;
    }
    
    try {
      const response = await fetch(
        `/api/printful/v2/utils/find-variant?productId=${product.id}&color=${selectedColor.name}&size=${selectedSize}`
      );
      const data = await response.json();
      
      if (data.variant) {
        setSelectedVariant(data.variant);
        if (onVariantSelect) {
          onVariantSelect(data.variant.id);
        }
        return data.variant;
      }
    } catch (err) {
      console.error("Error finding variant:", err);
    }
    
    return null;
  };

  // Generate mockup
  const generateMockup = async () => {
    if (!designImageUrl) {
      setError("Design image URL is required");
      return;
    }
    
    const variant = await findVariant();
    
    if (!variant) {
      setError("Please select a color and size first");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const payload = {
        productId: product.id,
        variantId: variant.id,
        imageUrl: designImageUrl,
        placement: "front",
        mockupStyleId: selectedMockupStyle ? selectedMockupStyle.id : undefined,
      };
      
      const response = await fetch("/api/printful/v2/mockups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to generate mockup");
      }
      
      if (data.mockups && data.mockups.length > 0) {
        // Get the original mockup
        const mockup = data.mockups[0];
        
        // Process the mockup to proxy all image URLs
        const processedMockup = proxyPrintfulImages(mockup);
        
        // Make sure we have a valid mockup URL
        const mockupUrl = processedMockup.mockup_url || mockup.mockup_url;
        
        // Apply the proxy directly to ensure we have a valid URL
        const proxiedUrl = typeof mockupUrl === 'string' 
          ? getProxiedImageUrl(mockupUrl) 
          : '';
        
        // Set the mockup URL
        setMockupUrl(proxiedUrl);
        
        // Log for debugging
        console.log('Original mockup URL:', mockup.mockup_url);
        console.log('Processed mockup URL:', mockupUrl);
        console.log('Final proxied URL:', proxiedUrl);
      } else {
        throw new Error("No mockups generated");
      }
    } catch (err) {
      console.error("Error generating mockup:", err);
      setError(err instanceof Error ? err.message : "Failed to generate mockup");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle color selection
  const handleColorSelect = (color: Color) => {
    setSelectedColor(color);
    setMockupUrl(""); // Clear mockup when color changes
  };

  // Handle size selection
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setMockupUrl(""); // Clear mockup when size changes
  };

  // Handle mockup style selection
  const handleMockupStyleSelect = (style: MockupStyle) => {
    setSelectedMockupStyle(style);
    setMockupUrl(""); // Clear mockup when style changes
  };

  // Effect to generate mockup when all required fields are selected and designImageUrl is provided
  useEffect(() => {
    if (product && selectedColor && selectedSize && designImageUrl) {
      generateMockup();
    }
  }, [product, selectedColor, selectedSize, selectedMockupStyle, designImageUrl]);

  if (isLoading && !product) {
    return <div className="p-4">Loading product details...</div>;
  }

  if (error && !product) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!product) {
    return <div className="p-4">No product found</div>;
  }

  return (
    <div className="product-detail-view">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Information */}
        <div>
          <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
          <p className="mb-4">{product.description}</p>
          
          {/* Available Placements */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Available Placements</h3>
            <ul className="list-disc pl-5">
              {Object.keys(product.available_placements || {}).map((placement) => (
                <li key={placement}>
                  {placement} ({product.available_placements[placement].technique})
                </li>
              ))}
            </ul>
          </div>
          
          {/* Color Selection */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Colors</h3>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color.name}
                  className={`w-8 h-8 rounded-full border ${
                    selectedColor?.name === color.name
                      ? "border-2 border-purple-500"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color.code }}
                  title={color.name}
                  onClick={() => handleColorSelect(color)}
                  aria-label={`Select color: ${color.name}`}
                />
              ))}
            </div>
            {selectedColor && (
              <p className="mt-2 text-sm">Selected: {selectedColor.name}</p>
            )}
          </div>
          
          {/* Size Selection */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Size</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`px-3 py-1 border rounded ${
                    selectedSize === size
                      ? "bg-purple-500 text-white"
                      : "bg-white text-gray-800"
                  }`}
                  onClick={() => handleSizeSelect(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          {/* Mockup Style Selection */}
          {mockupStyles.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Mockup Style</h3>
              <select
                className="w-full p-2 border rounded"
                value={selectedMockupStyle?.id || ""}
                onChange={(e) => {
                  const styleId = parseInt(e.target.value);
                  const style = mockupStyles.find((s) => s.id === styleId) || null;
                  handleMockupStyleSelect(style as MockupStyle);
                }}
              >
                <option value="">Default style</option>
                {mockupStyles.map((style) => (
                  <option key={style.id} value={style.id}>
                    {style.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* Generate Mockup Button */}
          {!designImageUrl && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">
                A design image URL is required to generate a mockup.
              </p>
            </div>
          )}
        </div>
        
        {/* Mockup Preview */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Product Preview</h3>
          <div className="border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center min-h-[300px]">
            {isLoading && (
              <div className="text-center p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-2"></div>
                <p>Generating mockup...</p>
              </div>
            )}
            
            {!isLoading && mockupUrl && (
              <img
                src={mockupUrl}
                alt="Product mockup"
                className="max-w-full h-auto"
              />
            )}
            
            {!isLoading && !mockupUrl && (
              <div className="text-center p-4 text-gray-500">
                {designImageUrl
                  ? "Select options to generate a mockup"
                  : "Provide a design image to see a mockup"}
              </div>
            )}
          </div>
          
          {error && (
            <div className="mt-2 text-red-500 text-sm">{error}</div>
          )}
          
          {selectedVariant && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Selected Variant</h3>
              <p>
                <strong>ID:</strong> {selectedVariant.id}
              </p>
              <p>
                <strong>Name:</strong> {selectedVariant.name}
              </p>
              <p>
                <strong>Price:</strong> ${selectedVariant.retail_price}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
