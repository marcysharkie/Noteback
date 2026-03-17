"use client";
import { useState, useEffect, useRef } from "react";

const STRIPE_MONTHLY = "https://buy.stripe.com/aFa4gy6QjcMBebZf68fUQ00";
const STRIPE_YEARLY = "https://buy.stripe.com/28E14m1vZbIxgk73nqfUQ01";
const STRIPE_PORTAL = "https://billing.stripe.com/p/login/aFa4gy6QjcMBebZf68fUQ00";

function useReveal() {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.08 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return [ref, v];
}
function R({ children, d = 0 }) {
  const [ref, v] = useReveal();
  return <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(18px)", transition: `opacity 0.7s ${d}s ease, transform 0.7s ${d}s ease` }}>{children}</div>;
}

const DEMO_REVIEWS = [
  { stars: 1, text: "Waited over an hour for our food. When it finally came, my steak was cold and the waiter didn't seem to care. Very disappointing.", platform: "Google", biz: "Restaurant", reply: "Thank you for taking the time to share your experience. I'm truly sorry your visit didn't meet the standard we hold ourselves to — a cold steak and inattentive service is not who we are. I'd love the chance to make this right personally. Please reach out to me at [email] so I can ensure your next visit reflects the dining experience we're known for. — Marco" },
  { stars: 5, text: "Mike and his team were incredible! Fixed our AC on the hottest day of the year. Showed up on time, explained everything, and the price was fair. Highly recommend!", platform: "Yelp", biz: "HVAC", reply: "This absolutely made our day — thank you! There's nothing more rewarding than knowing we came through when it mattered most. Mike takes a lot of pride in being upfront about pricing and explaining the work, so he'll be thrilled to hear this. We really appreciate the recommendation and look forward to keeping you cool for years to come! — The ProAir Team" },
  { stars: 3, text: "The cleaning was okay but they missed the baseboards and behind the toilet. Friendly staff though and they were on time.", platform: "Facebook", biz: "Cleaning", reply: "Thank you for the honest feedback — it really helps us improve. You're right that baseboards and behind-the-toilet details should never be missed, and I've already addressed this with your cleaning team. We'd love a chance to show you our full attention to detail on your next visit. Please reach out to me at [email] and your next clean is on us. — Sarah" },
];

export default function Home() {
  const [activeDemo, setActiveDemo] = useState(0);
  const [showReply, setShowReply] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);
  const [dark, setDark] = useState(false);
  const [typed, setTyped] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => { try { const t = localStorage.getItem("nb_theme"); if (t === "dark") { setDark(true); document.documentElement.setAttribute("data-theme", "dark"); } } catch {} }, []);
  const toggleDark = () => { const n = !dark; setDark(n); document.documentElement.setAttribute("data-theme", n ? "dark" : ""); localStorage.setItem("nb_theme", n ? "dark" : "light"); };

  const runDemo = (idx) => {
    setActiveDemo(idx); setShowReply(false); setTyped(""); setIsTyping(true);
    setTimeout(() => { setShowReply(true); setIsTyping(false); const reply = DEMO_REVIEWS[idx].reply; let i = 0; const iv = setInterval(() => { i += 2; setTyped(reply.slice(0, i)); if (i >= reply.length) clearInterval(iv); }, 12); }, 1200);
  };
  useEffect(() => { runDemo(0); }, []);

  const faqs = [
    { q: "Is NoteBack really free?", a: "Yes — 2 replies per day, forever. No credit card, no signup. Pro unlocks unlimited for $19/mo." },
    { q: "Will replies sound robotic?", a: "No. NoteBack writes like a real business owner — warm, specific, and genuine. Every reply references details from the actual customer review." },
    { q: "Does NoteBack create fake reviews?", a: "Absolutely not. NoteBack only helps business owners write replies to reviews customers have already posted. It's a response tool, not a review generator." },
    { q: "Which platforms does it support?", a: "Google, Yelp, Facebook, TripAdvisor, Trustpilot, BBB, Nextdoor, and any other platform where you respond as the owner." },
    { q: "What languages?", a: "English, Spanish, French, Portuguese, German, Chinese, Japanese, and Korean." },
    { q: "Can I cancel Pro anytime?", a: "Yes. No contracts, no fees. One click to cancel." },
  ];

  return (
    <>
      <nav style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, background: "color-mix(in srgb, var(--bg) 88%, transparent)", backdropFilter: "blur(16px) saturate(1.4)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1060, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "var(--terra)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: -1 }}>N</div>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 800, color: "var(--text)", letterSpacing: -0.5 }}>NoteBack</span>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button onClick={toggleDark} style={{ width: 36, height: 36, borderRadius: 9, background: "var(--inputBg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16 }}>{dark ? "☀️" : "🌙"}</button>
            <a href="/dashboard" className="hide-mobile" style={{ padding: "8px 16px", background: "none", border: "1px solid var(--border)", borderRadius: 9, fontSize: 13, color: "var(--dim)", textDecoration: "none", fontWeight: 500 }}>Try Free</a>
            <a href={STRIPE_MONTHLY} target="_blank" rel="noopener" style={{ padding: "8px 18px", background: "var(--terra)", borderRadius: 9, fontSize: 13, color: "#fff", textDecoration: "none", fontWeight: 700 }}>Go Pro — $19/mo</a>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        {/* HERO */}
        <section style={{ padding: "clamp(56px, 10vw, 96px) 24px 56px", textAlign: "center" }}>
          <R><div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", background: "color-mix(in srgb, var(--sage) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--sage) 20%, transparent)", borderRadius: 99, fontSize: 12, fontWeight: 600, color: "var(--sage)", marginBottom: 24 }}><span style={{ width: 6, height: 6, borderRadius: 99, background: "var(--sage)", display: "inline-block" }}></span>Trusted by business owners everywhere</div></R>
          <R d={0.08}><h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, lineHeight: 1.02, letterSpacing: "-2px", marginBottom: 20, color: "var(--text)" }}>They left a review.<br /><span style={{ color: "var(--terra)" }}>Write back in seconds.</span></h1></R>
          <R d={0.16}><p style={{ fontSize: "clamp(16px, 2.2vw, 19px)", color: "var(--dim)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 32px" }}>Paste any customer review. Get a professional, human-sounding reply instantly. Copy, paste, post. Your reputation, handled.</p></R>
          <R d={0.24}>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/dashboard" style={{ padding: "15px 36px", background: "var(--terra)", borderRadius: 12, fontSize: 16, fontWeight: 700, color: "#fff", textDecoration: "none", boxShadow: "0 4px 16px rgba(196,101,42,0.3)" }}>Write a Reply — Free</a>
              <a href="#demo" style={{ padding: "15px 28px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 16, fontWeight: 500, color: "var(--dim)", textDecoration: "none", boxShadow: "var(--cardShadow)" }}>See it in action ↓</a>
            </div>
            <p style={{ marginTop: 14, fontSize: 13, color: "var(--light)" }}>2 free replies per day · No signup · No credit card</p>
          </R>
        </section>

        {/* STATS */}
        <R><section style={{ padding: "0 24px 48px" }}><div style={{ display: "flex", justifyContent: "center", gap: "clamp(16px, 4vw, 48px)", flexWrap: "wrap", padding: "28px 32px", background: "var(--card)", borderRadius: 18, border: "1px solid var(--border)", boxShadow: "var(--cardShadow)" }}>
          {[{ n: "89%", d: "of customers read owner replies" }, { n: "35%", d: "more revenue with replies" }, { n: "8+", d: "review platforms" }, { n: "< 10s", d: "per reply with AI" }].map((s, i) => (
            <div key={i} style={{ textAlign: "center", minWidth: 100 }}><div style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 900, color: "var(--terra)" }}>{s.n}</div><div style={{ fontSize: 12, color: "var(--light)", marginTop: 3, lineHeight: 1.3 }}>{s.d}</div></div>
          ))}
        </div></section></R>

        {/* LIVE DEMO */}
        <section id="demo" style={{ padding: "48px 24px 64px" }}>
          <R><div style={{ textAlign: "center", marginBottom: 28 }}><div style={{ fontSize: 11, fontWeight: 700, color: "var(--terra)", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 8 }}>Live Demo</div><h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, color: "var(--text)", letterSpacing: -1 }}>Watch NoteBack write a reply</h2><p style={{ fontSize: 15, color: "var(--dim)", marginTop: 8 }}>Click any review below</p></div></R>
          <R d={0.1}><div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 20, flexWrap: "wrap" }}>
            {DEMO_REVIEWS.map((r, i) => (<button key={i} onClick={() => runDemo(i)} style={{ padding: "8px 16px", borderRadius: 10, background: activeDemo === i ? "color-mix(in srgb, var(--terra) 10%, var(--card))" : "var(--card)", border: `1.5px solid ${activeDemo === i ? "var(--terra)" : "var(--border)"}`, fontSize: 12, fontWeight: activeDemo === i ? 700 : 500, color: activeDemo === i ? "var(--terra)" : "var(--dim)", cursor: "pointer", boxShadow: activeDemo === i ? "0 2px 8px rgba(196,101,42,0.12)" : "none" }}>{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)} · {r.biz}</button>))}
          </div></R>
          <R d={0.15}><div style={{ maxWidth: 640, margin: "0 auto", background: "var(--card)", borderRadius: 20, border: "1px solid var(--border)", overflow: "hidden", boxShadow: "var(--cardShadow)" }}>
            <div style={{ padding: "24px 28px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 99, background: "var(--sand)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "var(--dim)" }}>{DEMO_REVIEWS[activeDemo].text[0].toUpperCase()}</div>
                  <div><div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Customer Review</div><div style={{ fontSize: 11, color: "var(--light)" }}>{DEMO_REVIEWS[activeDemo].platform} · {DEMO_REVIEWS[activeDemo].biz}</div></div>
                </div>
                <div style={{ display: "flex", gap: 2 }}>{[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 14, color: s <= DEMO_REVIEWS[activeDemo].stars ? "var(--star)" : "var(--starOff)" }}>★</span>)}</div>
              </div>
              <p style={{ fontSize: 15, color: "var(--text)", lineHeight: 1.65, fontStyle: "italic" }}>"{DEMO_REVIEWS[activeDemo].text}"</p>
            </div>
            <div style={{ padding: "24px 28px", background: "color-mix(in srgb, var(--sage) 4%, var(--card))" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--terra)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff" }}>N</div>
                <div><div style={{ fontSize: 13, fontWeight: 600, color: "var(--terra)" }}>NoteBack Reply</div><div style={{ fontSize: 11, color: "var(--sage)" }}>{isTyping ? "Writing..." : "Ready to post"}</div></div>
                {isTyping && <div style={{ width: 14, height: 14, border: "2px solid var(--border)", borderTopColor: "var(--terra)", borderRadius: "50%", animation: "spin 0.6s linear infinite", marginLeft: "auto" }} />}
              </div>
              <p style={{ fontSize: 15, color: "var(--text)", lineHeight: 1.7, minHeight: 80 }}>
                {typed || <span style={{ color: "var(--light)" }}>Generating your reply...</span>}
                {isTyping && <span style={{ display: "inline-block", width: 2, height: 16, background: "var(--terra)", marginLeft: 2, animation: "pulse 0.8s infinite", verticalAlign: "middle" }} />}
              </p>
            </div>
          </div></R>
          <R d={0.25}><div style={{ textAlign: "center", marginTop: 24 }}><a href="/dashboard" style={{ display: "inline-block", padding: "13px 32px", background: "var(--terra)", borderRadius: 11, fontSize: 15, fontWeight: 700, color: "#fff", textDecoration: "none", boxShadow: "0 4px 16px rgba(196,101,42,0.25)" }}>Try It Yourself — Free</a></div></R>
        </section>

        {/* HOW IT WORKS */}
        <section style={{ padding: "56px 24px", maxWidth: 720, margin: "0 auto" }}>
          <R><div style={{ textAlign: "center", marginBottom: 32 }}><div style={{ fontSize: 11, fontWeight: 700, color: "var(--terra)", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 8 }}>How it works</div><h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, color: "var(--text)", letterSpacing: -1 }}>Three steps. Thirty seconds.</h2></div></R>
          {[{ n: "01", t: "Paste", d: "Copy any customer review from Google, Yelp, Facebook, or any platform. Select the star rating and your business type.", icon: "📋" },{ n: "02", t: "Get your reply", d: "NoteBack's AI writes a professional, human-sounding reply tailored to what the customer said. Choose your tone and language.", icon: "✨" },{ n: "03", t: "Post it", d: "One click to copy. Paste as your owner response. Your customer gets a thoughtful reply in seconds.", icon: "🚀" }].map((s, i) => (
            <R key={i} d={i * 0.08}><div style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "20px 24px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, marginBottom: 10, boxShadow: "var(--cardShadow)" }}>
              <div style={{ width: 48, height: 48, minWidth: 48, borderRadius: 14, background: "color-mix(in srgb, var(--terra) 8%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{s.icon}</div>
              <div><div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 3 }}><span style={{ fontSize: 11, fontWeight: 700, color: "var(--terra)", letterSpacing: 1 }}>{s.n}</span><span style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{s.t}</span></div><p style={{ fontSize: 14, color: "var(--dim)", lineHeight: 1.6 }}>{s.d}</p></div>
            </div></R>
          ))}
        </section>

        {/* WHY IT MATTERS */}
        <section style={{ padding: "48px 24px", maxWidth: 720, margin: "0 auto" }}>
          <R><div style={{ textAlign: "center", marginBottom: 28 }}><div style={{ fontSize: 11, fontWeight: 700, color: "var(--terra)", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 8 }}>Why it matters</div><h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 900, color: "var(--text)", letterSpacing: -0.5 }}>Every unanswered review costs you customers</h2></div></R>
          <R d={0.1}><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {[{ stat: "89%", detail: "of consumers read business owner responses to reviews", src: "BrightLocal" },{ stat: "35%", detail: "more likely to visit a business that responds to negative reviews", src: "Harvard Business Review" },{ stat: "4.3×", detail: "more revenue from businesses that actively manage reviews", src: "Womply Research" }].map((p, i) => (
              <div key={i} style={{ padding: "22px 20px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, boxShadow: "var(--cardShadow)" }}><div style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 900, color: "var(--terra)", marginBottom: 6 }}>{p.stat}</div><p style={{ fontSize: 13, color: "var(--dim)", lineHeight: 1.5, marginBottom: 8 }}>{p.detail}</p><p style={{ fontSize: 10, color: "var(--light)" }}>{p.src}</p></div>
            ))}
          </div></R>
        </section>

        {/* PRICING */}
        <section style={{ padding: "56px 24px 64px", maxWidth: 820, margin: "0 auto" }} id="pricing">
          <R><div style={{ textAlign: "center", marginBottom: 32 }}><div style={{ fontSize: 11, fontWeight: 700, color: "var(--terra)", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 8 }}>Pricing</div><h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, color: "var(--text)", letterSpacing: -1 }}>Free forever. Pro when you're ready.</h2></div></R>
          <R d={0.1}><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <div style={{ padding: "28px 24px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 18, boxShadow: "var(--cardShadow)" }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Free</div><div style={{ fontFamily: "'Fraunces', serif", fontSize: 38, fontWeight: 900, margin: "4px 0" }}>$0</div><div style={{ fontSize: 13, color: "var(--dim)", marginBottom: 20 }}>Forever free</div>
              {["2 replies per day", "2 tone styles", "All platforms", "Copy with one click"].map(f => <div key={f} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "var(--dim)", marginBottom: 8 }}><span style={{ color: "var(--sage)", fontWeight: 700 }}>✓</span>{f}</div>)}
              <a href="/dashboard" style={{ display: "block", width: "100%", marginTop: 16, padding: "12px", borderRadius: 11, background: "var(--inputBg)", border: "1px solid var(--border)", fontSize: 14, fontWeight: 600, color: "var(--text)", textAlign: "center", textDecoration: "none", boxSizing: "border-box" }}>Get Started</a>
            </div>
            <div style={{ padding: "28px 24px", background: "var(--card)", border: "2px solid var(--terra)", borderRadius: 18, position: "relative", boxShadow: "0 4px 24px rgba(196,101,42,0.12)" }}>
              <span style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: "var(--terra)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 14px", borderRadius: 99, letterSpacing: 1.5 }}>MOST POPULAR</span>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Pro Monthly</div><div style={{ fontFamily: "'Fraunces', serif", fontSize: 38, fontWeight: 900, margin: "4px 0" }}>$19<span style={{ fontSize: 15, fontWeight: 400, color: "var(--dim)" }}>/mo</span></div><div style={{ fontSize: 13, color: "var(--terra)", marginBottom: 20 }}>Cancel anytime</div>
              {["Unlimited replies", "All 4 tones & 8 languages", "Reply history saved", "Priority AI speed", "Email support"].map(f => <div key={f} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "var(--text)", marginBottom: 8 }}><span style={{ color: "var(--sage)", fontWeight: 700 }}>✓</span>{f}</div>)}
              <a href={STRIPE_MONTHLY} target="_blank" rel="noopener" style={{ display: "block", width: "100%", marginTop: 16, padding: "12px", borderRadius: 11, background: "var(--terra)", fontSize: 14, fontWeight: 700, color: "#fff", textAlign: "center", textDecoration: "none", boxSizing: "border-box", boxShadow: "0 2px 8px rgba(196,101,42,0.25)" }}>Start Pro</a>
            </div>
            <div style={{ padding: "28px 24px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 18, boxShadow: "var(--cardShadow)" }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Pro Yearly</div><div style={{ fontFamily: "'Fraunces', serif", fontSize: 38, fontWeight: 900, margin: "4px 0" }}>$149<span style={{ fontSize: 15, fontWeight: 400, color: "var(--dim)" }}>/yr</span></div><div style={{ fontSize: 13, color: "var(--terra)", marginBottom: 20 }}>Save 35%</div>
              {["Everything in Pro", "2 months free", "Priority support", "Early access to features"].map(f => <div key={f} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "var(--text)", marginBottom: 8 }}><span style={{ color: "var(--sage)", fontWeight: 700 }}>✓</span>{f}</div>)}
              <a href={STRIPE_YEARLY} target="_blank" rel="noopener" style={{ display: "block", width: "100%", marginTop: 16, padding: "12px", borderRadius: 11, background: "var(--inputBg)", border: "1px solid var(--border)", fontSize: 14, fontWeight: 600, color: "var(--text)", textAlign: "center", textDecoration: "none", boxSizing: "border-box" }}>Start Pro</a>
            </div>
          </div></R>
        </section>

        {/* FAQ */}
        <section style={{ padding: "48px 24px 64px", maxWidth: 620, margin: "0 auto" }}>
          <R><h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 900, textAlign: "center", marginBottom: 24, letterSpacing: -0.5 }}>Questions?</h2></R>
          {faqs.map((f, i) => (<R key={i} d={i * 0.03}><button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{ width: "100%", textAlign: "left", padding: "16px 20px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, marginBottom: 6, cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif", boxShadow: faqOpen === i ? "var(--cardShadow)" : "none", transition: "box-shadow 0.3s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{f.q}</span><span style={{ fontSize: 18, color: "var(--dim)", transition: "transform 0.3s", transform: faqOpen === i ? "rotate(45deg)" : "" }}>+</span></div>
            {faqOpen === i && <p style={{ fontSize: 14, color: "var(--dim)", lineHeight: 1.65, margin: "10px 0 0" }}>{f.a}</p>}
          </button></R>))}
        </section>

        {/* FINAL CTA */}
        <section style={{ padding: "64px 24px", textAlign: "center" }}>
          <R><div style={{ padding: "48px 32px", background: "var(--card)", borderRadius: 24, border: "1px solid var(--border)", boxShadow: "var(--cardShadow)", maxWidth: 600, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, marginBottom: 12, letterSpacing: -1 }}>Stop ignoring your reviews.</h2>
            <p style={{ fontSize: 16, color: "var(--dim)", maxWidth: 400, margin: "0 auto 28px", lineHeight: 1.65 }}>Every unanswered review is a customer you'll never meet. Start replying in seconds.</p>
            <a href="/dashboard" style={{ display: "inline-block", padding: "15px 36px", background: "var(--terra)", borderRadius: 12, fontSize: 16, fontWeight: 700, color: "#fff", textDecoration: "none", boxShadow: "0 4px 16px rgba(196,101,42,0.3)" }}>Write Your First Reply — Free</a>
            <p style={{ marginTop: 12, fontSize: 12, color: "var(--light)" }}>No signup · No credit card · Takes 10 seconds</p>
          </div></R>
        </section>
      </div>

      {/* FOOTER */}
      <footer style={{ padding: "28px 24px", borderTop: "1px solid var(--border)", background: "var(--card)" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 22, height: 22, borderRadius: 6, background: "var(--terra)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff" }}>N</div><span style={{ fontSize: 12, color: "var(--light)" }}>© 2026 NoteBack · Helping business owners reply to customer reviews.</span></div>
          <div style={{ display: "flex", gap: 16 }}>
            <a href="mailto:support@noteback.co" style={{ fontSize: 12, color: "var(--dim)", textDecoration: "none" }}>Contact</a>
            <a href="/privacy" style={{ fontSize: 12, color: "var(--dim)", textDecoration: "none" }}>Privacy</a>
            <a href="/terms" style={{ fontSize: 12, color: "var(--dim)", textDecoration: "none" }}>Terms</a>
            <a href={STRIPE_PORTAL} target="_blank" rel="noopener" style={{ fontSize: 12, color: "var(--dim)", textDecoration: "none" }}>Manage Subscription</a>
          </div>
        </div>
      </footer>
    </>
  );
}
