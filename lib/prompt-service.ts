export interface EnhancedPromptResponse {
  enhancedPrompt: string;
  originalPrompt: string;
  style: string;
  productType: string;
  keywords: string[];
}

// Style-specific keywords to enhance prompts
const styleKeywords: Record<string, string[]> = {
  'minimalist': [
    'clean lines', 'simple composition', 'negative space', 'limited color palette',
    'geometric', 'uncluttered', 'elegant', 'modern', 'subtle', 'refined'
  ],
  'abstract': [
    'non-representational', 'geometric shapes', 'bold colors', 'expressive',
    'dynamic', 'emotional', 'vibrant', 'textured', 'fluid', 'energetic'
  ],
  'landscape': [
    'scenic view', 'horizon', 'natural elements', 'atmospheric', 'panoramic',
    'serene', 'expansive', 'detailed', 'realistic', 'environmental'
  ],
  'retro': [
    'vintage', 'nostalgic', 'old-school', 'classic', 'throwback',
    'mid-century', 'retro-futuristic', 'analog', 'distressed', 'aged'
  ],
  'space': [
    'cosmic', 'galactic', 'stellar', 'nebula', 'astronomical',
    'interstellar', 'planetary', 'celestial', 'sci-fi', 'otherworldly'
  ],
  'neon': [
    'glowing', 'vibrant', 'fluorescent', 'bright', 'luminous',
    'electric', 'cyberpunk', 'synthwave', 'vaporwave', 'high-contrast'
  ],
};

// Product-specific keywords to enhance prompts
const productKeywords: Record<string, string[]> = {
  'wall-art': [
    'high quality art print', 'home decor', 'wall hanging', 'framed artwork',
    'gallery quality', 'fine art', 'decorative', 'statement piece', 'wall display'
  ],
  't-shirt': [
    'wearable art', 'graphic tee', 'apparel design', 'screen print style',
    'fashion forward', 'trendy', 'casual wear', 'clothing graphic', 'textile design'
  ],
  'poster': [
    'bold typography', 'visual impact', 'promotional', 'eye-catching',
    'large format', 'advertising', 'announcement', 'informative', 'striking'
  ],
};

/**
 * Enhances a user prompt with style-specific and product-specific keywords
 * to improve AI image generation results
 * 
 * @param prompt The original user prompt
 * @param style The selected style for the design
 * @param productType The type of product being designed
 * @returns An enhanced prompt optimized for better AI generation results
 */
export async function enhancePrompt(
  prompt: string, 
  style: string, 
  productType: string
): Promise<string> {
  console.log(`Enhancing prompt: ${prompt} for style: ${style} and product type: ${productType}`);
  
  // Get style keywords (default to empty array if style not found)
  const styleWords = styleKeywords[style.toLowerCase()] || [];
  
  // Get product keywords (default to empty array if product type not found)
  const productWords = productKeywords[productType.toLowerCase()] || [];
  
  // Select a subset of keywords to avoid overly long prompts
  const selectedStyleWords = getRandomElements(styleWords, 3);
  const selectedProductWords = getRandomElements(productWords, 2);
  
  // Combine all keywords
  const allKeywords = [...selectedStyleWords, ...selectedProductWords];
  
  // Create enhanced prompt
  let enhancedPrompt = prompt.trim();
  
  // Add style descriptor if not already in the prompt
  if (!prompt.toLowerCase().includes(style.toLowerCase())) {
    enhancedPrompt += `, ${style} style`;
  }
  
  // Add keywords
  if (allKeywords.length > 0) {
    enhancedPrompt += `, ${allKeywords.join(', ')}`;
  }
  
  // Add quality boosters
  enhancedPrompt += ', high quality, detailed, professional';
  
  return enhancedPrompt;
}

/**
 * Gets a random subset of elements from an array
 * 
 * @param array The array to select from
 * @param count The number of elements to select
 * @returns A new array with randomly selected elements
 */
function getRandomElements<T>(array: T[], count: number): T[] {
  if (count >= array.length) return [...array];
  
  const result: T[] = [];
  const copyArray = [...array];
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * copyArray.length);
    result.push(copyArray[randomIndex]);
    copyArray.splice(randomIndex, 1);
  }
  
  return result;
}

/**
 * Analyzes a prompt to suggest improvements or alternatives
 * 
 * @param prompt The prompt to analyze
 * @returns Suggestions for improving the prompt
 */
export function analyzePrompt(prompt: string): string[] {
  const suggestions: string[] = [];
  
  // Check prompt length
  if (prompt.length < 10) {
    suggestions.push('Consider adding more details to your prompt for better results.');
  }
  
  // Check for vague terms
  const vagueTerms = ['nice', 'good', 'cool', 'awesome', 'great'];
  for (const term of vagueTerms) {
    if (prompt.toLowerCase().includes(term)) {
      suggestions.push(`Replace "${term}" with more specific descriptors.`);
    }
  }
  
  // Check for color mentions
  if (!hasColorTerms(prompt)) {
    suggestions.push('Consider specifying colors for more control over the result.');
  }
  
  return suggestions;
}

/**
 * Checks if a prompt contains color terms
 * 
 * @param prompt The prompt to check
 * @returns Whether the prompt contains color terms
 */
function hasColorTerms(prompt: string): boolean {
  const colorTerms = [
    'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink',
    'black', 'white', 'gray', 'brown', 'teal', 'cyan', 'magenta',
    'gold', 'silver', 'bronze', 'colorful', 'monochrome'
  ];
  
  return colorTerms.some(color => prompt.toLowerCase().includes(color));
}
