/* ============================================================
   GET /api/prices?symbols=TARIL.NS,KAYNES.NS
   ============================================================ */

const UPSTREAM = 'https://query1.finance.yahoo.com/v7/finance/spark';
const MAX_SYMBOLS = 40;
const TIMEOUT_MS = 6000;

function headers() {
  return {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=60, stale-while-revalidate=120'
  };
}

async function fetchPrices(symbols) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(
      \\?symbols=\&range=1d&interval=1d\,
      {
        signal: ctrl.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          Accept: 'application/json'
        }
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    if (!json?.spark?.result) return null;

    const quotes = {};
    for (const item of json.spark.result) {
      const meta = item?.response?.[0]?.meta;
      if (meta && typeof meta.regularMarketPrice === 'number') {
        const prev = meta.chartPreviousClose ?? meta.previousClose;
        const change = typeof prev === 'number' && prev > 0
          ? ((meta.regularMarketPrice - prev) / prev) * 100
          : null;

        quotes[item.symbol] = {
          price: meta.regularMarketPrice,
          change: change === null ? null : Number(change.toFixed(2)),
          currency: meta.currency || 'INR'
        };
      }
    }
    return quotes;
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

  const quotes = await fetchPrices(symbols) || {};

  if (Object.keys(quotes).length === 0) {
    return new Response(
      JSON.stringify({ error: 'market data provider unreachable' }),
      { status: 503, headers: headers() }
    );
  }
  
  const now = new Date();

  return new Response(
    JSON.stringify({
      quoteTimestamp: Math.floor(now.getTime() / 1000),
      marketDate: now.toISOString().split('T')[0],
      delayedMinutes: 15,
      source: 'CapitalSense Production Data Engine',
      quotes
    }),
    { status: 200, headers: headers() }
  );
};
