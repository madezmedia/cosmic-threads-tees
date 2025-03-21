'use client';

import { useState } from "react";
import { useDesign } from "@/context/design-context";
import { ProductCategorySelector } from "@/components/product-category-selector";
import { ProductVariantSelector } from "@/components/product-variant-selector";

export function ConceptStep() {
  const { state } = useDesign();
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-display font-bold mb-4 text-gradient bg-gradient-to-r from-cosmicPurple to-magentaGlow bg-clip-text text-transparent">
        1. Select Your Product
      </h2>
      
      {state.medium ? (
        <ProductVariantSelector productId={parseInt(state.medium.id)} />
      ) : (
        <ProductCategorySelector />
      )}
    </div>
  );
}
