/* ============================================================
   POST /api/chat   { prompt: string }

   Replaces the Express /api/chat route. The API key stays
   server-side and is never sent to the browser.

   This endpoint is NOT part of the P0 launch. It is included so
   the existing feature keeps working after the move to Netlify,
   but it should stay disabled until compliance has reviewed the
   guardrails below. An assistant on a SEBI-regulated advisory
   site that answers "should I buy this" is a regulatory problem,
   not a product feature.
   ============================================================ */

const MODEL = 'gemini-2.0-flash';
const MAX_PROMPT = 800;

const SYSTEM_RULES = `
You are the research assistant on the CapitalSense Advisors website.

You may: explain the two smallcase strategies, their themes, why a
company sits in a particular theme, what the team monitors, and the
stated risks.

You must never:
- give personalised investment advice or tell anyone what to buy,
  sell or hold
- project, estimate or imply future returns, price targets or CAGRs
- describe any holding as guaranteed, certain, a multibagger, or
  best-in-class
- state a live price, a return figure, or any number not present in
  the material you were given
- comment on the suitability of a strategy for an individual

If asked for any of the above, say plainly that you cannot help with
it and point the person to the disclosures page.

Tone: a good investor explaining an idea to another investor.
Conviction without hype. Short answers. Always mention the relevant
stated risk when discussing a holding.
`.trim();

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });

export default async (request) => {
  if (request.method !== 'POST') {
    return json({ error: 'method not allowed' }, 405);
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return json({ error: 'assistant is not configured' }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid JSON body' }, 400);
  }

  const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';
  const context = typeof body?.context === 'string' ? body.context.trim() : '';
  if (!prompt) return json({ error: 'prompt required' }, 400);
  if (prompt.length > MAX_PROMPT) {
    return json({ error: 'prompt too long' }, 413);
  }
  
  const finalPrompt = context ? `Context: ${context}\n\nUser Question: ${prompt}` : prompt;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_RULES }] },
          contents: [{ role: 'user', parts: [{ text: finalPrompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 700 }
        })
      }
    );

    if (!res.ok) {
      return json({ error: 'assistant unavailable' }, 502);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return json({ error: 'assistant returned no answer' }, 502);

    return json({ response: text });
  } catch {
    return json({ error: 'assistant unavailable' }, 502);
  }
};
