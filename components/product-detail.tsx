import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDesign } from '@/context/design-context';
import { useIsMobile } from '@/hooks/use-mobile';
import { CatalogProduct, CatalogVariant } from '@/lib/printful-api-v2';
import { getProxiedImageUrl } from '@/lib/image-proxy';

interface ProductDetailProps {
  productId: number | null;
  onBack?: () => void;
}

export function ProductDetail({ productId, onBack }: ProductDetailProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { dispatch } = useDesign();
  
  // Fetch product details
  const { 
    data: product, 
    isLoading: isLoadingProduct, 
    error: productError 
  } = useQuery({
    queryKey: ['product-details', productId],
    queryFn: async () => {
      if (!productId) return null;
      
      const response = await fetch(`/api/printful/v2/catalog-products/${productId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch product details');
      }
      
      const data = await response.json();
      return data.product as CatalogProduct;
    },
    enabled: !!productId,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Fetch product variants
  const { 
    data: variantsData, 
    isLoading: isLoadingVariants, 
    error: variantsError 
  } = useQuery({
    queryKey: ['product-variants', productId],
    queryFn: async () => {
      if (!productId) return { variants: [], colors: [], sizes: [] };
      
      const response = await fetch(`/api/printful/v2/catalog-products/${productId}/variants`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch product variants');
      }
      
      const data = await response.json();
      
      // Extract unique colors and sizes
      const colors = new Map<string, { name: string, code: string }>();
      const sizes = new Set<string>();
      
      data.variants.forEach((variant: CatalogVariant) => {
        colors.set(variant.color_code, {
          name: variant.color,
          code: variant.color_code
        });
        
        sizes.add(variant.size);
      });
      
      return {
        variants: data.variants,
        colors: Array.from(colors.values()),
        sizes: Array.from(sizes).sort()
      };
    },
    enabled: !!productId,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Fetch mockup styles
  const { 
    data: mockupStyles, 
    isLoading: isLoadingMockupStyles, 
    error: mockupStylesError 
  } = useQuery({
    queryKey: ['mockup-styles', productId],
    queryFn: async () => {
      if (!productId) return [];
      
      const response = await fetch(`/api/printful/v2/catalog-products/${productId}/mockup-styles`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch mockup styles');
      }
      
      const data = await response.json();
      return data.styles || [];
    },
    enabled: !!productId,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Show error toast if there's an error
  useEffect(() => {
    const error = productError || variantsError || mockupStylesError;
    if (error) {
      toast({
        title: 'Error loading product details',
        description: error instanceof Error ? error.message : 'Could not load product details. Please try again.',
        variant: 'destructive'
      });
    }
  }, [productError, variantsError, mockupStylesError, toast]);
  
  // Reset selected color and size when product changes
  useEffect(() => {
    setSelectedColor(null);
    setSelectedSize(null);
  }, [productId]);
  
  // Handle color selection
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };
  
  // Handle size selection
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };
  
  // Handle product selection
  const handleSelectProduct = () => {
    if (!product) return;
    
    // Find the selected variant
    const selectedVariant = variantsData?.variants.find(
      (v: CatalogVariant) => 
        v.color === selectedColor && 
        v.size === selectedSize
    );
    
    // Set the medium (product)
    dispatch({
      type: 'SET_MEDIUM',
      payload: {
        id: product.id.toString(),
        name: product.name,
        description: product.description || '',
        previewImage: getProxiedImageUrl(product.product_image_url)
      }
    });
    
    // Set the variant if available
    if (selectedVariant) {
      dispatch({
        type: 'SET_VARIANT',
        payload: {
          id: selectedVariant.id,
          name: product.name,
          size: selectedVariant.size,
          color: selectedVariant.color,
          colorCode: selectedVariant.color_code,
          image: getProxiedImageUrl(selectedVariant.variant_image_url)
        }
      });
    }
    
    // Move to the next step
    dispatch({
      type: 'SET_STEP',
      payload: 'style'
    });
  };
  
  // Determine if we can proceed (product, color, and size selected)
  const canProceed = !!product && !!selectedColor && !!selectedSize;
  
  // Loading state
  if (isLoadingProduct || isLoadingVariants) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          {onBack && <Skeleton className="h-10 w-24" />}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            
            <div className="mt-6">
              <Skeleton className="h-6 w-32 mb-3" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-10 rounded-full" />
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <Skeleton className="h-6 w-32 mb-3" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-16" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // No product selected or error state
  if (!product) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-display mb-4 text-white">No Product Selected</h3>
        {onBack && (
          <Button onClick={onBack} variant="outline">
            Back to Products
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-display mb-0 text-white">Product Details</h3>
        {onBack && (
          <Button onClick={onBack} variant="outline" size="sm">
            Back to Products
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Image */}
        <div className="bg-black/30 border border-silverChrome/20 rounded-lg p-4 flex items-center justify-center">
          <img 
            src={getProxiedImageUrl(product.product_image_url)} 
            alt={product.name} 
            className="max-h-full max-w-full object-contain"
          />
        </div>
        
        {/* Product Details */}
        <div className="space-y-4">
          <h2 className="text-2xl font-display text-white">{product.name}</h2>
          <p className="text-silverChrome/80">{product.description}</p>
          
          {/* Print Type */}
          <div className="mt-2">
            <h4 className="text-sm font-medium text-silverChrome mb-1">Print Type:</h4>
            <p className="text-white">
              {product.techniques?.includes('dtf') ? 'All Over Print' : 'Front Image Print'}
            </p>
          </div>
          
          {/* Available Placements */}
          <div className="mt-2">
            <h4 className="text-sm font-medium text-silverChrome mb-1">Available Placements:</h4>
            <ul className="list-disc list-inside text-white">
              {Object.keys(product.available_placements || {}).map(placement => (
                <li key={placement}>
                  {placement} ({product.available_placements[placement].technique})
                </li>
              ))}
            </ul>
          </div>
          
          {/* Colors */}
          {variantsData?.colors && variantsData.colors.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-silverChrome mb-3">Colors:</h4>
              <div className="flex flex-wrap gap-2">
                {variantsData.colors.map(color => (
                  <button
                    key={color.code}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      selectedColor === color.name 
                        ? 'border-neonTeal' 
                        : 'border-silverChrome/20'
                    }`}
                    style={{ backgroundColor: color.code }}
                    onClick={() => handleColorSelect(color.name)}
                    title={color.name}
                  >
                    {selectedColor === color.name && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </button>
                ))}
              </div>
              {selectedColor && (
                <p className="text-sm text-silverChrome mt-2">Selected: {selectedColor}</p>
              )}
            </div>
          )}
          
          {/* Sizes */}
          {variantsData?.sizes && variantsData.sizes.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-silverChrome mb-3">Sizes:</h4>
              <div className="flex flex-wrap gap-2">
                {variantsData.sizes.map(size => (
                  <button
                    key={size}
                    className={`px-3 py-2 rounded border ${
                      selectedSize === size 
                        ? 'bg-neonTeal/20 border-neonTeal text-white' 
                        : 'bg-black/30 border-silverChrome/20 text-silverChrome'
                    }`}
                    onClick={() => handleSizeSelect(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Action Button */}
          <div className="mt-8">
            <Button 
              onClick={handleSelectProduct} 
              disabled={!canProceed}
              className="w-full"
            >
              Select This Product
            </Button>
            {!canProceed && (
              <p className="text-xs text-silverChrome/60 mt-2 text-center">
                Please select a color and size to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
