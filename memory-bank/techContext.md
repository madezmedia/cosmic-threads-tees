# Technical Context

## Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Component Library**: Shadcn/UI
- **State Management**: React Context API

### Backend
- **API Routes**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage

### AI Services
- **Image Generation**: Fal.ai API
- **Prompt Enhancement**: Custom prompt engineering service
- **Upscaling**: Placeholder implementation (to be enhanced)

## Architecture

### Module Structure
- **`/app`**: Next.js application routes and API endpoints
- **`/components`**: Reusable UI components
- **`/lib`**: Core services and utilities
- **`/hooks`**: Custom React hooks
- **`/context`**: React context providers
- **`/styles`**: Global styles and Tailwind configuration
- **`/public`**: Static assets
- **`/memory-bank`**: Project documentation and context

### Core Services

#### Image Generation
- **`lib/fal-ai-service.ts`**: Interface for AI image generation
  - Handles communication with Fal.ai API
  - Manages generation parameters
  - Returns standardized response format

#### Prompt Enhancement
- **`lib/prompt-service.ts`**: Prompt processing and enhancement
  - Improves user prompts for better AI generation results
  - Applies product-specific optimizations
  - Handles style-specific language

#### Product Services
- **`lib/wall-art-service.ts`**: Wall art generation service
  - Manages the end-to-end process for wall art creation
  - Handles style-specific parameters
  - Integrates with database for design storage
  - Supports high-resolution generation

### Data Flow
1. User inputs design prompt and selects style
2. Prompt is enhanced via prompt service
3. Enhanced prompt is sent to Fal.ai for image generation
4. Generated image is processed (upscaled if needed)
5. Design is saved to Supabase
6. Product mockups are generated for visualization

## Development Environment

### Configuration
- TypeScript with strict mode enabled
- Path aliases for cleaner imports
- ESLint and Prettier for code quality
- Tailwind configured with custom theme

### Build Process
- Next.js build system
- PostCSS for Tailwind processing
- Incremental TypeScript compilation

## Deployment
- Vercel for hosting and CI/CD
- Environment variables for API keys and configuration
- Edge functions for performance-critical operations

## Testing Strategy
- Unit tests for core services (planned)
- Component tests with React Testing Library (planned)
- E2E tests with Playwright (planned)
