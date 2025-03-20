import { generateImageWithFalAi, FalAiResponse } from '@/lib/fal-ai-service';
import { enhancePrompt, EnhancedPromptResponse } from '@/lib/prompt-service';
import { supabase } from '@/lib/supabase';

type WallArtStyle = 'minimalist' | 'abstract' | 'landscape';

const styleKeywords: Record<WallArtStyle, string> = {
  'minimalist': 'clean lines, simple composition, negative space, limited color palette',
  'abstract': 'non-representational, geometric shapes, bold colors, expressive',
  'landscape': 'scenic view, horizon, natural elements, atmospheric',
  // Add more styles as needed
};

export async function generateWallArtDesign(
  prompt: string, 
  style: string, 
  dimensions: { width: number, height: number },
  options: { enhancePrompt: boolean, highResolution: boolean }
): Promise<{
    id: any;
    imageUrl: string;
    prompt: string;
    processedPrompt: string;
    style: string;
    dimensions: {
        width: number;
        height: number;
    };
}> {
  // Process and enhance the prompt if requested
  const processedPrompt = options.enhancePrompt 
    ? await enhancePrompt(prompt, style, 'wall-art')
    : addWallArtKeywords(prompt, style as WallArtStyle);
  
  // Configure generation parameters based on wall art needs
  const generationParams = getWallArtParams(style, dimensions, options);
  
  // Generate the image
  const imageResult = await generateImageWithFalAi(processedPrompt, generationParams);
  
  // Process for high-quality printing if needed
  const processedImage = options.highResolution 
    ? await upscaleImage(imageResult.imageUrl)
    : imageResult.imageUrl;
  
  // Save to database
  const designId = await saveWallArtDesign(processedPrompt, processedImage, style, dimensions);
  
  return {
    id: designId,
    imageUrl: processedImage,
    prompt,
    processedPrompt,
    style,
    dimensions
  };
}

function addWallArtKeywords(prompt: string, style: WallArtStyle) {
  // Add specific keywords for wall art based on style
  return `${prompt}, ${styleKeywords[style] || ''}, high quality wall art, home decor, art print`;
}

function getWallArtParams(style: string, dimensions: { width: number; height: number; }, options: { highResolution: boolean; }) {
  // Configure generation parameters specific to wall art
  return {
    guidance_scale: style === 'minimalist' ? 7.0 : 8.0,
    num_inference_steps: options.highResolution ? 50 : 35,
    width: dimensions.width,
    height: dimensions.height,
    // Add style-specific parameters
  };
}

async function saveWallArtDesign(prompt: string, imageUrl: string, style: string, dimensions: { width: number; height: number; }) {
  // Store the design in Supabase
  const { data, error } = await supabase
    .from('wall_art_designs')
    .insert({
      prompt,
      image_url: imageUrl,
      style,
      width: dimensions.width,
      height: dimensions.height,
      created_at: new Date()
    })
    .select('id');
    
  if (error) throw error;
  return data[0].id;
}

async function upscaleImage(imageUrl: string) {
  // Implement image upscaling for high-quality prints
  // This could use another fal.ai endpoint or a different service
  // For now, return the original as placeholder
  return imageUrl;
}
