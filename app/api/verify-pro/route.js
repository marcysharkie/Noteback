// app/api/verify-pro/route.js
// Checks Stripe for an active subscription matching the given email

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return Response.json({ error: "Valid email required" }, { status: 400 });
    }

    const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
    if (!STRIPE_SECRET) {
      console.error("STRIPE_SECRET_KEY not set");
      return Response.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Search Stripe customers by email
    const custRes = await fetch(
      `https://api.stripe.com/v1/customers?email=${encodeURIComponent(email.toLowerCase().trim())}&limit=5`,
      { headers: { Authorization: `Bearer ${STRIPE_SECRET}` } }
    );

    if (!custRes.ok) {
      console.error("Stripe customer search failed:", await custRes.text());
      return Response.json({ error: "Could not verify subscription" }, { status: 500 });
    }

    const custData = await custRes.json();

    if (!custData.data || custData.data.length === 0) {
      return Response.json({ isPro: false, reason: "no_customer" });
    }

    // Check each customer for active subscriptions
    for (const customer of custData.data) {
      const subRes = await fetch(
        `https://api.stripe.com/v1/subscriptions?customer=${customer.id}&status=active&limit=5`,
        { headers: { Authorization: `Bearer ${STRIPE_SECRET}` } }
      );

      if (!subRes.ok) continue;

      const subData = await subRes.json();

      if (subData.data && subData.data.length > 0) {
        // Found an active subscription
        const sub = subData.data[0];
        return Response.json({
          isPro: true,
          plan: sub.items.data[0]?.price?.recurring?.interval === "year" ? "yearly" : "monthly",
          currentPeriodEnd: sub.current_period_end,
          email: email.toLowerCase().trim(),
        });
      }

      // Also check trialing status
      const trialRes = await fetch(
        `https://api.stripe.com/v1/subscriptions?customer=${customer.id}&status=trialing&limit=5`,
        { headers: { Authorization: `Bearer ${STRIPE_SECRET}` } }
      );

      if (trialRes.ok) {
        const trialData = await trialRes.json();
        if (trialData.data && trialData.data.length > 0) {
          const sub = trialData.data[0];
          return Response.json({
            isPro: true,
            plan: "trial",
            currentPeriodEnd: sub.current_period_end,
            email: email.toLowerCase().trim(),
          });
        }
      }
    }

    return Response.json({ isPro: false, reason: "no_active_subscription" });
  } catch (err) {
    console.error("Verify pro error:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
