"use client"

import { useDesign } from "@/context/design-context"
import UnifiedSelector, { SelectionOption } from "@/components/unified-selector"

export default function ProductSelector() {
  const { state, dispatch } = useDesign()
  const { medium } = state

  // These would ideally come from an API or database
  const products: SelectionOption[] = [
    {
      id: "tshirt",
      name: "T-Shirt",
      description: "Classic, comfortable cotton tees perfect for showcasing your unique AI-generated designs.",
      previewImage: "/placeholder.svg?height=300&width=400&text=T-Shirt",
    },
    {
      id: "wallart",
      name: "Wall Art",
      description: "Transform your space with custom wall art featuring your AI-generated designs.",
      previewImage: "/placeholder.svg?height=300&width=400&text=Wall+Art",
    },
    {
      id: "hoodie",
      name: "Hoodie",
      description: "Cozy, premium hoodies that make your AI-generated designs stand out.",
      previewImage: "/placeholder.svg?height=300&width=400&text=Hoodie",
    },
    {
      id: "mug",
      name: "Mug",
      description: "Start your day with a custom mug featuring your unique AI-generated design.",
      previewImage: "/placeholder.svg?height=300&width=400&text=Mug",
    },
  ]

  const handleProductSelect = (id: string) => {
    const selectedProduct = products.find((product) => product.id === id)
    
    // Convert SelectionOption to Medium (ensuring description is always a string)
    if (selectedProduct) {
      const medium = {
        id: selectedProduct.id,
        name: selectedProduct.name,
        description: selectedProduct.description || "", // Ensure description is always a string
        previewImage: selectedProduct.previewImage,
      }
      dispatch({ type: "SET_MEDIUM", payload: medium })
    } else {
      dispatch({ type: "SET_MEDIUM", payload: null })
    }
  }

  return (
    <UnifiedSelector
      title="SELECT YOUR PRODUCT"
      description="Choose the product you want to customize with your AI-generated design."
      options={products}
      selectedIds={medium ? [medium.id] : []}
      onSelect={handleProductSelect}
      multiSelect={false}
      gridCols={2}
    />
  )
}
