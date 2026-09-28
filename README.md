# VEXO — Next.js + React + Tailwind v4 + Supabase

## Run it
```bash
npm install
cp .env.example .env.local      # add your Supabase URL + anon key (optional)
npm run dev                     # http://localhost:3000
```
No Supabase yet? It still runs — data falls back to `src/lib/data/fallback.ts`.

## Connect Supabase
1. Create a project → **SQL Editor** → run `supabase/schema.sql`, then `supabase/seed.sql`.
2. **Project Settings → API** → copy URL + anon key into `.env.local`.
3. Restart `npm run dev`. Products and tabs now come from your database; the footer form saves emails.

To use Supabase Storage images, upload to a **public** bucket and put the public URL in `image_url`
(`next.config.ts` already allows your project's storage domain).

## Folder structure (Atomic Design)
```
src/
├─ app/                 Next.js routes: layout (font, <html>), page (fetches data), globals.css
├─ components/
│  ├─ atoms/            Smallest pieces, no business logic
│  │                    Panel, Button, Tag, Text, Eyebrow, Icons, IconCircle, HeartButton,
│  │                    AnimatedHeading, RevealImage, ScrollText
│  ├─ molecules/        A few atoms working together
│  │                    NavLinks, TabBar, ProductCard, PickCard, HeroNote, VideoCard,
│  │                    SubscribeForm, FooterColumn
│  ├─ organisms/        Full page sections
│  │                    SiteHeader, Hero, ShopTheEdit, TopPicks, PosterSection,
│  │                    NewArrivals, PosterFeature, SiteFooter
│  └─ templates/        Page layout: which sections, in what order
│                       LandingTemplate
├─ actions/             Server Actions (subscribe → Supabase insert)
├─ hooks/               useInView (fail-safe viewport detection)
└─ lib/                 types, utils, static content, Supabase client, data queries
supabase/               schema.sql (tables + RLS), seed.sql (sample rows)
```
Rule of thumb: a component may only import from its own level or **lower**
(organisms → molecules → atoms), never upward.

## The pipeline (how a request becomes a page)
1. **Request** hits `app/page.tsx` (a Server Component).
2. It calls `getEditTabs()` + `getNewArrivals()` in `lib/data/queries.ts` **on the server**.
   Those use `lib/supabase/server.ts`. No Supabase or an error → fallback data.
3. Data is passed as props: `page → LandingTemplate → organisms → molecules → atoms`.
4. Next.js renders HTML on the server and caches it for 60s (`export const revalidate = 60`).
5. In the browser, only the `"use client"` components hydrate (tabs, animations, heart, form).
6. **Footer form** → `SubscribeForm` calls the Server Action `actions/subscribe.ts` →
   Supabase `insert` → returns `{ status, message }` → UI updates via `useActionState`.

## The animation pipeline
- `layout.tsx` adds `.js` to `<html>` before paint. All "start hidden" styles are scoped to `.js`,
  so if JavaScript fails, everything is simply visible.
- **Headings** (`AnimatedHeading`): text → letters, each with a fixed pseudo-random delay
  (deterministic so server/client HTML match) → `useInView` adds `.in` → CSS animates
  hidden → striped → solid.
- **Pictures** (`RevealImage`): clipped + zoomed → `.shown` → CSS transition wipes up and zooms out.
- **Giant text** (`ScrollText`): scroll → `requestAnimationFrame` → translateX written directly
  to the DOM (no React re-render per frame).
- **Hero**: pure CSS `animate-*` utilities with staggered `animation-delay`.
- Every hidden state has a fallback (IntersectionObserver + scroll check + 8s CSS failsafe),
  and `prefers-reduced-motion` turns all motion off.

## Replace the images
Everything in `public/images` was cut from design screenshots, so it's low resolution.
Swap in your original photos with the same file names (keep `hero-model.png` and
`cutout-hood.png` as transparent PNGs).
