const rateLimitMap = new Map();

function getRateLimitKey(req) {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  const date = new Date().toISOString().split("T")[0];
  return `${ip}:${date}`;
}

function checkRateLimit(key, limit = 1) {
  const now = Date.now();
  for (const [k, v] of rateLimitMap) {
    if (now - v.timestamp > 86400000) rateLimitMap.delete(k);
  }
  const entry = rateLimitMap.get(key);
  if (!entry) { rateLimitMap.set(key, { count: 1, timestamp: now }); return { allowed: true, remaining: limit - 1 }; }
  if (entry.count >= limit) return { allowed: false, remaining: 0 };
  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { review, stars, platform, bizType, bizName, ownerName, tone, language, proEmail } = body;
    if (!review || !stars || !platform) return Response.json({ error: "Missing required fields" }, { status: 400 });

    // Check Pro status server-side via Stripe
    let isPro = false;
    if (proEmail) {
      try {
        const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
        if (STRIPE_SECRET) {
          const custRes = await fetch(`https://api.stripe.com/v1/customers?email=${encodeURIComponent(proEmail.toLowerCase().trim())}&limit=3`, { headers: { Authorization: `Bearer ${STRIPE_SECRET}` } });
          if (custRes.ok) {
            const custData = await custRes.json();
            for (const cust of (custData.data || [])) {
              const subRes = await fetch(`https://api.stripe.com/v1/subscriptions?customer=${cust.id}&status=active&limit=1`, { headers: { Authorization: `Bearer ${STRIPE_SECRET}` } });
              if (subRes.ok) { const subData = await subRes.json(); if (subData.data?.length > 0) { isPro = true; break; } }
              const trialRes = await fetch(`https://api.stripe.com/v1/subscriptions?customer=${cust.id}&status=trialing&limit=1`, { headers: { Authorization: `Bearer ${STRIPE_SECRET}` } });
              if (trialRes.ok) { const trialData = await trialRes.json(); if (trialData.data?.length > 0) { isPro = true; break; } }
            }
          }
        }
      } catch (e) { console.error("Stripe check error:", e); }
    }

    if (!isPro) {
      const key = getRateLimitKey(req);
      const { allowed } = checkRateLimit(key, 1);
      if (!allowed) return Response.json({ error: "limit", remaining: 0 }, { status: 429 });
    }

    const ps = { Google: "Keep it professional and concise", Yelp: "Slightly more detailed and personal", Facebook: "Slightly more casual and conversational", TripAdvisor: "Acknowledge the travel/hospitality context", Trustpilot: "Professional and solution-oriented", BBB: "Formal, demonstrate commitment to resolution", Nextdoor: "Neighborly and community-focused", Other: "Keep it professional and concise" };
    const langNote = language && language !== "English" ? `\n\nIMPORTANT: Write the ENTIRE response in ${language}. Do not write in English.` : "";

    const prompt = `You are a professional review response writer for a ${bizType || "local business"}${bizName ? ` called "${bizName}"` : ""}. Write a response to this ${stars}-star review posted on ${platform}.\n\nTone: ${tone || "Warm & Friendly"}\n${ownerName ? `Sign off as: — ${ownerName}` : "Sign off with a dash and a generic first name."}\n\nRULES:\n- Address the reviewer personally if possible\n- Reference something SPECIFIC from their review\n- Positive reviews (4-5 stars): 2-4 sentences\n- Negative reviews (1-2 stars): 3-5 sentences, acknowledge, apologize without admitting fault, offer offline resolution with "[your phone/email]" placeholder\n- Neutral (3 stars): 2-4 sentences\n- Sound human, not corporate\n- NEVER say "We apologize for any inconvenience"\n- NEVER be defensive\n- Platform style: ${ps[platform] || ps.Other}${langNote}\n\nThe review:\n"${review}"\n\nRespond with ONLY the review response text.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 500, messages: [{ role: "user", content: prompt }] }),
    });

    if (!response.ok) { console.error("Claude API error:", await response.text()); return Response.json({ error: "Failed to generate response." }, { status: 500 }); }
    const data = await response.json();
    return Response.json({ response: data.content?.[0]?.text || "Something went wrong." });
  } catch (err) { console.error("Server error:", err); return Response.json({ error: "Something went wrong." }, { status: 500 }); }
}
