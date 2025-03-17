Thought for 4 seconds### Cosmic Threads - AI-Powered T-Shirt Design Platform

## Project Brief for New Developers





## 📋 Project Overview

Cosmic Threads is a Next.js-based web application that allows users to create custom T-shirt designs using AI-powered tools. The platform features a retro-futuristic aesthetic and enables users to generate unique designs from text prompts, customize them, and order physical products through Printful integration.

### Core Value Proposition

- **AI-Generated Designs**: Users can describe their design ideas in plain text and our AI will generate unique, print-ready artwork
- **No Design Skills Required**: The platform democratizes T-shirt design by removing the need for graphic design expertise
- **Retro-Futuristic Aesthetic**: A unique visual identity that blends nostalgic elements with futuristic design
- **Seamless Production**: Direct integration with Printful for on-demand printing and fulfillment


## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom theme
- **UI Components**: shadcn/ui component library
- **State Management**: React Context API with custom hooks


### Backend

- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Caching**: Upstash Redis
- **File Storage**: Vercel Blob Storage (planned)


### AI/ML

- **Image Generation**: fal.ai API
- **Text Generation**: OpenAI API
- **Prompt Optimization**: Custom prompt engineering system


### Third-Party Integrations

- **Print-on-Demand**: Printful API
- **Payments**: Stripe (planned)
- **Analytics**: Vercel Analytics


## 🔑 Key Features

1. **AI Design Studio**

1. Text-to-image generation for T-shirt designs
2. Style selection and customization
3. Background removal for print-ready designs



2. **User Dashboard**

1. Saved designs library
2. Order history and tracking
3. Account management



3. **T-shirt Customization**

1. Design placement options (front, back, sleeve)
2. Color selection
3. Size selection



4. **Shopping Experience**

1. Cart functionality
2. Checkout process
3. Order confirmation





## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/bun
- Git
- Supabase account
- Upstash Redis account
- fal.ai API key
- Printful API key
- OpenAI API key (optional)


### Environment Setup

1. Clone the repository:

```shellscript
git clone https://github.com/your-org/cosmic-threads.git
cd cosmic-threads
```


2. Install dependencies:

```shellscript
npm install
# or
yarn install
# or
bun install
```


3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:

```plaintext
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


4. Run the development server:

```shellscript
npm run dev
# or
yarn dev
# or
bun dev
```


5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.


## 📁 Project Structure

```plaintext
cosmic-threads/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes
│   ├── create/             # Design creation pages
│   ├── dashboard/          # User dashboard
│   ├── login/              # Authentication pages
│   └── ...
├── components/             # React components
│   ├── auth/               # Authentication components
│   ├── ui/                 # UI components (shadcn)
│   └── ...
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and services
│   ├── providers/          # React context providers
│   ├── supabase.ts         # Supabase client and functions
│   ├── redis.ts            # Redis client and functions
│   ├── ai-service.ts       # AI integration services
│   └── ...
├── public/                 # Static assets
└── ...
```

## 🔄 Development Workflow

### Git Workflow

We follow a feature branch workflow:

1. Create a new branch for each feature or bug fix:

```shellscript
git checkout -b feature/feature-name
# or
git checkout -b fix/bug-name
```


2. Make your changes and commit them with descriptive messages:

```shellscript
git commit -m "feat: add AI design generation component"
```


3. Push your branch and create a pull request:

```shellscript
git push origin feature/feature-name
```


4. After code review, merge your PR into the main branch.


### Code Style

- We use ESLint and Prettier for code formatting
- Run `npm run lint` to check for linting issues
- Run `npm run format` to automatically format code


## 🗄️ Database Schema

### Key Tables

1. **users**

1. Managed by Supabase Auth



2. **designs**

1. `id`: UUID (primary key)
2. `user_id`: UUID (foreign key to users)
3. `prompt`: Text
4. `enhanced_prompt`: Text (optional)
5. `image_url`: Text
6. `thumbnail_url`: Text (optional)
7. `settings`: JSON
8. `metadata`: JSON (optional)
9. `created_at`: Timestamp



3. **orders**

1. `id`: UUID (primary key)
2. `user_id`: UUID (foreign key to users)
3. `status`: Text
4. `subtotal`: Numeric
5. `shipping`: Numeric
6. `tax`: Numeric
7. `total`: Numeric
8. `shipping_address`: JSON
9. `billing_address`: JSON (optional)
10. `payment_details`: JSON
11. `created_at`: Timestamp
12. `updated_at`: Timestamp



4. **order_items**

1. `id`: UUID (primary key)
2. `order_id`: UUID (foreign key to orders)
3. `variant_id`: Text
4. `design_id`: UUID (foreign key to designs)
5. `quantity`: Integer
6. `price`: Numeric
7. `placement`: Text
8. `print_file_url`: Text





## 🔌 API Integrations

### Printful API

We use the Printful API for on-demand printing and fulfillment:

- **Product Catalog**: Fetch available products and variants
- **Mockup Generation**: Create mockups of designs on products
- **Order Creation**: Submit orders for production and shipping


Documentation: [Printful API Docs](https://developers.printful.com/docs/)

### fal.ai API

We use fal.ai for AI image generation:

- **Text-to-Image**: Generate designs from text prompts
- **Image Editing**: Modify and enhance designs


Documentation: [fal.ai API Docs](https://fal.ai/docs)

### OpenAI API (Optional)

We use OpenAI for text generation and prompt enhancement:

- **Prompt Optimization**: Enhance user prompts for better design results
- **Text Generation**: Generate text for designs


Documentation: [OpenAI API Docs](https://platform.openai.com/docs/api-reference)

## 🚢 Deployment

We deploy our application on Vercel:

1. The main branch is automatically deployed to production
2. Feature branches are deployed to preview environments
3. Environment variables must be configured in the Vercel dashboard


## 🐛 Troubleshooting Common Issues

### Database Connection Issues

If you encounter database connection issues:

1. Verify your Supabase credentials in `.env.local`
2. Check if your IP is allowed in Supabase dashboard
3. Ensure the database is running and accessible


### Redis Connection Issues

If Redis fails to connect:

1. Verify your Upstash Redis credentials
2. Check the Redis URL format (should start with `https://`)
3. The application has a fallback mechanism that uses local storage when Redis is unavailable


### AI Generation Issues

If AI design generation fails:

1. Check your fal.ai API key
2. Verify rate limits haven't been exceeded
3. Check the prompt format and length


## 📚 Resources and Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Upstash Redis Documentation](https://docs.upstash.com/redis)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Printful API Documentation](https://developers.printful.com/docs/)
- [fal.ai Documentation](https://fal.ai/docs)


## 🤝 Contributing

We welcome contributions from all team members! Please review our contributing guidelines before submitting pull requests.

## 📞 Support

If you have any questions or need assistance, please contact:

- **Technical Lead**: [tech.lead@cosmicthreads.com](mailto:tech.lead@cosmicthreads.com)
- **Project Manager**: [pm@cosmicthreads.com](mailto:pm@cosmicthreads.com)
- **Slack Channel**: #cosmic-threads-dev


---

© 2023 Cosmic Threads. All rights reserved.