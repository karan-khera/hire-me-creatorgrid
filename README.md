# CreatorGrid portfolio · Karan Khera

Public site: https://karan-khera.github.io/hire-me-creatorgrid/

A four-page, static portfolio for the CreatorGrid Founder's Associate application.

## Pages
- `index.html` — landing page, projects, social proof and contact
- `brand-partnership/index.html` — FamPay Rewards
- `revenue-growth/index.html` — Google Play Gift Cards
- `product-strategy/index.html` — Monzy

## Design & interactive behavior
- `site-design.css` — shared typography (Georgia + Inter), #023047 navy palette, #219ebc accents, case-study navigation and music dock styling
- `site-navigation.js` — same-origin navigation between portfolio pages without remounting the top-level music player
- `favicon.png` — cropped user headshot, used on all pages
- `assets/` — headshot, six original testimonial screenshots, and the music file `assets/music/rest-is-part-of-work.mp3`

The player is off by default. When a visitor starts the music and follows an internal site link in the same tab, content is loaded in a same-origin frame while the existing music player stays mounted, maintaining playback without restarting. Hard reloads, new tabs and external links create separate document sessions.

GitHub Pages should publish from the `main` branch and `/(root)`. The site files are edited directly in this repository; no versioned ZIPs required.
