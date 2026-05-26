## Goal
- Build a fully functional, animated landing page for Savlot + Architects from a Figma export with scroll-triggered, hover, and video effects while preserving the original visual design.

## Constraints & Preferences
- Do not change original design (colors, icons, layout, fonts)
- Fonts: Geom, Host Grotesk, Playfair Display + Bank Gothic Light, Arial MT Black
- All scroll-triggered animations use Intersection Observer
- Build tool: Parcel v2
- No button hover effects in JS — user handles them manually
- Do not change existing class names/IDs unless discussed
- User instructed not to commit/push until told

## Progress
### Done
- Created `script.js` with all animation/interaction logic
- Added section IDs for nav
- Hero: video background + gradient overlay, hero content slideshow (title/desc cycle), single video with 8s minimum duration per slide, `.hero-section` set to `height: 100vh`
- Service: background gradient shifts on scroll, sticky heading + sticky card stacking (ascending z-index 2,3,4), custom "VIEW MORE" cursor, doodle canvas layer, explore link hover
- Featured Projects: complete re‑creation from `ai_studio_code (2).html` reference — `.carousel > .list > .item` DOM reorder + CSS @keyframes, 6‑item cycle with offscreen buffer, autoplay every 8s, `<video autoplay muted loop playsinline>` inside each `.item` shown only on `nth-child(1)`, `nextMain` keyframe includes `opacity 0→1` fade, `.carousel` has `background: #1a1a1a` to mask white flash during DOM reorder
- Carousel arrows: changed to chevron SVGs (`.prev-btn`/`.next-btn` with inline SVG `fill="currentColor"`), hover invert via CSS `color` transition
- Pill‑menu header: `position: absolute; right: 0; top: 0;` with `max-width: 54px → 600px` on hover, `overflow: hidden` collapsed / `overflow: visible` on hover, background `rgb(255, 255, 255, 0.3)`, height 45px. Social-links-wrapper `position: absolute; left: 50%; transform: translateX(-50%);` centered. Submenu under SERVICE with glass background (`backdrop-filter: blur(10px)`), smooth `opacity/visibility` transition
- About: photo/content fade-slide, line scale-in, number counters, category labels fade-in
- Why Choose Us: heading + cards scroll-reveal, benefit card flip effect — CSS grid stacking (`.flip-inner { display: grid }`) with backface-visibility
- Testimonials: heading slide-in, infinite horizontal card scroll, pause on hover
- CTA: form slide-up, BUILD word letter-by-letter baseline build-up, button hover removed
- Footer: blue glow fades in via CSS class `.footer-glow`, logo zoom-in + text fade-up on scroll-trigger
- Lenis smooth scroll: loaded via CDN, initialized with global `Lenis` constructor
- Social icons: CSS mask approach with hover brand colors
- Loading screen overlay: black background, logo + animated loading bar, fades out 1.5s after page load, removed from DOM after fade
- Custom scrollbar: native scrollbar hidden, custom blue (#1A365D) 8px thumb synced with Lenis — track is clickable (jump to position), thumb is draggable (mousedown/mousemove/mouseup handlers)
- Custom cursor on service cards: moved from `.interiro-card`/`.turnkey-card` to child `.frame-parent` (separated sticky targets from cursor targets to keep card stack working)
- Submenu glass effect: `backdrop-filter: blur(10px)` added; removed manual `-webkit-backdrop-filter` prefix to prevent Parcel's CSS optimizer from stripping the unprefixed version
- Build script: changed `--dist-dir ./build` → `--dist-dir ./dist`
- Added `browserslist` to `package.json`: `"> 0.5%, last 2 versions, not dead"`
- `.gitignore` updated to exclude `dist/`, `build/`, `.parcel-cache/`, `node_modules/`
- Hero video: `'./public/hero-video.mp4'` string replaced with `new URL('./public/hero-video.mp4', import.meta.url).href` so Parcel resolves and copies the file to dist with content hash
- Font display: added `font-display: block` to both `@font-face` rules to prevent FOUT on loading screen
- All section heights changed from `746px` to `100vh` / `min-height: 100vh`
- Content width constraints: added `width: 100%; max-width: 1440px; margin: 0 auto;` to about, benefit, testimonial, cta, and footer sections (bg colors constrained too); hero, service, project sections remain full-width

### In Progress
- (none)

### Blocked
- (none)

## Key Decisions
- Lenis: loaded via CDN `<script>` tag instead of ES module import (previous import caused entire module to silently fail)
- Removed JS-based scroll snap, replaced with native Lenis smooth scroll
- Hero video: reverted from video sequence back to single video for all 3 slides, with 8s minimum duration before cycling next content
- Benefit flip: using CSS grid stacking (`.flip-inner { display: grid }`) instead of `position: absolute` to avoid breaking card2's flex width
- Featured Projects: abandoned early `pj-track`/`pj-item` approach; full re‑creation from `ai_studio_code (2).html` reference with `left: 50%` + `calc()` positioning, 6 items (6th as offscreen buffer)
- Carousel autoplay: 8s interval, no pause‑on‑hover, `startAutoplay()` always clears previous interval
- Pill‑menu: `position: absolute; right: 0; top: 0;` (not in flex flow), `overflow: hidden` collapsed / `overflow: visible` hover, `height: 45px`. Social-links-wrapper `position: absolute; left: 50%; transform: translateX(-50%);`. Submenu uses `opacity/visibility` instead of `display: none/block`
- Loading screen: replaced complex SVG animation with lightweight logo + loading bar — 1.5s fill animation
- Custom scrollbar: native scrollbar hidden entirely; custom blue thumb draggable + track clickable via JS
- Hero video path: used `new URL('./public/hero-video.mp4', import.meta.url).href` instead of a raw string so Parcel resolves and copies the file to production build
- Submenu glass: removed manual `-webkit-backdrop-filter` prefix (left only `backdrop-filter`) to prevent Parcel's lightningcss optimizer from stripping the unprefixed version
- Font display: `font-display: block` on `@font-face` to keep loading screen text invisible until custom font is ready, eliminating flash
- Width constraints applied at section level (not inner wrappers) to keep backgrounds constrained too; hero/service/project left full-width since they have bg videos/graphics

## Next Steps
- Wait for user feedback on height/width changes
- Wait for user go-ahead before committing/pushing

## Critical Context
- `npm start` works via `cmd /c "npm start"` (PowerShell execution policy blocks direct `npm`)
- Server auto-assigns port if 1234 taken
- Lenis script tag must load BEFORE the module script: `<script src="...lenis.min.js"></script>` then `<script type="module" src="./script.js" defer></script>`
- `.insta-icon` + `.insta-icon2` classes share same mask styles but different sizes (22px vs 30px)
- `insta-icon-yt` is WhatsApp (phone icon in Vector1.svg), hover color #25d366
- Service cards use ascending z-index (2, 3, 4) so card 3 appears on top during sticky stack
- Benefit cards: `.card1 { flex: 1.0232 }`, `.card2` has no flex, `.card3 { flex: 1 }` — card2 is content-sized; flip uses grid stacking to preserve width
- Featured Projects: `.carousel` uses `.carousel.next`/`.carousel.prev` class toggles, 6 `.item` divs (6th at `calc(50% + 840px); opacity: 0` as hidden buffer), card positions via `left: 50%` + calc + `transform: translateY(-50%)`
- Pill‑menu CSS stable state: `.pill-menu { position: absolute; right: 0; top: 0; height: 45px; max-width: 54px; overflow: hidden; }` → `:hover { max-width: 600px; background: rgb(255,255,255,0.3); overflow: visible; }`. `.nav-links { padding-left: 20px; margin-right: 20px; opacity: 0; pointer-events: none; font-family: 'Geom', 'sans-serif'; }` → `:hover .nav-links { opacity: 1; pointer-events: auto; }`. Submenu glass uses only `backdrop-filter: blur(10px)` (no `-webkit-` prefix to prevent optimizer stripping)
- Custom scrollbar: `#scroll-track { position: fixed; right: 0; top: 0; width: 8px; height: 100%; z-index: 99998; cursor: pointer; }` + `#scroll-thumb { position: absolute; right: 0; width: 8px; background: #1A365D; cursor: grab; }`. JS handles mousedown/mousemove/mouseup drag + track click to jump to position via Lenis
- Custom cursor on service cards: targets `.interiro-card > .frame-parent, .turnkey-card > .frame-parent` (inner content area, not outer card wrapper)
- Hero video uses `new URL('./public/hero-video.mp4', import.meta.url).href` for Parcel to resolve and copy the file to dist with content hash
- `font-display: block` on all `@font-face` rules for loading screen text
- All section heights changed from `746px` to `100vh`/`min-height: 100vh`
- Content width constraints (max-width 1440px) added to about, benefit, testimonial, cta, footer sections; hero, service, project left full-width
- `browserslist: "> 0.5%, last 2 versions, not dead"` in package.json
- `.cta-section` and `.form-div` group selector also has `min-height: 100vh`
- `testimonial-section` is self-contained layout with `width: 100%; max-width: 1440px; margin: 0 auto;`

## Relevant Files
- `index.css`: all styles, section height/width constraints, custom scrollbar, carousel, pill-menu, loading screen
- `index.html`: HTML structure, Lenis CDN, module script, @font-face with font-display: block, loading overlay
- `script.js`: all JS logic (animations, scrollbar, hero slideshow, service cards, carousel, etc.)
- `global.css`: CSS variables
- `public/`: SVG icons, MP4, JPG/PNG, OTF/TTF fonts
- `package.json`: npm scripts, browserslist
- `.gitignore`: excludes dist/, build/, .parcel-cache/, node_modules/
