/**
 * Script to generate initial images for the Cosmic Threads website
 * 
 * This script uses the fal.ai integration to generate a set of initial images
 * for different styles and mediums, which will be stored in the Supabase database.
 * 
 * Usage:
 * 1. Make sure the development server is running
 * 2. Run: npx ts-node -r tsconfig-paths/register scripts/generate-initial-images.ts
 * 
 * Note: You may need to install dependencies first:
 * npm install --save-dev ts-node tsconfig-paths node-fetch @types/node-fetch
 */

import fetch from 'node-fetch';

// Define types for our requests and responses
interface GenerationRequest {
  prompt: string;
  style: string;
  category: string;
  tags: string[];
  mediumId: string;
}

interface GenerationResult {
  prompt: string;
  success: boolean;
  designId?: string;
  imageUrl?: string;
  error?: string;
}

interface BatchGenerationResponse {
  success: boolean;
  projectId: string;
  results: GenerationResult[];
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
}

// Define the styles we want to generate images for
const styles = [
  {
    id: 'retro-futuristic',
    name: 'Retro Futuristic',
    description: 'A blend of vintage aesthetics with futuristic elements',
    tags: ['neon', 'chrome', 'synthwave', 'cyberpunk', 'retrofuturism']
  },
  {
    id: 'cosmic-minimal',
    name: 'Cosmic Minimal',
    description: 'Clean, minimalist designs with cosmic elements',
    tags: ['minimal', 'space', 'geometric', 'clean', 'elegant']
  },
  {
    id: 'abstract-cosmic',
    name: 'Abstract Cosmic',
    description: 'Abstract interpretations of cosmic themes',
    tags: ['abstract', 'fluid', 'colorful', 'expressive', 'dynamic']
  },
  {
    id: 'vintage-sci-fi',
    name: 'Vintage Sci-Fi',
    description: 'Classic science fiction aesthetics from the 50s-70s',
    tags: ['retro', 'pulp', 'space', 'aliens', 'rockets']
  },
  {
    id: 'neon-dreams',
    name: 'Neon Dreams',
    description: 'Vibrant neon-inspired designs with a dreamy quality',
    tags: ['neon', 'vibrant', 'glow', 'night', 'urban']
  }
];

// Define the mediums we want to generate images for
const mediums = [
  {
    id: 'tshirt',
    name: 'T-Shirt'
  },
  {
    id: 'wallart',
    name: 'Wall Art'
  }
];

// Generate prompts for each style and medium combination
const generateRequests = (): GenerationRequest[] => {
  const requests: GenerationRequest[] = [];

  for (const style of styles) {
    for (const medium of mediums) {
      // Generate 2 examples for each style and medium combination
      for (let i = 1; i <= 2; i++) {
        let prompt = '';
        
        if (medium.id === 'tshirt') {
          prompt = `Create a ${style.name} t-shirt design featuring ${style.tags.slice(0, 3).join(', ')} elements. The design should be suitable for screen printing with a transparent background.`;
        } else if (medium.id === 'wallart') {
          prompt = `Create a ${style.name} wall art piece featuring ${style.tags.slice(0, 3).join(', ')} elements. The design should be high resolution and suitable for printing on canvas or poster.`;
        }

        requests.push({
          prompt,
          style: style.name,
          category: style.id,
          tags: style.tags,
          mediumId: medium.id
        });
      }
    }
  }

  return requests;
};

// Main function to generate images
const generateInitialImages = async (): Promise<void> => {
  console.log('Generating initial images for Cosmic Threads...');
  
  const requests = generateRequests();
  console.log(`Generated ${requests.length} requests for image generation`);

  try {
    // Call our batch-generate API endpoint
    const response = await fetch('http://localhost:3000/api/fal/batch-generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json() as BatchGenerationResponse;
    
    console.log('\n=== Generation Results ===');
    console.log(`Total Requests: ${result.totalRequests}`);
    console.log(`Successful: ${result.successfulRequests}`);
    console.log(`Failed: ${result.failedRequests}`);
    console.log(`Project ID: ${result.projectId}`);
    
    // Log details of successful generations
    console.log('\n=== Successful Generations ===');
    result.results.filter((r: GenerationResult) => r.success).forEach((r: GenerationResult, i: number) => {
      console.log(`${i + 1}. ${r.prompt.substring(0, 50)}... (ID: ${r.designId})`);
    });
    
    // Log details of failed generations
    if (result.failedRequests > 0) {
      console.log('\n=== Failed Generations ===');
      result.results.filter((r: GenerationResult) => !r.success).forEach((r: GenerationResult, i: number) => {
        console.log(`${i + 1}. ${r.prompt.substring(0, 50)}... (Error: ${r.error})`);
      });
    }
    
    console.log('\nImage generation complete!');
    console.log('The generated images are now stored in the Supabase database and can be accessed through the application.');
  } catch (error) {
    console.error('Error generating images:', error instanceof Error ? error.message : String(error));
  }
};

// Run the main function
generateInitialImages();
