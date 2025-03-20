import { fal } from './fal-client';

export interface FalAiResponse {
  imageUrl: string;
  seed?: number;
  modelId?: string;
  metadata?: Record<string, any>;
}

export interface FalAiGenerationParams {
  guidance_scale?: number;
  num_inference_steps?: number;
  width?: number;
  height?: number;
  seed?: number;
  image_size?: string;
  style?: string;
  negative_prompt?: string;
  num_images?: number;
}

/**
 * Generates an image using the fal.ai API with retry capability
 * 
 * @param prompt The text prompt to generate an image from
 * @param params Additional parameters for the generation
 * @param maxRetries Maximum number of retries on failure (default: 2)
 * @returns A promise that resolves to the generated image URL and metadata
 */
export async function generateImageWithFalAi(
  prompt: string, 
  params: FalAiGenerationParams, 
  maxRetries: number = 2
): Promise<FalAiResponse> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Generating image with fal.ai for prompt: ${prompt} (Attempt ${attempt + 1}/${maxRetries + 1})`);
      
      // Default model to use
      const modelId = 'fal-ai/flux/dev';
      
      // Prepare the input parameters
      const input = {
        prompt: prompt,
        seed: params.seed || Math.floor(Math.random() * 1000000),
        image_size: params.image_size || 'landscape_4_3',
        num_images: params.num_images || 1,
        guidance_scale: params.guidance_scale || 7.5,
        num_inference_steps: params.num_inference_steps || 40,
        negative_prompt: params.negative_prompt || 'low quality, blurry, distorted, deformed, disfigured, text, watermark, signature',
      };
      
      // Call the fal.ai API with timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out')), 30000); // 30 second timeout
      });
      
      const apiPromise = fal.subscribe(modelId, {
        input,
        logs: true,
      });
      
      // Race between the API call and the timeout
      const result = await Promise.race([apiPromise, timeoutPromise]) as any;
      
      // Extract the image URL from the response
      const falResponse = result.data as any;
      
      if (!falResponse.images || falResponse.images.length === 0) {
        throw new Error('No images returned from fal.ai API');
      }
      
      return {
        imageUrl: falResponse.images[0].url,
        seed: falResponse.seed || input.seed,
        modelId,
        metadata: {
          ...params,
          requestId: result.requestId,
          generationParams: input,
          attempt: attempt + 1,
        }
      };
    } catch (error) {
      lastError = error as Error;
      console.error(`Error generating image with fal.ai (Attempt ${attempt + 1}/${maxRetries + 1}):`, error);
      
      // If this was the last retry, throw the error
      if (attempt === maxRetries) {
        throw new Error(`Failed to generate image after ${maxRetries + 1} attempts: ${lastError.message}`);
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt), 8000);
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // This should never be reached due to the throw in the loop, but TypeScript needs it
  throw new Error('Failed to generate image');
}

/**
 * Upscales an image using the fal.ai API with retry capability
 * 
 * @param imageUrl The URL of the image to upscale
 * @param scale The scale factor to upscale by (default: 2)
 * @param maxRetries Maximum number of retries on failure (default: 2)
 * @returns A promise that resolves to the upscaled image URL
 */
export async function upscaleImage(
  imageUrl: string, 
  scale: number = 2, 
  maxRetries: number = 2
): Promise<string> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Upscaling image: ${imageUrl} with scale: ${scale} (Attempt ${attempt + 1}/${maxRetries + 1})`);
      
      // Use the fal.ai upscaler model
      const modelId = 'fal-ai/real-esrgan';
      
      // Call the fal.ai API with timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Upscaling request timed out')), 30000); // 30 second timeout
      });
      
      const apiPromise = fal.subscribe(modelId, {
        input: {
          image_url: imageUrl,
          scale: scale,
        },
        logs: true,
      });
      
      // Race between the API call and the timeout
      const result = await Promise.race([apiPromise, timeoutPromise]) as any;
      
      // Extract the upscaled image URL from the response
      const falResponse = result.data as any;
      
      if (!falResponse.image) {
        throw new Error('No upscaled image returned from fal.ai API');
      }
      
      return falResponse.image;
    } catch (error) {
      lastError = error as Error;
      console.error(`Error upscaling image with fal.ai (Attempt ${attempt + 1}/${maxRetries + 1}):`, error);
      
      // If this was the last retry, return the original image as fallback
      if (attempt === maxRetries) {
        console.warn(`Failed to upscale image after ${maxRetries + 1} attempts. Using original image.`);
        return imageUrl;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt), 8000);
      console.log(`Retrying upscaling in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // This should never be reached due to the return in the loop, but TypeScript needs it
  return imageUrl;
}

/**
 * Generates multiple images in a batch using the fal.ai API
 * 
 * @param prompts Array of prompts to generate images from
 * @param params Additional parameters for the generation
 * @returns A promise that resolves to an array of generated image URLs and metadata
 */
export async function batchGenerateImages(
  prompts: string[],
  params: FalAiGenerationParams
): Promise<FalAiResponse[]> {
  const results: FalAiResponse[] = [];
  
  for (const prompt of prompts) {
    try {
      const result = await generateImageWithFalAi(prompt, params);
      results.push(result);
      
      // Add a small delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error in batch generation for prompt "${prompt}":`, error);
      // Continue with the next prompt even if one fails
    }
  }
  
  return results;
}
