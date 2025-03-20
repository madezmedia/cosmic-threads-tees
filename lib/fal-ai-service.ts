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
 * Generates an image using the fal.ai API
 * 
 * @param prompt The text prompt to generate an image from
 * @param params Additional parameters for the generation
 * @returns A promise that resolves to the generated image URL and metadata
 */
export async function generateImageWithFalAi(prompt: string, params: FalAiGenerationParams): Promise<FalAiResponse> {
  try {
    console.log(`Generating image with fal.ai for prompt: ${prompt}`);
    
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
      negative_prompt: params.negative_prompt || 'low quality, blurry, distorted, deformed, disfigured',
    };
    
    // Call the fal.ai API
    const result = await fal.subscribe(modelId, {
      input,
      logs: true,
    });
    
    // Extract the image URL from the response
    const falResponse = result.data as any;
    
    if (!falResponse.images || falResponse.images.length === 0) {
      throw new Error('No images returned from fal.ai API');
    }
    
    return {
      imageUrl: falResponse.images[0].url,
      seed: falResponse.seed,
      modelId,
      metadata: {
        ...params,
        requestId: result.requestId,
        generationParams: input,
      }
    };
  } catch (error) {
    console.error('Error generating image with fal.ai:', error);
    throw error;
  }
}

/**
 * Upscales an image using the fal.ai API
 * 
 * @param imageUrl The URL of the image to upscale
 * @param scale The scale factor to upscale by (default: 2)
 * @returns A promise that resolves to the upscaled image URL
 */
export async function upscaleImage(imageUrl: string, scale: number = 2): Promise<string> {
  try {
    console.log(`Upscaling image: ${imageUrl} with scale: ${scale}`);
    
    // Use the fal.ai upscaler model
    const modelId = 'fal-ai/real-esrgan';
    
    // Call the fal.ai API
    const result = await fal.subscribe(modelId, {
      input: {
        image_url: imageUrl,
        scale: scale,
      },
      logs: true,
    });
    
    // Extract the upscaled image URL from the response
    const falResponse = result.data as any;
    
    if (!falResponse.image) {
      throw new Error('No upscaled image returned from fal.ai API');
    }
    
    return falResponse.image;
  } catch (error) {
    console.error('Error upscaling image with fal.ai:', error);
    // Return the original image URL as fallback
    return imageUrl;
  }
}
