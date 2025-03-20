# Active Context: Wall Art Generation Service Architecture

## Current Focus
Implementing a comprehensive wall art generation service with enhanced AI-driven design capabilities.

## Service Architecture

### Core Services
- `@/lib/wall-art-service.ts`: Primary service for wall art design generation
- `@/lib/fal-ai-service.ts`: Interface for AI image generation
- `@/lib/prompt-service.ts`: Prompt enhancement and processing

### Key Features
- Dynamic style-based keyword generation
- Configurable image generation parameters
- High-resolution image processing
- Supabase design storage integration

### Supported Wall Art Styles
- Minimalist
- Abstract
- Landscape

## Design Generation Workflow
1. Prompt Enhancement
   - Optional AI-driven prompt refinement
   - Style-specific keyword augmentation

2. Image Generation
   - Configurable generation parameters
   - Style-specific guidance scales
   - Resolution control

3. Post-Processing
   - Optional image upscaling
   - Design metadata storage

## Typescript Configuration
- Path aliases configured for modular imports
- Strict type checking enabled
- Node module resolution

## Next Steps
- Implement comprehensive error handling
- Add more wall art styles
- Develop advanced prompt enhancement logic
- Create unit tests for service components
