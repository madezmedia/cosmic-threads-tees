import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDesign } from '@/context/design-context';
import { useIsMobile } from '@/hooks/use-mobile';
import { CatalogProduct } from '@/lib/printful-api-v2';
import { useCatalogProducts } from '@/hooks/use-printful';

interface Product extends CatalogProduct {}

const CATEGORIES = [
  { id: 't-shirts', name: 'T-Shirts' },
  { id: 'wall-art', name: 'Wall Art' },
  { id: 'accessories', name: 'Accessories' }
];

export function ProductCategorySelector() {
  const { dispatch } = useDesign();
  const [activeCategory, setActiveCategory] = useState('t-shirts');
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Use TanStack Query to fetch products
  const { 
    data: products = [], 
    isLoading, 
    error,
    isError
  } = useCatalogProducts(activeCategory);
  
  // Show error toast if there's an error
  if (isError && error) {
    toast({
      title: 'Error loading products',
      description: error instanceof Error ? error.message : 'Could not load products. Please try again.',
      variant: 'destructive'
    });
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const handleSelectProduct = (product: Product) => {
    dispatch({
      type: 'SET_MEDIUM',
      payload: {
        id: product.id.toString(),
        name: product.name,
        description: product.description || '',
        previewImage: product.product_image_url
      }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-display mb-6 text-white">Select a Product</h3>
      
      <Tabs value={activeCategory} onValueChange={handleCategoryChange} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8 bg-deepSpace/50 border border-silverChrome/20">
          {CATEGORIES.map(category => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="font-mono text-sm uppercase tracking-wider data-[state=active]:bg-gradient-to-r data-[state=active]:from-cosmicPurple data-[state=active]:to-magentaGlow"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeCategory} className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="bg-black/30 border-silverChrome/20">
                  <div className="aspect-square w-full bg-black/40">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <CardContent className="p-4">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {products.length === 0 ? (
                <div className="text-center py-8 text-silverChrome">
                  No products found in this category.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map(product => (
                    <Card 
                      key={product.id} 
                      className="bg-black/30 border-silverChrome/20 cursor-pointer transition-all hover:border-neonTeal/40"
                      onClick={() => handleSelectProduct(product)}
                    >
                      <div className={`aspect-square w-full bg-black/40 p-4 flex items-center justify-center`}>
                        <img 
                          src={product.product_image_url} 
                          alt={product.name} 
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-medium text-white truncate">{product.name}</h4>
                        <p className="text-xs text-silverChrome/60 mt-1">
                          {product.techniques?.join(', ') || ''}
                        </p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full mt-3 border border-silverChrome/20 hover:bg-neonTeal/10 hover:text-white"
                        >
                          Select
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
