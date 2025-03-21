import { useQuery } from '@tanstack/react-query';
import { CatalogProduct, CatalogVariant, PrintfulApiError } from '@/lib/printful-api-v2';

/**
 * Custom hook to fetch catalog products by category
 */
export function useCatalogProducts(category: string) {
  return useQuery({
    queryKey: ['catalog-products', category],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/printful/catalog?category=${category}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch products');
        }
        
        const data = await response.json();
        return data.products as CatalogProduct[];
      } catch (error) {
        console.error(`Error fetching products for category ${category}:`, error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Interface for product variants response
 */
export interface ProductVariantsResponse {
  variants: CatalogVariant[];
  colorGroups: Record<string, CatalogVariant[]>;
  sizes: string[];
  colors: {
    name: string;
    code: string;
    image: string;
  }[];
}

/**
 * Custom hook to fetch product variants
 */
export function useProductVariants(productId: number | null) {
  return useQuery<ProductVariantsResponse>({
    queryKey: ['product-variants', productId],
    queryFn: async () => {
      if (!productId) {
        return { variants: [], colorGroups: {}, sizes: [], colors: [] };
      }
      
      try {
        const response = await fetch(`/api/printful/variants?productId=${productId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch variants');
        }
        
        return await response.json();
      } catch (error) {
        console.error(`Error fetching variants for product ${productId}:`, error);
        throw error;
      }
    },
    enabled: !!productId, // Only run the query if productId exists
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Custom hook to fetch product colors
 */
export function useProductColors(productId: number | null) {
  const { data, isLoading, error } = useProductVariants(productId);
  
  return {
    colors: data?.colors || [],
    isLoading,
    error
  };
}

/**
 * Custom hook to fetch product sizes
 */
export function useProductSizes(productId: number | null) {
  const { data, isLoading, error } = useProductVariants(productId);
  
  return {
    sizes: data?.sizes || [],
    isLoading,
    error
  };
}
