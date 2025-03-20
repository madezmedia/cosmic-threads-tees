# Technical Context: Cosmic Threads

## Technologies Used

### Frontend Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js | React framework with server-side rendering | 15.1.0 (App Router) |
| React | UI component library | 19.x |
| TypeScript | Type-safe JavaScript | 5.8.x |
| Tailwind CSS | Utility-first CSS framework | 3.4.17 |
| shadcn/ui | Component library built on Radix UI | Latest |

### Backend Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js API Routes | Backend API endpoints | 15.1.0 |
| Supabase | PostgreSQL database, authentication, storage | ^2.49.1 |
| Upstash Redis | Caching, rate limiting | ^1.34.5 |
| Vercel Blob Storage | File storage (planned) | Latest |

### AI/ML Technologies

| Technology | Purpose | Version/Integration |
|------------|---------|-------------|
| fal.ai | Image generation | REST API via custom proxy |
| OpenAI | Text generation, prompt enhancement | via @ai-sdk/openai ^1.2.5 |
| AI SDK | AI integration framework | ai ^4.1.61 |
| Framer Motion | Animation for AI visualizations | ^12.5.0 |

#### Fal.ai Integration Details

- **API Model**: fal-ai/flux/dev
- **Integration Type**: Server-side proxy with client wrapper
- **Authentication**: API key stored in environment variables
- **Features**:
  - Single image generation via `/api/generate-image`
  - Batch generation via `/api/fal/batch-generate`
  - Error handling and retry logic
  - Database storage of generated images
  - Gallery API for browsing and filtering images

### Third-Party Integrations

| Service | Purpose | Integration |
|---------|---------|-------------|
| Printful | Print-on-demand fulfillment | REST API |
| Authentication | User authentication | next-auth ^4.24.11, @auth/core ^0.34.2 |
| Supabase | Database & auth | @supabase/supabase-js ^2.49.1, @supabase/ssr ^0.6.1 |
| Email | Transactional emails | nodemailer ^6.10.0 |
| UUID Generation | Unique identifiers | uuid ^11.1.0 |
| Stripe | Payment processing (planned) | SDK |
| Vercel Analytics | Usage analytics | SDK |

## Development Setup

### Environment Requirements

- **Node.js**: v18.0.0 or higher
- **Package Manager**: npm, yarn, or bun
- **Git**: Latest version
- **IDE**: VS Code recommended (with ESLint and Prettier extensions)
- **Python**: v3.12+ (for Supabase MCP server)

### Local Development Environment

1. **Clone Repository**:
   ```bash
   git clone https://github.com/your-org/cosmic-threads.git
   cd cosmic-threads
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Environment Variables**:
   Create a `.env.local` file with the following variables:
   ```
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Upstash Redis
   UPSTASH_REDIS_REST_URL=your_upstash_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

   # Printful
   PRINTFUL_API_KEY=your_printful_api_key

   # FAL.ai
   FAL_KEY=your_fal_ai_key

   # OpenAI (optional)
   OPENAI_API_KEY=your_openai_api_key

   # Stripe (for future implementation)
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

   # Logging
   LOG_LEVEL=info
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

5. **Access Application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser

### Development Tools

- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Husky**: Git hooks for pre-commit linting and formatting
- **Jest**: Unit testing (planned)
- **Cypress**: End-to-end testing (planned)
- **Supabase MCP Server**: Model Context Protocol server for Supabase database management

### Supabase MCP Server

The project uses the Supabase MCP server to interact with the Supabase database directly from Cline and other MCP-compatible AI assistants.

- **Installation**: Installed via pipx (`pipx install supabase-mcp-server`)
- **Configuration**: Configured in `cline_mcp_settings.json` with project credentials
- **Project ID**: aiozskladrzyydatebyg
- **Region**: us-east-1 (East US North Virginia)
- **Capabilities**:
  - Database schema exploration
  - SQL query execution with safety controls
  - User management via Auth Admin SDK
  - Supabase Management API access

The MCP server provides a safe interface for AI assistants to interact with the database, with built-in protections:
- Safe mode (default): Read-only operations
- Write mode: Data modifications (requires explicit enabling)
- Destructive mode: Schema changes (requires confirmation)

## Technical Constraints

### Performance Requirements

- **Page Load Time**: < 2 seconds for initial load
- **Time to Interactive**: < 3 seconds
- **Image Generation Time**: < 15 seconds for AI design generation
- **Batch Generation Time**: < 5 minutes for 20 images
- **API Response Time**: < 500ms for non-AI endpoints

### Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile Browsers**: iOS Safari, Android Chrome (latest 2 versions)
- **No IE Support**: Internet Explorer is not supported

### Accessibility Requirements

- **WCAG Compliance**: Level AA compliance target
- **Keyboard Navigation**: Full keyboard navigation support
- **Screen Reader Support**: Compatible with major screen readers
- **Color Contrast**: Meets WCAG AA standards

### Security Requirements

- **Authentication**: Secure user authentication via Supabase Auth
- **Data Protection**: Encrypted data storage and transmission
- **API Security**: Rate limiting, CORS protection
- **Input Validation**: Server-side validation for all user inputs
- **XSS Protection**: Content Security Policy implementation

## Dependencies and External Services

### Core Dependencies

```json
{
  "dependencies": {
    "@hookform/resolvers": "^4.1.3",
    "@radix-ui/react-accordion": "^1.2.2",
    "@radix-ui/react-alert-dialog": "^1.1.4",
    "@radix-ui/react-aspect-ratio": "^1.1.1",
    "@radix-ui/react-avatar": "^1.1.2",
    "@radix-ui/react-checkbox": "^1.1.3",
    "@radix-ui/react-collapsible": "^1.1.2",
    "@radix-ui/react-context-menu": "^2.2.4",
    "@radix-ui/react-dialog": "^1.1.4",
    "@radix-ui/react-dropdown-menu": "^2.1.4",
    "@radix-ui/react-hover-card": "^1.1.4",
    "@radix-ui/react-label": "^2.1.1",
    "@radix-ui/react-menubar": "^1.1.4",
    "@radix-ui/react-navigation-menu": "^1.2.3",
    "@radix-ui/react-popover": "^1.1.4",
    "@radix-ui/react-progress": "^1.1.2",
    "@radix-ui/react-radio-group": "^1.2.2",
    "@radix-ui/react-scroll-area": "^1.2.2",
    "@radix-ui/react-select": "^2.1.4",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-slider": "^1.2.2",
    "@radix-ui/react-slot": "^1.1.1",
    "@radix-ui/react-switch": "^1.1.2",
    "@radix-ui/react-tabs": "^1.1.2",
    "@radix-ui/react-toast": "^1.2.4",
    "@radix-ui/react-toggle": "^1.1.1",
    "@radix-ui/react-toggle-group": "^1.1.1",
    "@radix-ui/react-tooltip": "^1.1.6",
    "autoprefixer": "^10.4.20",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "1.0.4",
    "date-fns": "4.1.0",
    "embla-carousel-react": "8.5.1",
    "input-otp": "1.4.1",
    "lucide-react": "^0.454.0",
    "next": "15.1.0",
    "next-themes": "^0.4.4",
    "react": "^19",
    "react-day-picker": "8.10.1",
    "react-dom": "^19",
    "react-hook-form": "^7.54.2",
    "react-resizable-panels": "^2.1.7",
    "recharts": "2.15.0",
    "sonner": "^1.7.1",
    "tailwind-merge": "^2.5.5",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.9.6",
    "zod": "^3.24.2",
    "@emotion/is-prop-valid": "^1.3.1",
    "@supabase/supabase-js": "^2.49.1",
    "@auth/core": "^0.34.2",
    "nodemailer": "^6.10.0",
    "framer-motion": "^12.5.0",
    "ai": "^4.1.61",
    "@ai-sdk/openai": "^1.2.5",
    "@supabase/ssr": "^0.6.1",
    "next-auth": "^4.24.11",
    "uuid": "^11.1.0",
    "@upstash/redis": "^1.34.5"
  },
  "devDependencies": {
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "postcss": "^8",
    "tailwindcss": "^3.4.17",
    "typescript": "^5"
  }
}
```

### External Service Dependencies

1. **Supabase**
   - **Purpose**: Database, authentication, storage
   - **Pricing**: Free tier for development, production tier based on usage
   - **Limits**: Rate limits on API calls, storage limits based on plan

2. **fal.ai**
   - **Purpose**: AI image generation
   - **Pricing**: Pay-per-generation model
   - **Limits**: Rate limits on API calls, generation quality tiers

3. **Printful**
   - **Purpose**: Print-on-demand fulfillment
   - **Pricing**: No subscription fee, pay per product
   - **Limits**: Product availability, shipping destinations

4. **Upstash Redis**
   - **Purpose**: Caching, rate limiting
   - **Pricing**: Pay-per-use model
   - **Limits**: Storage and throughput limits based on plan

5. **OpenAI (Optional)**
   - **Purpose**: Text generation, prompt enhancement
   - **Pricing**: Pay-per-token model
   - **Limits**: Rate limits, token limits per request

## Deployment Architecture

### Production Environment

- **Hosting**: Vercel
- **Database**: Supabase (PostgreSQL)
- **Caching**: Upstash Redis
- **Storage**: Vercel Blob Storage (planned)
- **CDN**: Vercel Edge Network
- **Image Storage**: fal.ai hosted URLs with Supabase database references

### Deployment Process

1. **CI/CD Pipeline**:
   - GitHub Actions for automated testing
   - Vercel for automated deployment

2. **Environment Stages**:
   - Development: Local development environment
   - Preview: Vercel preview deployments for PRs
   - Production: Vercel production deployment from main branch

3. **Monitoring and Logging**:
   - Vercel Analytics for performance monitoring
   - Custom logging solution for error tracking
   - Uptime monitoring via third-party service (planned)

## Scaling Considerations

### Current Scalability

- **Serverless Architecture**: Next.js API routes scale automatically
- **Database**: Supabase handles scaling of PostgreSQL
- **Caching**: Redis caching reduces database load
- **CDN**: Static assets served via Vercel's global CDN
- **Image Generation**: Batch processing with controlled concurrency

### Future Scaling Needs

- **Image Processing**: May need dedicated service for high volume
- **Background Jobs**: Consider adding job queue for async processing
- **Database Sharding**: Plan for potential sharding as user base grows
- **Global Deployment**: Multi-region deployment for lower latency
- **Image Generation Queue**: Implement proper queue system for high-volume generation
- **Content Moderation**: Add AI-based content moderation for user-generated prompts
