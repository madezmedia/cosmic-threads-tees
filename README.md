# Cosmic Threads 🚀✨

![Cosmic Threads](public/placeholder-logo.svg)

An AI-powered T-shirt design platform with a retro-futuristic aesthetic.

## 🌟 Overview

Cosmic Threads is a Next.js-based web application that allows users to create custom T-shirt designs using AI-powered tools. The platform enables users to generate unique designs from text prompts, customize them, and order physical products through Printful integration.

### Core Features

- **AI-Generated Designs**: Transform text descriptions into unique, print-ready artwork
- **No Design Skills Required**: Create professional designs without graphic design expertise
- **Retro-Futuristic Aesthetic**: Unique visual identity blending nostalgic elements with futuristic design
- **Seamless Production**: Direct integration with Printful for on-demand printing and fulfillment

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Supabase (PostgreSQL, Auth), Upstash Redis
- **AI/ML**: fal.ai API for image generation, OpenAI API for prompt enhancement
- **Third-Party**: Printful API for print-on-demand fulfillment

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/bun
- Git
- Supabase account
- Upstash Redis account
- fal.ai API key
- Printful API key
- OpenAI API key (optional)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/cosmic-threads.git
   cd cosmic-threads
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
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
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
cosmic-threads/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes
│   ├── create/             # Design creation pages
│   ├── dashboard/          # User dashboard
│   ├── login/              # Authentication pages
│   └── ...
├── components/             # React components
│   ├── ui/                 # UI components (shadcn)
│   └── ...
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and services
│   ├── supabase/           # Supabase client and functions
│   └── ...
├── public/                 # Static assets
└── ...
```

## 🔄 Development Workflow

### Git Workflow

We follow a feature branch workflow:

1. Create a new branch for each feature or bug fix:
   ```bash
   git checkout -b feature/feature-name
   # or
   git checkout -b fix/bug-name
   ```

2. Make your changes and commit them with descriptive messages:
   ```bash
   git commit -m "feat: add AI design generation component"
   ```

3. Push your branch and create a pull request:
   ```bash
   git push origin feature/feature-name
   ```

4. After code review, merge your PR into the main branch.

### Code Style

- We use ESLint and Prettier for code formatting
- Run `npm run lint` to check for linting issues
- Run `npm run format` to automatically format code

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

If you have any questions or need assistance, please open an issue or contact the project maintainers.

---

© 2025 Cosmic Threads. All rights reserved.
