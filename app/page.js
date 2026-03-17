"use client";
import { useState, useEffect, useRef } from "react";

const STRIPE_MONTHLY = "https://buy.stripe.com/aFa4gy6QjcMBebZf68fUQ00";
const STRIPE_YEARLY = "https://buy.stripe.com/28E14m1vZbIxgk73nqfUQ01";
const STRIPE_PORTAL = "https://billing.stripe.com/p/login/aFa4gy6QjcMBebZf68fUQ00";

function useReveal() {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, v];
}
function R({ children, d = 0 }) {
  const [ref, v] = useReveal();
  return <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(16px)", transition: `opacity 0.5s ${d}s ease, transform 0.5s ${d}s ease` }}>{children}</div>;
}

const EXAMPLES = [
  { stars: 1, platform: "Google", biz: "Restaurant", review: "Waited over an hour for our food. When it finally came, my steak was cold and the waiter didn't seem to care. Very disappointing.", reply: "Thank you for letting us know about your experience. That's not the standard we hold ourselves to, and I'm sorry your visit fell short. I'd love the chance to make this right — would you reach out to us at [phone/email]? We take feedback like this seriously and want to ensure it doesn't happen again. — James" },
  { stars: 5, platform: "Yelp", biz: "HVAC", review: "Mike and his team were incredible! Fixed our AC on the hottest day of the year. Showed up on time, explained everything, and the price was fair. Highly recommend!", reply: "This means the world to us — thank you! Days like that are exactly why we do what we do. The team will be thrilled to see this. We appreciate you trusting us with your home, and we'll be here anytime you need us. — Mike" },
  { stars: 3, platform: "Facebook", biz: "Cleaning", review: "The cleaning was okay but they missed the baseboards and behind the toilet. Friendly staff though and they were on time.", reply: "Thank you for the honest feedback — we appreciate it. Glad the team was friendly and punctual, but the missed spots aren't acceptable on our end. I've flagged this with the crew, and we'd like to send someone back to address those areas at no cost. Please reach out to us at [phone/email]. — Sarah" },
];

export default function Home() {
  const [dark, setDark] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  useEffect(() => {
    try { const t = localStorage.getItem("nb_theme"); if (t === "dark") { setDark(true); document.documentElement.setAttribute("data-theme", "dark"); } } catch {}
  }, []);

  const toggleDark = () => { const n = !dark; setDark(n); document.documentElement.setAttribute("data-theme", n ? "dark" : ""); localStorage.setItem("nb_theme", n ? "dark" : "light"); };

  return (
    <>
      {/* NAV */}
      <nav style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, background: "color-mix(in srgb, var(--bg) 90%, transparent)", backdropFilter: "blur(16px)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 980, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--terra)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, color: "#fff", lineHeight: 1 }}>N</span>
            </div>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 19, color: "var(--text)", letterSpacing: "-0.3px" }}>NoteBack</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={toggleDark} aria-label="Toggle theme" style={{ width: 36, height: 36, borderRadius: 8, background: "var(--inputBg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: "var(--dim)", fontWeight: 500 }}>{dark ? "Light" : "Dark"}</button>
            <a href="/dashboard" className="hide-mobile" style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13, fontWeight: 500, color: "var(--dim)", textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>Try Free</a>
            <button onClick={() => setShowPricing(true)} style={{ padding: "8px 18px", borderRadius: 8, background: "var(--terra)", border: "none", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Go Pro</button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 980, margin: "0 auto" }}>

        {/* HERO */}
        <section style={{ padding: "clamp(56px, 10vw, 96px) 24px 48px", maxWidth: 700, margin: "0 auto" }}>
          <R>
            <div style={{ display: "inline-block", padding: "6px 14px", border: "1px solid var(--border)", borderRadius: 99, fontSize: 12, fontWeight: 500, color: "var(--dim)", marginBottom: 24, letterSpacing: "0.3px" }}>For business owners who care about their reputation</div>
          </R>
          <R d={0.1}>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(36px, 6vw, 58px)", fontWeight: 400, lineHeight: 1.08, letterSpacing: "-1.5px", color: "var(--text)", marginBottom: 20 }}>
              Your customers left a review.<br /><span style={{ color: "var(--terra)" }}>Write back in seconds.</span>
            </h1>
          </R>
          <R d={0.2}>
            <p style={{ fontSize: "clamp(16px, 2vw, 18px)", color: "var(--dim)", lineHeight: 1.65, maxWidth: 520, marginBottom: 32 }}>
              Paste any review from Google, Yelp, Facebook, or TripAdvisor. NoteBack writes a professional owner reply — tailored to what the customer said, in your voice, in your language.
            </p>
          </R>
          <R d={0.3}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <a href="/dashboard" style={{ padding: "14px 28px", background: "var(--terra)", borderRadius: 10, fontSize: 15, fontWeight: 600, color: "#fff", textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>Write a Reply — Free</a>
              <span style={{ fontSize: 13, color: "var(--light)" }}>1 free reply per day. No account needed.</span>
            </div>
          </R>
        </section>

        {/* TRUST BAR */}
        <R>
          <section style={{ padding: "20px 24px", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "clamp(24px, 5vw, 56px)", flexWrap: "wrap" }}>
              {[{ n: "89%", d: "of customers read owner replies" }, { n: "35%", d: "more revenue with responses" }, { n: "8+", d: "review platforms" }, { n: "8", d: "languages" }].map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: "var(--terra)" }}>{s.n}</div>
                  <div style={{ fontSize: 11, color: "var(--light)", marginTop: 2, maxWidth: 120 }}>{s.d}</div>
                </div>
              ))}
            </div>
          </section>
        </R>

        {/* BEFORE / AFTER EXAMPLES */}
        <section style={{ padding: "56px 24px 32px" }}>
          <R>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--terra)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 8 }}>See real examples</div>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(24px, 3.5vw, 32px)", fontWeight: 400, color: "var(--text)", letterSpacing: "-0.5px" }}>From customer review to professional reply</h2>
            </div>
          </R>
          {EXAMPLES.map((ex, i) => (
            <R key={i} d={i * 0.08}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, marginBottom: 16, borderRadius: 14, border: "1px solid var(--border)", overflow: "hidden" }} className="stack-mobile">
                <div style={{ padding: "20px 22px", background: "var(--inputBg)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{ display: "flex", gap: 2 }}>{[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 12, color: s <= ex.stars ? "var(--star)" : "var(--starOff)" }}>&#9733;</span>)}</div>
                    <span style={{ fontSize: 11, padding: "2px 8px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--dim)", fontWeight: 500 }}>{ex.platform}</span>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--light)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>Customer review</div>
                  <p style={{ fontSize: 14, color: "var(--dim)", lineHeight: 1.6, fontStyle: "italic" }}>"{ex.review}"</p>
                </div>
                <div style={{ padding: "20px 22px", background: "var(--card)", borderLeft: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: "var(--sage)" }}></div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "var(--sage)" }}>NoteBack reply</span>
                  </div>
                  <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.65 }}>{ex.reply}</p>
                </div>
              </div>
            </R>
          ))}
          <R>
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <a href="/dashboard" style={{ fontSize: 14, fontWeight: 600, color: "var(--terra)", textDecoration: "none", borderBottom: "1px solid color-mix(in srgb, var(--terra) 30%, transparent)", paddingBottom: 2 }}>Try it with your own review</a>
            </div>
          </R>
        </section>

        {/* HOW IT WORKS */}
        <section style={{ padding: "48px 24px", maxWidth: 640, margin: "0 auto" }}>
          <R>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--terra)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 8 }}>How it works</div>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(24px, 3.5vw, 32px)", fontWeight: 400, color: "var(--text)", letterSpacing: "-0.5px" }}>Three steps. Thirty seconds.</h2>
            </div>
          </R>
          {[
            { n: "01", t: "Paste the review", d: "Copy a customer review from Google, Yelp, Facebook, or any platform. Select the star rating and your business type." },
            { n: "02", t: "Get your reply", d: "NoteBack writes a professional reply in your voice — tailored to the review, the platform, and your preferred tone and language." },
            { n: "03", t: "Copy and post", d: "One click to copy. Paste it as your owner response. Your customer gets a thoughtful, professional reply." },
          ].map((s, i) => (
            <R key={i} d={i * 0.08}>
              <div style={{ display: "flex", gap: 16, padding: "18px 0", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: "var(--border)", lineHeight: 1, minWidth: 40 }}>{s.n}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{s.t}</div>
                  <div style={{ fontSize: 14, color: "var(--dim)", lineHeight: 1.55 }}>{s.d}</div>
                </div>
              </div>
            </R>
          ))}
        </section>

        {/* WHAT'S INCLUDED */}
        <section style={{ padding: "48px 24px", maxWidth: 800, margin: "0 auto" }}>
          <R>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--terra)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 8 }}>Free vs Pro</div>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(24px, 3.5vw, 32px)", fontWeight: 400, color: "var(--text)", letterSpacing: "-0.5px" }}>Everything you need to manage your reviews</h2>
            </div>
          </R>
          <R d={0.1}>
            <div style={{ borderRadius: 14, border: "1px solid var(--border)", overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "1px solid var(--border)", background: "var(--inputBg)" }}>
                <div style={{ padding: "14px 18px", fontSize: 13, fontWeight: 600, color: "var(--dim)" }}>Feature</div>
                <div style={{ padding: "14px 18px", fontSize: 13, fontWeight: 600, color: "var(--dim)", textAlign: "center" }}>Free</div>
                <div style={{ padding: "14px 18px", fontSize: 13, fontWeight: 600, color: "var(--terra)", textAlign: "center" }}>Pro</div>
              </div>
              {[
                { f: "Daily replies", free: "1", pro: "Unlimited" },
                { f: "Review platforms", free: "All 8+", pro: "All 8+" },
                { f: "Tone styles", free: "2", pro: "All 6" },
                { f: "Languages", free: "English only", pro: "All 8" },
                { f: "Reply history", free: "--", pro: "Saved" },
                { f: "Priority speed", free: "--", pro: "Yes" },
                { f: "Email support", free: "--", pro: "Yes" },
              ].map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: i < 6 ? "1px solid var(--border)" : "none", background: "var(--card)" }}>
                  <div style={{ padding: "12px 18px", fontSize: 13, color: "var(--text)" }}>{r.f}</div>
                  <div style={{ padding: "12px 18px", fontSize: 13, color: "var(--dim)", textAlign: "center" }}>{r.free}</div>
                  <div style={{ padding: "12px 18px", fontSize: 13, color: "var(--text)", fontWeight: 500, textAlign: "center" }}>{r.pro}</div>
                </div>
              ))}
            </div>
          </R>
        </section>

        {/* PRICING */}
        <section style={{ padding: "48px 24px", maxWidth: 800, margin: "0 auto" }} id="pricing">
          <R>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--terra)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 8 }}>Pricing</div>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(24px, 3.5vw, 32px)", fontWeight: 400, color: "var(--text)", letterSpacing: "-0.5px" }}>Start free. Upgrade when you're ready.</h2>
            </div>
          </R>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <R>
              <div style={{ padding: 24, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>Free</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, color: "var(--text)" }}>$0</div>
                <div style={{ fontSize: 13, color: "var(--dim)", marginBottom: 18 }}>Forever</div>
                {["1 reply per day", "2 tones", "English only", "All platforms", "Instant copy"].map(f => <div key={f} style={{ fontSize: 13, color: "var(--dim)", marginBottom: 6, paddingLeft: 16, position: "relative" }}><span style={{ position: "absolute", left: 0, color: "var(--sage)" }}>+</span>{f}</div>)}
                <a href="/dashboard" style={{ display: "block", textAlign: "center", marginTop: 16, padding: 12, borderRadius: 10, border: "1px solid var(--border)", fontSize: 14, fontWeight: 600, color: "var(--text)", textDecoration: "none" }}>Start Free</a>
              </div>
            </R>
            <R d={0.08}>
              <div style={{ padding: 24, background: "var(--card)", border: "2px solid var(--terra)", borderRadius: 14, position: "relative" }}>
                <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: "var(--terra)", color: "#fff", fontSize: 10, fontWeight: 600, padding: "3px 12px", borderRadius: 99, letterSpacing: "0.5px" }}>MOST POPULAR</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>Pro Monthly</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, color: "var(--text)" }}>$19<span style={{ fontSize: 14, fontWeight: 400, color: "var(--dim)", fontFamily: "'DM Sans', sans-serif" }}>/mo</span></div>
                <div style={{ fontSize: 13, color: "var(--terra)", marginBottom: 18 }}>Cancel anytime</div>
                {["Unlimited replies", "All 6 tones", "All 8 languages", "Reply history", "Priority speed", "Email support"].map(f => <div key={f} style={{ fontSize: 13, color: "var(--text)", marginBottom: 6, paddingLeft: 16, position: "relative" }}><span style={{ position: "absolute", left: 0, color: "var(--sage)" }}>+</span>{f}</div>)}
                <a href={STRIPE_MONTHLY} target="_blank" rel="noopener" style={{ display: "block", textAlign: "center", marginTop: 16, padding: 12, borderRadius: 10, background: "var(--terra)", fontSize: 14, fontWeight: 600, color: "#fff", textDecoration: "none" }}>Get Pro</a>
              </div>
            </R>
            <R d={0.16}>
              <div style={{ padding: 24, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>Pro Yearly</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, color: "var(--text)" }}>$149<span style={{ fontSize: 14, fontWeight: 400, color: "var(--dim)", fontFamily: "'DM Sans', sans-serif" }}>/yr</span></div>
                <div style={{ fontSize: 13, color: "var(--terra)", marginBottom: 18 }}>Save 35%</div>
                {["Everything in Pro", "2 months free", "Priority support", "Early access"].map(f => <div key={f} style={{ fontSize: 13, color: "var(--text)", marginBottom: 6, paddingLeft: 16, position: "relative" }}><span style={{ position: "absolute", left: 0, color: "var(--sage)" }}>+</span>{f}</div>)}
                <a href={STRIPE_YEARLY} target="_blank" rel="noopener" style={{ display: "block", textAlign: "center", marginTop: 16, padding: 12, borderRadius: 10, border: "1px solid var(--border)", fontSize: 14, fontWeight: 600, color: "var(--text)", textDecoration: "none" }}>Get Pro Yearly</a>
              </div>
            </R>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: "48px 24px 56px", maxWidth: 600, margin: "0 auto" }}>
          <R><h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(24px, 3.5vw, 32px)", fontWeight: 400, textAlign: "center", marginBottom: 24, color: "var(--text)", letterSpacing: "-0.5px" }}>Common questions</h2></R>
          <FAQ />
        </section>

        {/* FINAL CTA */}
        <section style={{ padding: "56px 24px", textAlign: "center", borderTop: "1px solid var(--border)" }}>
          <R>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 400, marginBottom: 10, color: "var(--text)", letterSpacing: "-0.5px" }}>Every unanswered review is a missed opportunity.</h2>
            <p style={{ fontSize: 15, color: "var(--dim)", maxWidth: 420, margin: "0 auto 24px", lineHeight: 1.6 }}>Your competitors are responding to their reviews. Are you?</p>
            <a href="/dashboard" style={{ display: "inline-block", padding: "14px 32px", background: "var(--terra)", borderRadius: 10, fontSize: 15, fontWeight: 600, color: "#fff", textDecoration: "none" }}>Write Your First Reply</a>
          </R>
        </section>
      </div>

      {/* FOOTER */}
      <footer style={{ padding: "24px 20px", borderTop: "1px solid var(--border)", background: "var(--card)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 20, height: 20, borderRadius: 5, background: "var(--terra)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 10, color: "#fff" }}>N</span></div>
            <span style={{ fontSize: 12, color: "var(--light)" }}>2026 NoteBack. Helping business owners reply to customer reviews.</span>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <a href="mailto:support@noteback.co" style={{ fontSize: 12, color: "var(--dim)", textDecoration: "none" }}>Contact</a>
            <a href="/privacy" style={{ fontSize: 12, color: "var(--dim)", textDecoration: "none" }}>Privacy</a>
            <a href="/terms" style={{ fontSize: 12, color: "var(--dim)", textDecoration: "none" }}>Terms</a>
            <a href={STRIPE_PORTAL} target="_blank" rel="noopener" style={{ fontSize: 12, color: "var(--dim)", textDecoration: "none" }}>Manage Subscription</a>
          </div>
        </div>
      </footer>

      {/* PRICING MODAL */}
      {showPricing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(28,25,23,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 16 }} onClick={() => setShowPricing(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "var(--card)", borderRadius: 16, padding: "clamp(20px, 4vw, 28px)", maxWidth: 400, width: "100%", border: "1px solid var(--border)" }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, fontWeight: 400, color: "var(--text)", marginBottom: 6 }}>Go Pro</h2>
              <p style={{ fontSize: 13, color: "var(--dim)" }}>Unlimited replies. All tones. All languages. Reply history.</p>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[{ name: "Monthly", price: "$19", sub: "/mo", note: "Cancel anytime", href: STRIPE_MONTHLY }, { name: "Yearly", price: "$149", sub: "/yr", note: "Save 35%", pop: true, href: STRIPE_YEARLY }].map(p => (
                <a key={p.name} href={p.href} target="_blank" rel="noopener" style={{ flex: 1, padding: 14, borderRadius: 12, textAlign: "center", background: "var(--card)", border: `2px solid ${p.pop ? "var(--terra)" : "var(--border)"}`, position: "relative", textDecoration: "none" }}>
                  {p.pop && <span style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", background: "var(--terra)", color: "#fff", fontSize: 8, fontWeight: 700, padding: "2px 8px", borderRadius: 99 }}>BEST VALUE</span>}
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--dim)", marginBottom: 3 }}>{p.name}</div>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, color: "var(--text)" }}>{p.price}<span style={{ fontSize: 12, color: "var(--dim)", fontFamily: "'DM Sans', sans-serif" }}>{p.sub}</span></div>
                  <div style={{ fontSize: 10, color: "var(--terra)", marginTop: 2 }}>{p.note}</div>
                </a>
              ))}
            </div>
            <p style={{ textAlign: "center", fontSize: 10, color: "var(--light)" }}>Secure checkout via Stripe.</p>
            <button onClick={() => setShowPricing(false)} style={{ display: "block", margin: "10px auto 0", background: "none", border: "none", fontSize: 12, color: "var(--dim)", cursor: "pointer", textDecoration: "underline" }}>Maybe later</button>
          </div>
        </div>
      )}
    </>
  );
}

/* FAQ Component */
function FAQ() {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: "Is NoteBack really free?", a: "Yes. 1 reply per day, forever. No credit card, no signup required. Pro unlocks unlimited replies for $19/month." },
    { q: "How does it work?", a: "Paste a customer review you received on Google, Yelp, Facebook, or any platform. Select the star rating and your business type. NoteBack writes a professional owner reply in seconds." },
    { q: "Will the replies sound robotic?", a: "No. NoteBack writes like a real business owner. Every reply references specific details from the customer's review and matches the platform's conversational style." },
    { q: "Which platforms does it support?", a: "Google, Yelp, Facebook, TripAdvisor, Trustpilot, BBB, Nextdoor, and any other review platform." },
    { q: "Does it support other languages?", a: "Pro members can write replies in English, Spanish, French, Portuguese, German, Chinese, Japanese, and Korean." },
    { q: "Does NoteBack create fake reviews?", a: "No. NoteBack is a reply tool — it helps business owners respond to real customer reviews they have already received. It does not generate, create, or fake reviews." },
    { q: "Can I cancel anytime?", a: "Yes. No contracts, no cancellation fees. Cancel with one click from your Stripe dashboard." },
  ];
  return faqs.map((f, i) => (
    <R key={i} d={i * 0.03}>
      <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", textAlign: "left", padding: "14px 0", background: "none", border: "none", borderBottom: "1px solid var(--border)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{f.q}</span>
          <span style={{ fontSize: 16, color: "var(--dim)", transition: "transform 0.2s", transform: open === i ? "rotate(45deg)" : "", marginLeft: 12, flexShrink: 0 }}>+</span>
        </div>
        {open === i && <p style={{ fontSize: 14, color: "var(--dim)", lineHeight: 1.6, margin: "8px 0 0", paddingRight: 24 }}>{f.a}</p>}
      </button>
    </R>
  ));
}
