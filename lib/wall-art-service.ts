import { generateImageWithFalAi, upscaleImage, FalAiResponse, FalAiGenerationParams } from '@/lib/fal-ai-service';
import { enhancePrompt, analyzePrompt } from '@/lib/prompt-service';
import { supabase } from '@/lib/supabase';

// Define available wall art styles
export type WallArtStyle = 'minimalist' | 'abstract' | 'landscape' | 'retro' | 'space' | 'neon';

// Style-specific generation parameters
const styleParams: Record<string, Partial<FalAiGenerationParams>> = {
  'minimalist': {
    guidance_scale: 7.0,
    negative_prompt: 'busy, cluttered, chaotic, detailed, complex, noisy, ornate, low quality',
  },
  'abstract': {
    guidance_scale: 8.0,
    negative_prompt: 'realistic, photographic, figurative, representational, low quality',
  },
  'landscape': {
    guidance_scale: 7.5,
    negative_prompt: 'people, portraits, text, words, letters, low quality, blurry',
  },
  'retro': {
    guidance_scale: 7.8,
    negative_prompt: 'modern, contemporary, digital, low quality',
  },
  'space': {
    guidance_scale: 8.2,
    negative_prompt: 'earth-bound, terrestrial, mundane, low quality',
  },
  'neon': {
    guidance_scale: 8.0,
    negative_prompt: 'dull, muted, pastel, low contrast, low quality',
  },
};

// Interface for wall art design options
export interface WallArtOptions {
  enhancePrompt: boolean;
  highResolution: boolean;
  aspectRatio?: string;
  colorScheme?: string;
}

// Interface for wall art design result
export interface WallArtDesignResult {
  id: string;
  imageUrl: string;
  prompt: string;
  processedPrompt: string;
  style: string;
  dimensions: {
    width: number;
    height: number;
  };
  metadata?: Record<string, any>;
}

/**
 * Generates a wall art design based on the provided prompt and options
 * 
 * @param prompt The user's text prompt
 * @param style The selected art style
 * @param dimensions The dimensions of the artwork
 * @param options Additional generation options
 * @returns The generated wall art design
 */
export async function generateWallArtDesign(
  prompt: string, 
  style: string, 
  dimensions: { width: number, height: number },
  options: WallArtOptions
): Promise<WallArtDesignResult> {
  try {
    console.log(`Generating wall art design for prompt: "${prompt}", style: ${style}`);
    
    // Process and enhance the prompt if requested
    const processedPrompt = options.enhancePrompt 
      ? await enhancePrompt(prompt, style, 'wall-art')
      : prompt;
    
    // Configure generation parameters based on wall art needs
    const generationParams = getWallArtParams(style, dimensions, options);
    
    // Generate the image
    const imageResult = await generateImageWithFalAi(processedPrompt, generationParams);
    
    // Process for high-quality printing if needed
    const processedImage = options.highResolution && imageResult.imageUrl
      ? await upscaleImage(imageResult.imageUrl, 2)
      : imageResult.imageUrl;
    
    // Save to database
    const designId = await saveWallArtDesign(
      processedPrompt, 
      processedImage, 
      style, 
      dimensions,
      {
        originalPrompt: prompt,
        generationParams,
        metadata: imageResult.metadata,
      }
    );
    
    return {
      id: designId,
      imageUrl: processedImage,
      prompt,
      processedPrompt,
      style,
      dimensions,
      metadata: {
        ...imageResult.metadata,
        seed: imageResult.seed,
        modelId: imageResult.modelId,
      }
    };
  } catch (error) {
    console.error('Error generating wall art design:', error);
    throw error;
  }
}

/**
 * Gets generation parameters specific to wall art and the selected style
 * 
 * @param style The selected art style
 * @param dimensions The dimensions of the artwork
 * @param options Additional generation options
 * @returns Parameters for the image generation
 */
function getWallArtParams(
  style: string, 
  dimensions: { width: number; height: number; }, 
  options: WallArtOptions
): FalAiGenerationParams {
  // Get style-specific parameters
  const styleSpecificParams = styleParams[style.toLowerCase()] || {};
  
  // Determine image size based on aspect ratio
  let imageSize = 'landscape_4_3';
  if (dimensions.width === dimensions.height) {
    imageSize = 'square_1_1';
  } else if (dimensions.width > dimensions.height) {
    imageSize = dimensions.width / dimensions.height >= 1.9 
      ? 'landscape_16_9' 
      : 'landscape_4_3';
  } else {
    imageSize = dimensions.height / dimensions.width >= 1.9
      ? 'portrait_9_16'
      : 'portrait_3_4';
  }
  
  // Configure generation parameters specific to wall art
  return {
    ...styleSpecificParams,
    num_inference_steps: options.highResolution ? 50 : 35,
    image_size: imageSize,
    seed: Math.floor(Math.random() * 1000000),
  };
}

/**
 * Saves a wall art design to the database
 * 
 * @param prompt The processed prompt
 * @param imageUrl The URL of the generated image
 * @param style The selected art style
 * @param dimensions The dimensions of the artwork
 * @param metadata Additional metadata about the design
 * @returns The ID of the saved design
 */
async function saveWallArtDesign(
  prompt: string, 
  imageUrl: string, 
  style: string, 
  dimensions: { width: number; height: number; },
  metadata?: Record<string, any>
): Promise<string> {
  try {
    // Store the design in Supabase
    const { data, error } = await supabase
      .from('wall_art_designs')
      .insert({
        prompt,
        image_url: imageUrl,
        style,
        width: dimensions.width,
        height: dimensions.height,
        created_at: new Date(),
        metadata: metadata || {},
      })
      .select('id');
      
    if (error) throw error;
    
    if (!data || data.length === 0) {
      throw new Error('Failed to save wall art design: No data returned');
    }
    
    return data[0].id;
  } catch (error) {
    console.error('Error saving wall art design:', error);
    throw error;
  }
}

/**
 * Gets available wall art styles with their descriptions
 * 
 * @returns An array of available styles with descriptions
 */
export function getWallArtStyles(): Array<{ id: string; name: string; description: string }> {
  return [
    {
      id: 'minimalist',
      name: 'Minimalist',
      description: 'Clean lines and simple compositions with limited color palettes',
    },
    {
      id: 'abstract',
      name: 'Abstract',
      description: 'Non-representational designs with bold colors and expressive shapes',
    },
    {
      id: 'landscape',
      name: 'Landscape',
      description: 'Scenic views with natural elements and atmospheric qualities',
    },
    {
      id: 'retro',
      name: 'Retro',
      description: 'Vintage-inspired designs with nostalgic elements and classic aesthetics',
    },
    {
      id: 'space',
      name: 'Space',
      description: 'Cosmic imagery featuring galaxies, nebulae, and celestial objects',
    },
    {
      id: 'neon',
      name: 'Neon',
      description: 'Vibrant, glowing designs with high contrast and cyberpunk influences',
    },
  ];
}

/**
 * Generates a mockup of the wall art in a room setting
 * 
 * @param designImageUrl URL of the generated design image
 * @param productId The product ID
 * @param variantId The variant ID
 * @returns Object containing mockup URLs and metadata
 */
export async function generateWallArtMockup(
  designImageUrl: string,
  productId: number,
  variantId: number
): Promise<{ mockups: Array<{ mockup_url: string }> }> {
  try {
    console.log(`Generating wall art mockup for design: ${designImageUrl}, product: ${productId}, variant: ${variantId}`);
    
    // For now, we'll return mock data since we don't have the actual implementation
    // In a real implementation, this would call a service to generate mockups
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return mock data
    return {
      mockups: [
        {
          mockup_url: 'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
        },
        {
          mockup_url: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1587&q=80',
        },
        {
          mockup_url: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80',
        }
      ]
    };
  } catch (error) {
    console.error('Error generating wall art mockup:', error);
    throw error;
  }
}
