"use client"

import { createContext, useContext, useReducer, ReactNode } from "react"
import { type Medium } from "@/components/medium-selector"
import { type Style } from "@/components/style-guide-selector"

// Define variant interface
export interface Variant {
  id: number
  name: string
  size: string
  color: string
  colorCode: string
  image: string
}

// Define the state interface
export interface DesignState {
  medium: Medium | null
  variant: Variant | null
  styles: string[]
  complexity: number
  prompt: string
  enhancedPrompt: string | null
  generatedDesign: any | null
  isGenerating: boolean
  isEnhancing: boolean
  placementOption: string
  generationProgress: number
  colorScheme: string
  size: number
  currentStep: 'medium' | 'style' | 'prompt' | 'customize' | 'checkout'
}

// Define the initial state
const initialState: DesignState = {
  medium: null,
  variant: null,
  styles: [],
  complexity: 70,
  prompt: "",
  enhancedPrompt: null,
  generatedDesign: null,
  isGenerating: false,
  isEnhancing: false,
  placementOption: "center",
  generationProgress: 0,
  colorScheme: "original",
  size: 80,
  currentStep: "medium"
}

// Define action types
type DesignAction =
  | { type: "SET_MEDIUM"; payload: Medium | null }
  | { type: "SET_VARIANT"; payload: Variant | null }
  | { type: "TOGGLE_STYLE"; payload: string }
  | { type: "SET_COMPLEXITY"; payload: number }
  | { type: "SET_PROMPT"; payload: string }
  | { type: "SET_ENHANCED_PROMPT"; payload: string | null }
  | { type: "SET_GENERATED_DESIGN"; payload: any }
  | { type: "SET_IS_GENERATING"; payload: boolean }
  | { type: "SET_IS_ENHANCING"; payload: boolean }
  | { type: "SET_PLACEMENT_OPTION"; payload: string }
  | { type: "SET_GENERATION_PROGRESS"; payload: number }
  | { type: "SET_COLOR_SCHEME"; payload: string }
  | { type: "SET_SIZE"; payload: number }
  | { type: "SET_STEP"; payload: 'medium' | 'style' | 'prompt' | 'customize' | 'checkout' }
  | { type: "RESET_DESIGN" }

// Create the reducer function
function designReducer(state: DesignState, action: DesignAction): DesignState {
  switch (action.type) {
    case "SET_MEDIUM":
      return { ...state, medium: action.payload }
    case "SET_VARIANT":
      return { ...state, variant: action.payload }
    case "TOGGLE_STYLE":
      return {
        ...state,
        styles: state.styles.includes(action.payload)
          ? state.styles.filter((id) => id !== action.payload)
          : [...state.styles, action.payload],
      }
    case "SET_COMPLEXITY":
      return { ...state, complexity: action.payload }
    case "SET_PROMPT":
      return { ...state, prompt: action.payload }
    case "SET_ENHANCED_PROMPT":
      return { ...state, enhancedPrompt: action.payload }
    case "SET_GENERATED_DESIGN":
      return { ...state, generatedDesign: action.payload }
    case "SET_IS_GENERATING":
      return { ...state, isGenerating: action.payload }
    case "SET_IS_ENHANCING":
      return { ...state, isEnhancing: action.payload }
    case "SET_PLACEMENT_OPTION":
      return { ...state, placementOption: action.payload }
    case "SET_GENERATION_PROGRESS":
      return { ...state, generationProgress: action.payload }
    case "SET_COLOR_SCHEME":
      return { ...state, colorScheme: action.payload }
    case "SET_SIZE":
      return { ...state, size: action.payload }
    case "SET_STEP":
      return { ...state, currentStep: action.payload }
    case "RESET_DESIGN":
      return {
        ...initialState,
        medium: state.medium, // Preserve the selected medium
        variant: state.variant, // Preserve the selected variant
      }
    default:
      return state
  }
}

// Create the context
interface DesignContextType {
  state: DesignState
  dispatch: React.Dispatch<DesignAction>
}

export const DesignContext = createContext<DesignContextType | undefined>(undefined)

// Create the provider component
interface DesignProviderProps {
  children: ReactNode
}

export function DesignProvider({ children }: DesignProviderProps) {
  const [state, dispatch] = useReducer(designReducer, initialState)

  return <DesignContext.Provider value={{ state, dispatch }}>{children}</DesignContext.Provider>
}

// Create a custom hook for using the context
export function useDesign() {
  const context = useContext(DesignContext)
  if (context === undefined) {
    throw new Error("useDesign must be used within a DesignProvider")
  }
  return context
}
