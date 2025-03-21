import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Check } from 'lucide-react';
import { useDesign } from '@/context/design-context';
import { useProductVariants } from '@/hooks/use-printful';

interface ProductVariantSelectorProps {
  productId: number;
}

export function ProductVariantSelector({ productId }: ProductVariantSelectorProps) {
  const { state, dispatch } = useDesign();
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const { toast } = useToast();

  // Use TanStack Query to fetch variants
  const { 
    data, 
    isLoading, 
    error,
    isError
  } = useProductVariants(productId);
  
  const variants = data?.variants || [];
  const colors = data?.colors || [];
  const sizes = data?.sizes || [];
  
  // Show error toast if there's an error
  if (isError && error) {
    toast({
      title: 'Error loading variants',
      description: error instanceof Error ? error.message : 'Could not load product variants. Please try again.',
      variant: 'destructive'
    });
  }
  
  // Set default selections when data is loaded
  useEffect(() => {
    if (!isLoading && colors.length > 0 && !selectedColor) {
      setSelectedColor(colors[0].name);
    }
    
    if (!isLoading && sizes.length > 0 && !selectedSize) {
      setSelectedSize(sizes[0]);
    }
  }, [isLoading, colors, sizes, selectedColor, selectedSize]);
  
  // Find the selected variant based on color and size
  const selectedVariant = !isLoading && selectedColor && selectedSize ? 
    variants.find(v => 
      v.color === selectedColor && 
      v.size === selectedSize && 
      v.in_stock
    ) : null;
  
  // Update design context when variant is selected
  useEffect(() => {
    if (selectedVariant) {
      dispatch({
        type: 'SET_VARIANT',
        payload: {
          id: selectedVariant.id,
          name: selectedVariant.name,
          size: selectedVariant.size,
          color: selectedVariant.color,
          colorCode: selectedVariant.color_code,
          image: selectedVariant.variant_image_url
        }
      });
    }
  }, [selectedVariant, dispatch]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-display mb-6 text-white">Customize Product</h3>
        <div className="space-y-4">
          <Skeleton className="h-8 w-full mb-2" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-md" />
            ))}
          </div>
          <Skeleton className="h-8 w-full mb-2" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-16 rounded-md" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // No variants available
  if (variants.length === 0) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-display mb-6 text-white">Customize Product</h3>
        <Card className="bg-black/30 border-silverChrome/20 p-4">
          <p className="text-center text-silverChrome py-4">
            No variants available for this product.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-display mb-6 text-white">Customize Product</h3>
      
      <div className="space-y-6">
        {/* Color selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-silverChrome">
            Color: <span className="text-white">{selectedColor}</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {colors.map(color => (
              <button
                key={color.name}
                className={`relative w-12 h-12 rounded-md transition-all ${
                  selectedColor === color.name ? 'ring-2 ring-neonTeal' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: color.code !== '#FFFFFF' ? color.code : '#F5F5F5' }}
                onClick={() => setSelectedColor(color.name)}
                title={color.name}
              >
                {selectedColor === color.name && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className={`h-5 w-5 ${color.code === '#FFFFFF' || color.code === '#F5F5F5' ? 'text-black' : 'text-white'} drop-shadow-lg`} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Size selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-silverChrome">
            Size: <span className="text-white">{selectedSize}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {sizes.map(size => {
              // Check if this size is available in the selected color
              const isAvailable = variants.some(
                v => v.color === selectedColor && v.size === size && v.in_stock
              );
              
              return (
                <button
                  key={size}
                  className={`px-4 py-2 rounded-md transition-all ${
                    !isAvailable 
                      ? 'bg-black/20 text-silverChrome/40 cursor-not-allowed border border-silverChrome/10' 
                      : selectedSize === size
                        ? 'bg-neonTeal/20 border border-neonTeal text-white'
                        : 'border border-silverChrome/30 text-silverChrome hover:border-white/60 hover:text-white'
                  }`}
                  onClick={() => {
                    if (isAvailable) setSelectedSize(size);
                  }}
                  disabled={!isAvailable}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Selected variant preview */}
        {selectedVariant && (
          <Card className="bg-black/30 border-silverChrome/20 overflow-hidden">
            <div className="aspect-square w-full bg-black/20 p-4 flex items-center justify-center">
              <img 
                src={selectedVariant.variant_image_url} 
                alt={selectedVariant.name} 
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <CardContent className="p-4">
              <h4 className="font-medium text-white">{selectedVariant.name}</h4>
              <p className="text-sm text-silverChrome mt-1">
                {selectedVariant.color} / {selectedVariant.size}
              </p>
              
              <Button 
                variant="cosmic" 
                className="w-full mt-4"
                onClick={() => {
                  dispatch({ type: 'SET_STEP', payload: 'prompt' });
                  toast({
                    title: 'Product selected',
                    description: `${selectedVariant.name} in ${selectedVariant.color}, size ${selectedVariant.size}`,
                  });
                }}
              >
                Continue with Selection
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
