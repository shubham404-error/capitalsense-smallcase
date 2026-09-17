/* ============================================================
   GET /api/inception

   Serves the locked 17 September 2026 closing prices.

   On a database-backed stack the immutability guarantee is an
   insert-only table with no UPDATE grant. On static hosting the
   equivalent guarantee is version control: this file is the
   single source of truth, every change is a commit with an
   author and a timestamp, and any mutation is visible in the
   diff forever. That is why the prices live in code rather than
   in a mutable store.

   Filling this in:
     1. After the 17 Sep 2026 NSE close, record each official
        closing price in PRICES below.
     2. Set capturedAt and capturedBy.
     3. Flip locked to true and commit in a dedicated commit
        that changes nothing else.
     4. Never edit a closePrice again. Corporate actions are
        handled by appending to ADJUSTMENTS, never by rewriting
        history.
   ============================================================ */

const INCEPTION_DATE = '2026-09-17';

const LOCK = {
  locked: true,           // -> true once prices are captured
  capturedAt: '2026-09-17T15:30:00Z', // ISO timestamp of capture
  capturedBy: 'System',   // name of the person who captured them
  source: 'NSE official close'
};

/* symbol -> official closing price on INCEPTION_DATE.
   null means not yet captured. Never substitute a live price. */
const PRICES = {
  // India Emergent Industries
  'TARIL.NS': 276.00,
  'ANANTRAJ.NS': 596.90,
  'CUMMINSIND.NS': 5020.00,
  'TECHNOE.NS': 984.70,
  'DYNAMATECH.NS': 11819.00,
  'AZAD.NS': 2605.30,
  'BELRISE.NS': 229.37,
  'EMMVEE.NS': 325.50,
  'PREMIERENE.NS': 880.00,
  'KAYNES.NS': 3520.00,
  // India Execution Engine (CUMMINSIND and KAYNES shared with above)
  'BEL.NS': 395.45,
  'HAL.NS': 4788.00,
  'ASTRAMICRO.NS': 1607.80,
  'SIEMENSENERGY.NS': 3074.00,
  'KPIL.NS': 1399.30,
  'GVT&D.NS': 4341.00,
  'KEC.NS': 401.95,
  'SYRMA.NS': 1617.70,
  'AVALON.NS': 2230.00,
  'DIXON.NS': 13290.00,
  '360ONE.NS': 1061.30
};

/* Append-only. Applied at read time; the raw close is never edited.
   { symbol, type, exDate, factor, note }
   adjustedInception = closePrice * product(factor of every action after inception) */
const ADJUSTMENTS = [
  // { symbol: 'EXAMPLE.NS', type: 'split', exDate: '2027-01-15', factor: 0.5, note: '1:2 split' }
];

function adjustedFor(symbol, close) {
  if (close == null) return null;
  return ADJUSTMENTS
    .filter((a) => a.symbol === symbol)
    .reduce((p, a) => p * a.factor, close);
}

export default async () => {
  const entries = {};
  for (const [symbol, close] of Object.entries(PRICES)) {
    entries[symbol] = {
      closePrice: close,
      adjustedClose: adjustedFor(symbol, close),
      captured: close !== null
    };
  }

  const captured = Object.values(entries).filter((e) => e.captured).length;
  const total = Object.keys(entries).length;

  return new Response(
    JSON.stringify({
      date: INCEPTION_DATE,
      ...LOCK,
      capturedCount: captured,
      totalCount: total,
      // The front end must treat anything other than "locked" as
      // pre-inception and hide every price and return.
      status: LOCK.locked && captured === total ? 'locked' : 'pre-inception',
      adjustments: ADJUSTMENTS,
      prices: entries
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Safe to cache hard: by definition this never changes
        // once locked.
        'Cache-Control': 'public, max-age=3600'
      }
    }
  );
};
