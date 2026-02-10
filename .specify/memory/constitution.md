# Market Monitor Constitution

## Core Principles

### I. TypeScript First
All code must be written in TypeScript with strict mode enabled. No `any` types without explicit justification. Type definitions must be clear and maintainable.

### II. Component-Based Architecture
UI built with React components following Next.js App Router conventions. Components should be focused, reusable, and properly typed. Server and Client components must be explicitly designated.

### III. File-Based Routing
Follow Next.js App Router structure (`app/` directory). Routes defined by folder structure with `page.tsx` files. No custom routing logic unless absolutely necessary.

### IV. Performance & Core Web Vitals
Optimize for Core Web Vitals (LCP, FID, CLS). Use Next.js Image component for images. Implement proper loading states and error boundaries. Lazy load non-critical components.

### V. Accessibility & Standards
Semantic HTML required. ARIA labels where necessary. Keyboard navigation support. Responsive design for mobile and desktop.

## Technical Standards

### Code Quality
- ESLint configuration must pass without errors
- Consistent formatting (Prettier or equivalent)
- Meaningful variable and function names
- Comments for complex logic only

### Dependencies
- Keep dependencies minimal and up-to-date
- Prefer established, well-maintained packages
- Document why each major dependency is needed

### Environment & Configuration
- Environment variables for all configuration
- Never commit secrets or API keys
- Use `.env.local` for local development

## Development Workflow

### Version Control
- Meaningful commit messages
- Small, focused commits
- Branch off `main` for new features

### Testing & Validation
- Test critical user flows
- Verify builds succeed before deployment
- Check for TypeScript errors regularly

### Deployment
- Build must succeed without errors or warnings
- Environment variables properly configured
- Verify functionality in production-like environment

## Governance

This constitution defines the minimum standards for the Market Monitor project. All code changes must comply with these principles. Deviations require documentation and justification.

**Version**: 1.0.0 | **Ratified**: 2026-02-10 | **Last Amended**: 2026-02-10
