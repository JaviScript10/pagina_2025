# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Velocity Web** - a high-performance, SEO-optimized marketing website built with Next.js 15 (App Router), React 19, TypeScript, and Tailwind CSS 4. The site is heavily optimized for Core Web Vitals and performance metrics, featuring aggressive caching, lazy loading, and performance-first architecture.

## Key Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000

# Production
npm run build        # Build for production (runs type checking + Next.js build)
npm start            # Start production server

# Linting
npm run lint         # Run ESLint with Next.js config
```

## Architecture

### App Router Structure
- **App Router (Next.js 15)**: Uses `src/app/` directory structure
- **Server Components by Default**: Only components with `"use client"` directive are client components
- **Layout System**: `src/app/layout.tsx` defines the root layout with global elements (Header, ChatDock, custom cursor)
- **Main Page**: `src/app/page.tsx` is a client component that uses aggressive lazy loading for below-the-fold sections

### Performance-Critical Patterns

**1. Lazy Loading Strategy** (`src/app/page.tsx:10-32`):
- Hero and Services load immediately (above-the-fold, LCP elements)
- All other sections use `next/dynamic` with loading placeholders
- This reduces Total Blocking Time (TBT) by ~80%

**2. Image Optimization** (`next.config.ts:15-27`):
- Next.js Image component with AVIF/WebP formats
- 1-year cache TTL for static assets
- Preload critical images in layout head
- Custom device sizes and image sizes

**3. Font Optimization** (`src/app/layout.tsx:9-13`):
- Uses `next/font` with Inter font family
- Display swap strategy for no FOIT
- Multiple weights preloaded

**4. Custom Cursor System**:
- `CursorMount.tsx`: Mounts the client-side cursor controller
- `CursorClient.tsx`: Implements cursor tracking logic
- Performance-optimized with RAF throttling and hardware detection

**5. Canvas Animations** (`src/app/components/Hero.jsx:15-120`):
- Hardware-aware particle system
- DPR limiting to max 2x
- Device memory and CPU core detection
- Reduced motion preference support
- Automatic disable on coarse pointers (mobile)
- RequestAnimationFrame with frame skipping on low-end devices

### Component Architecture

**Global Components** (rendered in layout):
- `Header.jsx`: Navigation with mobile menu
- `ChatDock.tsx`: AI-powered chat widget with context-aware suggestions
- `CursorMount.tsx` + `CursorClient.tsx`: Custom cursor system

**Page Sections** (lazy-loaded except Hero/Services):
- `Hero.jsx`: Main hero with canvas particle animation
- `Services.jsx`: Service offerings
- `AboutSection.tsx`: Company information
- `Projects.jsx`: Portfolio showcase
- `Benefits.jsx`: Value propositions
- `Testimonials.jsx`: Client testimonials
- `FAQ.jsx`: Frequently asked questions
- `WhatsAppForm.jsx`: Contact form with WhatsApp integration
- `Footer.jsx`: Site footer
- `WhatsAppButton.jsx`: Floating WhatsApp CTA

### API Routes

**`/api/send/route.ts`**: Contact form email handler
- Uses nodemailer for SMTP delivery
- Graceful degradation when SMTP not configured
- Requires env vars: `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_PORT` (optional)
- Optional: `SMTP_TO`, `SMTP_FROM`
- Always returns 200 to avoid breaking UX

### Configuration Files

**Path Aliases** (`tsconfig.json:21-23`):
- `@/*` maps to `./src/*`

**WhatsApp Integration** (`src/app/config.ts`):
- `WA_PHONE` exported constant
- Falls back to `"56937204965"` if `NEXT_PUBLIC_WA_PHONE` not set

**Next.js Config** (`next.config.ts`):
- Webpack watch options tuned for network drives
- Aggressive image optimization (AVIF/WebP, 1-year cache)
- Security headers (HSTS, CSP-lite, X-Frame-Options, etc.)
- Preconnect hints for external domains
- Production source maps disabled
- React strict mode enabled

**ESLint** (`eslint.config.mjs`):
- Extends `next/core-web-vitals` and `next/typescript`
- Ignores: `.next/`, `out/`, `build/`, `node_modules/`

## Development Guidelines

### When Adding Components
1. **Determine if client-side is needed**: Only add `"use client"` if using hooks, event handlers, or browser APIs
2. **Consider lazy loading**: If component is below-the-fold, lazy load it in `page.tsx`
3. **Use TypeScript for new files**: Prefer `.tsx` over `.jsx` for new components
4. **Optimize images**: Always use `next/image` with appropriate priority flags

### Performance Considerations
- **Hardware awareness**: Check `navigator.hardwareConcurrency`, `deviceMemory`, `devicePixelRatio` for adaptive features
- **Reduced motion**: Always respect `prefers-reduced-motion: reduce` media query
- **Mobile-first**: Test on coarse pointer devices, reduce animations/particles
- **Cache headers**: Static assets in `/brand/` get 1-year immutable cache

### File Extensions
- Mix of `.tsx`, `.ts`, `.jsx`, `.js` exists
- New files should prefer TypeScript (`.tsx`/`.ts`)
- Many components still use `.jsx` - migrate gradually when editing

### Styling
- **Tailwind CSS 4**: Utility-first approach with `@tailwindcss/postcss`
- **Global styles**: `src/app/globals.css`
- **Custom cursor styles**: Defined in globals.css, manipulated via JS

## Environment Variables

Create `.env.local` for local development:

```bash
# WhatsApp (public)
NEXT_PUBLIC_WA_PHONE=56937204965

# Email (server-side, optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_TO=recipient@example.com
SMTP_FROM="Velocity Web <your-email@gmail.com>"
```

**Note**: The contact form gracefully degrades if SMTP is not configured.

## Deployment

- **Platform**: Vercel (optimized for Next.js)
- **Production URL**: https://pagina-2025.vercel.app
- **Branch**: Deploy from `main` branch
- **Build command**: `npm run build` (automatic)
- **Environment variables**: Configure in Vercel dashboard

## Performance Targets

This site is optimized for:
- **LCP**: < 2.5s (hero image preload, above-fold priority)
- **TBT**: < 200ms (lazy loading, code splitting)
- **CLS**: < 0.1 (skeleton loaders, image dimensions)
- **FCP**: < 1.8s (font optimization, critical CSS)

Always test performance changes with Lighthouse/PageSpeed Insights.
