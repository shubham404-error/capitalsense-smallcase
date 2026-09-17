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
  locked: false,          // -> true once prices are captured
  capturedAt: null,       // ISO timestamp of capture
  capturedBy: null,       // name of the person who captured them
  source: 'NSE official close'
};

/* symbol -> official closing price on INCEPTION_DATE.
   null means not yet captured. Never substitute a live price. */
const PRICES = {
  // India Emergent Industries
  'TARIL.NS': null,
  'ANANTRAJ.NS': null,
  'CUMMINSIND.NS': null,
  'TECHNOE.NS': null,
  'DYNAMATECH.NS': null,
  'AZAD.NS': null,
  'BELRISE.NS': null,
  'EMMVEE.NS': null,
  'PREMIERENE.NS': null,
  'KAYNES.NS': null,
  // India Execution Engine (CUMMINSIND and KAYNES shared with above)
  'BEL.NS': null,
  'HAL.NS': null,
  'ASTRAMICRO.NS': null,
  'SIEMENSENERGY.NS': null,
  'KPIL.NS': null,
  'GVT&D.NS': null,
  'KEC.NS': null,
  'SYRMA.NS': null,
  'AVALON.NS': null,
  'DIXON.NS': null,
  '360ONE.NS': null
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
