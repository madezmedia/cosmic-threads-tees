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
    'geometric', 'uncluttered', 'elegant', 'modern', 'subtle', 'refined',
    'monochromatic', 'balanced', 'essential', 'pure', 'understated'
  ],
  'abstract': [
    'non-representational', 'geometric shapes', 'bold colors', 'expressive',
    'dynamic', 'emotional', 'vibrant', 'textured', 'fluid', 'energetic',
    'conceptual', 'non-figurative', 'avant-garde', 'experimental', 'free-form'
  ],
  'landscape': [
    'scenic view', 'horizon', 'natural elements', 'atmospheric', 'panoramic',
    'serene', 'expansive', 'detailed', 'realistic', 'environmental',
    'picturesque', 'tranquil', 'majestic', 'idyllic', 'naturalistic'
  ],
  'retro': [
    'vintage', 'nostalgic', 'old-school', 'classic', 'throwback',
    'mid-century', 'retro-futuristic', 'analog', 'distressed', 'aged',
    'retro-tech', 'vintage typography', 'halftone', 'weathered', 'antique'
  ],
  'space': [
    'cosmic', 'galactic', 'stellar', 'nebula', 'astronomical',
    'interstellar', 'planetary', 'celestial', 'sci-fi', 'otherworldly',
    'cosmos', 'astral', 'starfield', 'deep space', 'extraterrestrial'
  ],
  'neon': [
    'glowing', 'vibrant', 'fluorescent', 'bright', 'luminous',
    'electric', 'cyberpunk', 'synthwave', 'vaporwave', 'high-contrast',
    'ultraviolet', 'blacklight', 'radiant', 'iridescent', 'phosphorescent'
  ],
  'retrofuture': [
    'retro sci-fi', 'atomic age', 'space age', 'futuristic vintage', 'raygun gothic',
    'atompunk', 'dieselpunk', 'cassette futurism', 'analog tech', 'retrofuturistic',
    'pulp sci-fi', 'retro-tech', 'future past', 'tomorrow yesterday', 'retro space'
  ],
  'cosmic': [
    'celestial', 'galactic', 'universal', 'astral', 'cosmic energy',
    'star clusters', 'cosmic dust', 'nebulae', 'cosmic rays', 'constellation',
    'cosmic glow', 'interstellar', 'cosmic patterns', 'cosmic balance', 'cosmic harmony'
  ],
  'psychedelic': [
    'trippy', 'kaleidoscopic', 'hallucinatory', 'mind-bending', 'surreal',
    'fractal', 'hypnotic', 'visionary', 'acid art', 'consciousness expanding',
    'optical illusion', 'dreamlike', 'swirling', 'vibrant colors', 'distorted reality'
  ],
};

// Product-specific keywords to enhance prompts
const productKeywords: Record<string, string[]> = {
  'wall-art': [
    'high quality art print', 'home decor', 'wall hanging', 'framed artwork',
    'gallery quality', 'fine art', 'decorative', 'statement piece', 'wall display',
    'interior design', 'art collection', 'wall feature', 'conversation piece', 'visual focal point'
  ],
  't-shirt': [
    'wearable art', 'graphic tee', 'apparel design', 'screen print style',
    'fashion forward', 'trendy', 'casual wear', 'clothing graphic', 'textile design',
    'streetwear', 'fabric print', 'garment design', 'fashion statement', 'wearable graphic'
  ],
  'poster': [
    'bold typography', 'visual impact', 'promotional', 'eye-catching',
    'large format', 'advertising', 'announcement', 'informative', 'striking',
    'wall poster', 'print design', 'visual communication', 'graphic design', 'poster art'
  ],
  'hoodie': [
    'comfortable apparel', 'casual outerwear', 'streetwear graphic', 'urban fashion',
    'cozy clothing', 'sweatshirt design', 'hood graphic', 'casual style', 'layered look',
    'front print', 'back print', 'sleeve design', 'fashion statement', 'trendy outerwear'
  ],
  'mug': [
    'drinkware design', 'ceramic surface', 'coffee cup art', 'beverage container',
    'wrap-around print', 'handle design', 'kitchen accessory', 'gift item', 'daily use item',
    'functional art', 'beverage holder', 'morning coffee', 'desk accessory', 'conversation starter'
  ],
  'phone-case': [
    'device protection', 'slim profile', 'tech accessory', 'phone cover',
    'protective case', 'mobile design', 'smartphone art', 'tech fashion', 'gadget style',
    'personal accessory', 'everyday carry', 'tech customization', 'device skin', 'phone shell'
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
