/* ============================================================
   GET /api/prices?symbols=TARIL.NS,KAYNES.NS

   Replaces the Express /api/finance/:ticker route.

   Contract:
     200 -> { asOf, delayedMinutes, source, quotes: { SYM: { price, change, currency } } }
     503 -> { error }  when the upstream feed cannot be reached

   Hard rule: this function never invents a number. If a symbol
   fails, it is simply absent from `quotes` and the front end
   renders the unavailable state for that row. There is no
   fallback price, no simulated tick, and no substituting the
   inception price for a missing current price.
   ============================================================ */

const UPSTREAM = 'https://query1.finance.yahoo.com/v8/finance/chart/';
const MAX_SYMBOLS = 40;
const TIMEOUT_MS = 6000;

function headers() {
  return {
    'Content-Type': 'application/json',
    // Short cache: prices move, but this protects the upstream
    // from a refresh-button loop and keeps Netlify usage sane.
    'Cache-Control': 'public, max-age=60, stale-while-revalidate=120'
  };
}

async function fetchOne(symbol) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(
      `${UPSTREAM}${encodeURIComponent(symbol)}?interval=1d&range=1d`,
      {
        signal: ctrl.signal,
        headers: {
          // Yahoo rejects requests without a browser-like UA.
          'User-Agent': 'Mozilla/5.0 (compatible; CapitalSense/1.0)',
          Accept: 'application/json'
        }
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;
    if (!meta || typeof meta.regularMarketPrice !== 'number') return null;

    const prev = meta.chartPreviousClose ?? meta.previousClose;
    const change =
      typeof prev === 'number' && prev > 0
        ? ((meta.regularMarketPrice - prev) / prev) * 100
        : null; // null, never a guess

    return {
      symbol,
      price: meta.regularMarketPrice,
      change: change === null ? null : Number(change.toFixed(2)),
      currency: meta.currency || 'INR'
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export default async (request) => {
  const url = new URL(request.url);
  const raw = (url.searchParams.get('symbols') || '').trim();

  if (!raw) {
    return new Response(JSON.stringify({ error: 'symbols parameter required' }), {
      status: 400,
      headers: headers()
    });
  }

  const symbols = raw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => /^[A-Za-z0-9.&_-]{1,20}$/.test(s))
    .slice(0, MAX_SYMBOLS);

  if (!symbols.length) {
    return new Response(JSON.stringify({ error: 'no valid symbols' }), {
      status: 400,
      headers: headers()
    });
  }

  const settled = await Promise.all(symbols.map(fetchOne));
  const quotes = {};
  for (const q of settled) {
    if (q) quotes[q.symbol] = { price: q.price, change: q.change, currency: q.currency };
  }

  // Every symbol failed: treat as a feed outage, not an empty result.
  if (Object.keys(quotes).length === 0) {
    return new Response(
      JSON.stringify({ error: 'market data provider unreachable' }),
      { status: 503, headers: headers() }
    );
  }

  return new Response(
    JSON.stringify({
      asOf: new Date().toISOString(),
      delayedMinutes: 15, // confirm against your provider agreement
      source: 'Yahoo Finance',
      quotes
    }),
    { status: 200, headers: headers() }
  );
};
