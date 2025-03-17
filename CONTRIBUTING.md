# Contributing to Cosmic Threads

Thank you for your interest in contributing to Cosmic Threads! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## How Can I Contribute?

### Reporting Bugs

Bug reports help us improve the project. When you create a bug report, please include as many details as possible:

1. **Use a clear and descriptive title** for the issue
2. **Describe the exact steps to reproduce the problem**
3. **Provide specific examples** to demonstrate the steps
4. **Describe the behavior you observed** and **what behavior you expected**
5. **Include screenshots or animated GIFs** if possible
6. **Include details about your environment** (OS, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

1. **Use a clear and descriptive title** for the issue
2. **Provide a detailed description of the suggested enhancement**
3. **Explain why this enhancement would be useful**
4. **Include any relevant mockups or examples**

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Install development dependencies** by running `npm install`
3. **Make your changes** following our coding standards
4. **Write or adapt tests** as needed
5. **Ensure the test suite passes** by running `npm test`
6. **Make sure your code lints** by running `npm run lint`
7. **Submit your pull request**

## Development Setup

### Prerequisites

- Node.js 18+ and npm/yarn/bun
- Git
- Supabase account
- Upstash Redis account
- fal.ai API key
- Printful API key
- OpenAI API key (optional)

### Local Development

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
   Create a `.env.local` file in the root directory with the required variables (see README.md)

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

## Coding Standards

### General Guidelines

- Write clean, maintainable, and testable code
- Follow the existing code style and patterns
- Keep components small and focused on a single responsibility
- Use meaningful variable and function names
- Add comments for complex logic

### TypeScript

- Use TypeScript for all new files
- Define explicit types for function parameters and return values
- Use interfaces for complex object types
- Use type guards for runtime type checking

### React Components

- Prefer functional components with hooks over class components
- Use destructuring for props
- Define prop types with TypeScript interfaces
- Follow the component organization structure in the project

### CSS/Styling

- Use Tailwind CSS utility classes for styling
- Follow the project's retro-futuristic aesthetic
- Use CSS variables for theme colors and spacing
- Maintain responsive design for all components

### Commit Messages

We follow conventional commits for our commit messages:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding or modifying tests
- `chore:` for maintenance tasks

Example: `feat: add AI design generation component`

## Pull Request Process

1. Update the README.md or documentation with details of changes if appropriate
2. The PR should work in all supported browsers
3. PRs require approval from at least one maintainer
4. Once approved, a maintainer will merge your PR

## License

By contributing to Cosmic Threads, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).

---

Thank you for contributing to Cosmic Threads! 🚀✨
