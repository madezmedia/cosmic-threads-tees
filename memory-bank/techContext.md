# Technical Context: Cosmic Threads

## Technologies Used

### Frontend Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js | React framework with server-side rendering | 14.x (App Router) |
| React | UI component library | 18.x |
| TypeScript | Type-safe JavaScript | 5.x |
| Tailwind CSS | Utility-first CSS framework | 3.x |
| shadcn/ui | Component library built on Radix UI | Latest |

### Backend Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js API Routes | Backend API endpoints | 14.x |
| Supabase | PostgreSQL database, authentication, storage | Latest |
| Upstash Redis | Caching, rate limiting | Latest |
| Vercel Blob Storage | File storage (planned) | Latest |

### AI/ML Technologies

| Technology | Purpose | Integration |
|------------|---------|-------------|
| fal.ai | Image generation | REST API |
| OpenAI | Text generation, prompt enhancement | REST API |

### Third-Party Integrations

| Service | Purpose | Integration |
|---------|---------|-------------|
| Printful | Print-on-demand fulfillment | REST API |
| Stripe | Payment processing (planned) | SDK |
| Vercel Analytics | Usage analytics | SDK |

## Development Setup

### Environment Requirements

- **Node.js**: v18.0.0 or higher
- **Package Manager**: npm, yarn, or bun
- **Git**: Latest version
- **IDE**: VS Code recommended (with ESLint and Prettier extensions)

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

## Technical Constraints

### Performance Requirements

- **Page Load Time**: < 2 seconds for initial load
- **Time to Interactive**: < 3 seconds
- **Image Generation Time**: < 15 seconds for AI design generation
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
    "@radix-ui/react-icons": "^1.3.0",
    "@radix-ui/react-slot": "^1.0.2",
    "@supabase/auth-helpers-nextjs": "^0.8.1",
    "@supabase/supabase-js": "^2.38.4",
    "@upstash/redis": "^1.25.1",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "lucide-react": "^0.292.0",
    "next": "14.0.3",
    "react": "^18",
    "react-dom": "^18",
    "tailwind-merge": "^2.0.0",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.0.3",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
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

### Future Scaling Needs

- **Image Processing**: May need dedicated service for high volume
- **Background Jobs**: Consider adding job queue for async processing
- **Database Sharding**: Plan for potential sharding as user base grows
- **Global Deployment**: Multi-region deployment for lower latency
