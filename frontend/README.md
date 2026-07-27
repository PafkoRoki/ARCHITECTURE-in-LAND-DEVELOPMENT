# Architecture in Land Development

React and TypeScript landing page with GSAP-powered scrolling and section
transitions. Vite builds the browser application, and a Cloudflare Pages worker
serves the production output.

## Architecture

- `src/App.tsx` owns the loader and smooth-scroll page shell.
- `src/components/` contains the gallery, article, benefits, and loader views.
- `src/hooks/` owns smooth scrolling and section-specific animation lifecycles.
- `src/content/landingPageContent.ts` is the typed source for page copy, images,
  and benefit ordering.
- Section styles live beside their components and are aggregated by the page
  composer in their original cascade order.
- `src/lib/gsap.ts` centralizes GSAP plugin registration.

## Behavior contracts

- `ScrubbedBentoGallery` remains the page composer and receives
  `isScrollReady: boolean`.
- The loader remains outside the smooth-scroll wrapper and keeps the app inert
  until its transition finishes.
- Gallery image order, article copy, benefit order, DOM nesting, CSS class names,
  breakpoints, and animation timing are intentional and covered by tests.
- The benefits section is interactive only when its desktop/no-reduced-motion
  media query matches; otherwise it renders a fully expanded static list.
- Every animation hook must release timers, listeners, tweens, media-query
  contexts, and inline styles that it owns.

## Commands

Run commands from this directory with [Bun](https://bun.sh/):

```sh
bun install
bun run dev
bun run lint
bun run test
bun run build
```

`bun run pages:dev` builds and previews the Cloudflare Pages application.
Production deployment is performed by `.github/workflows/deploy-frontend.yml`
after linting, tests, and the production build succeed.
