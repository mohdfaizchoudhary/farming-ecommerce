# SMS Farmstead — Kadaknath Hero Integration

## What changed
- Added `src/components/ui/hero-section-7.tsx` with the animated Kadaknath rooster, egg nest and hatching chick hero.
- Replaced the homepage `<HomeHero />` usage in `src/app/page.tsx` with `<FloatingFoodHero />`.
- Appended responsive animation styles to `src/app/globals.css`.

## Existing project structure
This upload contains the `src/` directory only (no `package.json`, lockfile, `tailwind.config.*`, or `tsconfig.json`). The supplied stylesheet uses Tailwind CSS v3 directives (`@tailwind base/components/utilities`), so the existing project setup was preserved. The project uses the `@/` import alias in its source files.

## Install / run
Keep the existing project-level configuration and dependencies. The component uses only Next.js `Link` and CSS; no additional package is required. Ensure the project's `tsconfig.json` maps `@/*` to `./src/*` and that Tailwind scans `./src/**/*.{js,ts,jsx,tsx,mdx}`.

## Image note
The rooster and chick image URLs are remote assets. For production, download appropriately licensed images into `public/images/` and update the two `src` values in the component. The rooster image URL is a Kadaknath reference image; confirm usage rights before commercial deployment.
