# CapitalSense Advisors

Two smallcase strategies — **India Emergent Industries** and **India Execution Engine**.
Static site plus three Netlify Functions. No build step, no framework, no bundler.

---

## Deploy to Netlify

### Option A — drag and drop (fastest)

Netlify's drag-and-drop deploy does not run functions. Use this only to preview the
design. The site renders fine; `/api/*` calls return 404 and the price panels show
their unavailable state, which is the correct behaviour.

1. Go to <https://app.netlify.com/drop>
2. Drag the **`public`** folder onto the page.

### Option B — Git (use this for production)

1. Push this folder to your repo:

   ```bash
   git init
   git add .
   git commit -m "Redesign: two-strategy site, Netlify Functions"
   git remote add origin https://github.com/shubham404-error/Smallcase.git
   git branch -M main
   git push -u origin main --force
   ```

2. In Netlify: **Add new site → Import an existing project → GitHub →** pick the repo.
3. Netlify reads `netlify.toml`, so leave the build settings alone. They resolve to:
   - Build command: none
   - Publish directory: `public`
   - Functions directory: `netlify/functions`
4. **Site settings → Environment variables**, add `GEMINI_API_KEY` if you are enabling
   the research assistant. Leave it unset and the endpoint returns 503, which the front
   end handles.
5. Deploy.

### Local development

```bash
npm install
npm run dev        # netlify dev — serves public/ and runs the functions on :8888
```

---

## What changed for Netlify

The old `server.js` was an Express app. Netlify does not run a persistent Node server,
so each route became a serverless function:

| Old Express route        | New function                   | Public URL        |
| ------------------------ | ------------------------------ | ----------------- |
| `GET /api/finance/:tkr`  | `netlify/functions/prices.js`  | `/api/prices`     |
| *(new)*                  | `netlify/functions/inception.js` | `/api/inception` |
| `POST /api/chat`         | `netlify/functions/chat.js`    | `/api/chat`       |
| `GET /api/benchmark`     | **removed** — see below        | —                 |

`netlify.toml` rewrites `/api/*` onto `/.netlify/functions/*`, so the front-end URLs stay
stable and nothing in `app.js` needs to know it is running on Netlify.

`server.js` is no longer used and can be deleted once the deploy is verified.

---

## Project structure

```
public/                  → published directory
  index.html             page structure
  styles.css             design system
  data.js                portfolio data (weights, theses, risks)
  app.js                 rendering, navigation, price adapter
  _headers               security headers and cache policy
  assets/favicon.svg
netlify/functions/
  prices.js              live price proxy
  inception.js           locked 17 Sep 2026 closing prices
  chat.js                research assistant (disabled by default)
netlify.toml             build, functions and redirect config
```

---

## Before you go live

### 1. Lock the inception prices

`netlify/functions/inception.js` holds the fixed 17 September 2026 closes. Until they are
filled in and `locked` is set to `true`, the site reports `pre-inception` and every price
and return stays hidden. That is deliberate.

On a database stack, immutability is an insert-only table with no `UPDATE` grant. Here the
equivalent guarantee is version control — every change to that file is a commit with an
author and a diff. Capture the prices in one dedicated commit that changes nothing else.

Corporate actions are handled by **appending** to `ADJUSTMENTS`, never by editing a
`closePrice`.

### 2. Replace the market-data source

`prices.js` uses an unofficial Yahoo Finance endpoint. It has no SLA, no support, and its
terms do not clearly permit commercial public display. Move to a licensed NSE-authorised
vendor before launch and confirm whether a "delayed data" notice is mandatory. The
`delayedMinutes` field in the response already carries that value to the front end.

### 3. Compliance sign-off

The footer disclaimer is product-side text, not approved legal copy. The block marked
`.todo` needs the registered entity name, registration number, validity period and
grievance-redressal contact. No production deploy without written sign-off.

### 4. Remove the build annotations

Blocks with the `.devnote` class are notes for the dev team, visible on the page. Delete
them before launch — search `devnote` in `app.js` and `styles.css`.

### 5. Resolve the two open data questions

- The previous site held **Bharti Airtel at 8%**; the current handout has **Techno
  Electric at 8%**. This build uses Techno Electric. One of the two is wrong.
- Confirm every NSE symbol in `data.js`. Several were not specified in the handout and are
  best guesses — `GVT&D.NS`, `SIEMENSENERGY.NS`, `ASTRAMICRO.NS`, `AVALON.NS` and
  `360ONE.NS` in particular. A wrong ticker means a permanently wrong inception price.

---

## Things deliberately not carried over

| Removed                          | Why                                                                                                                         |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `Math.random()` price fallback   | Fabricated market data rendered as live. The single most serious issue in the old build.                                     |
| Hardcoded `fallbackPrice`        | Same problem, quieter — a stale hardcoded number displayed as a live quote.                                                  |
| 3-year NIFTY 500 backtest        | Applied today's weights to the past and treated unlisted stocks as cash at base 100. It manufactured outperformance.         |
| Valuation / IRR simulator        | A slider producing "+78.4%" for a retail visitor is a projected-return tool.                                                 |
| Exclusion audit naming rivals    | Naming listed companies as overvalued and citing third-party research by name is avoidable exposure.                         |
| "Live Basket Value (Base 10k)"   | Σ(price × weight) is not an index — it moves when a ₹7,000 stock is swapped for a ₹200 one at the same weight.               |
| Chart.js, Tailwind CDN, marked.js | Allocation is inline SVG and CSS now. Zero runtime dependencies, and `cdn.tailwindcss.com` is not for production anyway.    |

---

## Accessibility and performance

- WCAG 2.1 AA target. Gains and losses carry a sign, not colour alone.
- Full keyboard navigation with a visible focus ring and a skip link.
- `prefers-reduced-motion` respected.
- Two font files, zero JS dependencies, no render-blocking data fetch.
