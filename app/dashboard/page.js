"use client";
import { useState, useEffect, useRef } from "react";

const FREE_LIMIT = 2;
const BIZ_TYPES = ["Restaurant","Plumber","HVAC","Electrician","Dentist","Auto Repair","Salon / Barbershop","Med Spa","Cleaning Service","Roofing","Landscaping","Veterinarian","Real Estate","Law Office","Retail","Other"];
const TONES_KEYS = ["warm","professional","casual","apologetic"];
const TONE_LABELS = { warm: "Warm & Friendly", professional: "Professional", casual: "Casual", apologetic: "Apologetic" };
const PLATFORMS = ["Google","Yelp","Facebook","TripAdvisor","Trustpilot","BBB","Nextdoor","Other"];
const LANG_CODES = ["en","es","fr","pt","de","zh","ja","ko"];
const LANG_FLAGS = { en:"🇺🇸", es:"🇪🇸", fr:"🇫🇷", pt:"🇧🇷", de:"🇩🇪", zh:"🇨🇳", ja:"🇯🇵", ko:"🇰🇷" };
const LANG_NAMES = { en:"English", es:"Español", fr:"Français", pt:"Português", de:"Deutsch", zh:"中文", ja:"日本語", ko:"한국어" };
const LANG_API = { en:"English", es:"Spanish", fr:"French", pt:"Portuguese", de:"German", zh:"Chinese", ja:"Japanese", ko:"Korean" };

const STRIPE_MONTHLY = "https://buy.stripe.com/aFa4gy6QjcMBebZf68fUQ00";
const STRIPE_PORTAL = "https://billing.stripe.com/p/login/aFa4gy6QjcMBebZf68fUQ00";

function Pill({ active, children, onClick }) {
  return <button onClick={onClick} style={{ padding: "7px 12px", borderRadius: 8, background: active ? "color-mix(in srgb, var(--terra) 12%, transparent)" : "var(--inputBg)", border: `1px solid ${active ? "color-mix(in srgb, var(--terra) 40%, transparent)" : "var(--border)"}`, fontSize: 12, fontWeight: active ? 600 : 400, color: active ? "var(--terra)" : "var(--dim)", cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif", transition: "all 0.15s" }}>{children}</button>;
}

export default function Dashboard() {
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [bizType, setBizType] = useState("");
  const [bizName, setBizName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [platform, setPlatform] = useState("Google");
  const [tone, setTone] = useState("warm");
  const [respLang, setRespLang] = useState("en");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [used, setUsed] = useState(0);
  const [showPricing, setShowPricing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dark, setDark] = useState(false);
  const [history, setHistory] = useState([]);
  const [tab, setTab] = useState("generate");
  const [totalGenerated, setTotalGenerated] = useState(0);

  useEffect(() => {
    try {
      const th = localStorage.getItem("nb_theme"); if (th === "dark") { setDark(true); document.documentElement.setAttribute("data-theme", "dark"); }
      const u = JSON.parse(localStorage.getItem("nb_usage") || "{}"); const today = new Date().toISOString().split("T")[0];
      if (u.date === today) setUsed(u.count || 0); else localStorage.setItem("nb_usage", JSON.stringify({ date: today, count: 0 }));
      const h = JSON.parse(localStorage.getItem("nb_history") || "[]"); setHistory(h);
      const tg = parseInt(localStorage.getItem("nb_total") || "0"); setTotalGenerated(tg);
      // Load example if redirected from landing page
      const ex = localStorage.getItem("nb_example");
      if (ex) { const e = JSON.parse(ex); setReview(e.text || ""); setStars(e.stars || 0); setBizType(e.biz || ""); setPlatform(e.platform || "Google"); localStorage.removeItem("nb_example"); }
    } catch {}
  }, []);

  const toggleDark = () => { const n = !dark; setDark(n); document.documentElement.setAttribute("data-theme", n ? "dark" : ""); localStorage.setItem("nb_theme", n ? "dark" : "light"); };
  const canGen = used < FREE_LIMIT;

  const generate = async () => {
    if (!review.trim() || stars === 0) return;
    if (!canGen) { setShowPricing(true); return; }
    setLoading(true); setResponse("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review, stars, platform, bizType, bizName, ownerName, tone: TONE_LABELS[tone] || tone, language: LANG_API[respLang] || "English" }),
      });
      const data = await res.json();
      if (data.error) { if (res.status === 429) { setShowPricing(true); setLoading(false); return; } setResponse(data.error); }
      else {
        setResponse(data.response);
        const nc = used + 1; setUsed(nc);
        const nt = totalGenerated + 1; setTotalGenerated(nt);
        try {
          const td = new Date().toISOString().split("T")[0];
          localStorage.setItem("nb_usage", JSON.stringify({ date: td, count: nc }));
          localStorage.setItem("nb_total", String(nt));
        } catch {}
      }
    } catch { setResponse("Something went wrong. Please try again."); }
    setLoading(false);
  };

  const deleteHist = (id) => { const n = history.filter(h => h.id !== id); setHistory(n); try { localStorage.setItem("nb_history", JSON.stringify(n)); } catch {} };
  const clearHist = () => { setHistory([]); try { localStorage.removeItem("nb_history"); } catch {} };

  const inp = { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--inputBg)", fontSize: 14, color: "var(--text)", fontFamily: "'Instrument Sans', sans-serif", outline: "none", boxSizing: "border-box" };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* NAV */}
      <nav style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", background: "var(--card)", transition: "background 0.3s" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1000, margin: "0 auto", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--terra)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>N</div>
              <span style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 700, color: "var(--text)" }}>NoteBack</span>
            </a>
            {/* Tabs */}
            <div style={{ display: "flex", gap: 2, marginLeft: 12 }}>
              {[{ k: "generate", l: "Write Reply" }, { k: "history", l: `History 🔒` }].map(t => (
                <button key={t.k} onClick={() => setTab(t.k)} style={{ padding: "6px 14px", borderRadius: 7, background: tab === t.k ? "color-mix(in srgb, var(--terra) 10%, transparent)" : "transparent", border: "none", fontSize: 12, fontWeight: tab === t.k ? 600 : 400, color: tab === t.k ? "var(--terra)" : "var(--dim)", cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif" }}>{t.l}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <button onClick={toggleDark} style={{ width: 34, height: 34, borderRadius: 8, background: "var(--inputBg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 15 }}>{dark ? "☀️" : "🌙"}</button>
            <a href={STRIPE_PORTAL} target="_blank" rel="noopener" className="hide-mobile" style={{ padding: "6px 10px", background: "none", border: "1px solid var(--border)", borderRadius: 7, fontSize: 11, color: "var(--dim)", textDecoration: "none", fontFamily: "'Instrument Sans', sans-serif" }}>Manage Subscription</a>
            <button onClick={() => setShowPricing(true)} style={{ padding: "6px 12px", background: "var(--terra)", border: "none", borderRadius: 7, fontSize: 12, color: "#fff", cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif", fontWeight: 600 }}>Go Pro</button>
          </div>
        </div>
      </nav>

      <div style={{ flex: 1, maxWidth: 720, width: "100%", margin: "0 auto", padding: "24px 20px" }}>

        {/* Status bar */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          {[
            { label: "Today", value: `${used}/${FREE_LIMIT}`, sub: "used", color: canGen ? "var(--sage)" : "var(--terra)" },
            { label: "Total replies", value: totalGenerated, sub: "all time", color: "var(--terra)" },
            { label: "History", value: "Pro", sub: "upgrade to unlock", color: "var(--dim)" },
          ].map((s, i) => (
            <div key={i} style={{ flex: "1 1 100px", padding: "14px 16px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }}>
              <div style={{ fontSize: 10, color: "var(--light)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: "'Fraunces', serif" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "var(--light)" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* GENERATE TAB */}
        {tab === "generate" && (
          <div style={{ background: "var(--card)", borderRadius: 16, border: "1px solid var(--border)", padding: "clamp(16px, 3vw, 26px)", transition: "background 0.3s" }}>
            {/* Stars + Platform */}
            <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap", alignItems: "flex-end" }} className="stack-mobile">
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", display: "block", marginBottom: 5 }}>Star rating</label>
                <div style={{ display: "flex", gap: 4 }}>{[1,2,3,4,5].map(s => <button key={s} onClick={() => setStars(s)} style={{ width: 42, height: 42, borderRadius: 9, background: s <= stars ? "color-mix(in srgb, var(--star) 15%, var(--card))" : "var(--inputBg)", border: s <= stars ? "2px solid var(--star)" : "1px solid var(--border)", fontSize: 19, cursor: "pointer", color: s <= stars ? "var(--star)" : "var(--starOff)", transition: "all 0.15s" }}>★</button>)}</div>
              </div>
              <div style={{ flex: "1 1 180px" }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", display: "block", marginBottom: 5 }}>Platform</label>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{PLATFORMS.map(p => <Pill key={p} active={platform === p} onClick={() => setPlatform(p)}>{p}</Pill>)}</div>
              </div>
            </div>

            {/* Review */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", display: "block", marginBottom: 5 }}>Paste the customer review</label>
              <textarea value={review} onChange={e => setReview(e.target.value)} placeholder={`Paste a customer ${platform} review here...`} rows={5} style={{ ...inp, fontSize: 15, lineHeight: 1.6, padding: "14px", borderRadius: 12, resize: "vertical" }} />
              {review.length > 0 && <div style={{ fontSize: 11, color: "var(--light)", marginTop: 4, textAlign: "right" }}>{review.length} characters</div>}
            </div>

            {/* Options */}
            <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }} className="stack-mobile">
              <div style={{ flex: "1 1 130px" }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", display: "block", marginBottom: 5 }}>Business type</label>
                <select value={bizType} onChange={e => setBizType(e.target.value)} style={{ ...inp, cursor: "pointer" }}><option value="">Select...</option>{BIZ_TYPES.map(b => <option key={b}>{b}</option>)}</select>
              </div>
              <div style={{ flex: "1 1 100px" }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", display: "block", marginBottom: 5 }}>Reply language</label>
                <select value={respLang} onChange={e => setRespLang(e.target.value)} style={{ ...inp, cursor: "pointer" }}>{LANG_CODES.map(c => <option key={c} value={c}>{LANG_FLAGS[c]} {LANG_NAMES[c]}</option>)}</select>
              </div>
              <div style={{ flex: "1 1 180px" }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", display: "block", marginBottom: 5 }}>Tone</label>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{TONES_KEYS.map(k => { const locked = (k === "casual" || k === "apologetic"); return <Pill key={k} active={tone === k} onClick={() => locked ? setShowPricing(true) : setTone(k)}>{TONE_LABELS[k]}{locked ? " 🔒" : ""}</Pill>; })}</div>
              </div>
            </div>

            {/* Optional */}
            <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }} className="stack-mobile">
              <div style={{ flex: "1 1 150px" }}><label style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", display: "block", marginBottom: 5 }}>Business name <span style={{ fontWeight: 400, color: "var(--light)" }}>(optional)</span></label><input value={bizName} onChange={e => setBizName(e.target.value)} placeholder="e.g., ProFlow Plumbing" style={inp} /></div>
              <div style={{ flex: "1 1 110px" }}><label style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", display: "block", marginBottom: 5 }}>Sign off as <span style={{ fontWeight: 400, color: "var(--light)" }}>(optional)</span></label><input value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="e.g., Mike" style={inp} /></div>
            </div>

            {/* Generate */}
            <button onClick={generate} disabled={!review.trim() || stars === 0 || loading} style={{ width: "100%", padding: "14px", borderRadius: 12, background: (!review.trim() || stars === 0) ? "var(--sandDk)" : loading ? "var(--sandDk)" : "var(--terra)", border: "none", fontSize: 15, fontWeight: 700, cursor: (!review.trim() || stars === 0 || loading) ? "not-allowed" : "pointer", color: (!review.trim() || stars === 0) ? "var(--light)" : "#fff", fontFamily: "'Instrument Sans', sans-serif", transition: "all 0.2s" }}>
              {loading ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><span style={{ width: 15, height: 15, border: "2px solid #fff4", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .6s linear infinite", display: "inline-block" }} />Writing your reply...</span> : !canGen ? "Daily limit reached — Go Pro for unlimited replies" : `Write My Reply${used > 0 ? ` (${FREE_LIMIT - used} left)` : ""}`}
            </button>

            {/* Response */}
            {response && (
              <div style={{ marginTop: 20, padding: "16px 18px", background: "color-mix(in srgb, var(--sage) 8%, var(--card))", borderRadius: 14, border: "1px solid color-mix(in srgb, var(--sage) 20%, transparent)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 5, background: "var(--sage)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#fff" }}>✓</div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--sage)" }}>Your reply — ready to post on {platform}</span>
                    {respLang !== "en" && <span style={{ fontSize: 10, padding: "1px 6px", background: "color-mix(in srgb, var(--sage) 15%, transparent)", borderRadius: 4, color: "var(--sage)" }}>{LANG_NAMES[respLang]}</span>}
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText(response); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ padding: "6px 16px", borderRadius: 8, background: copied ? "color-mix(in srgb, var(--sage) 10%, var(--card))" : "var(--card)", border: `1px solid ${copied ? "color-mix(in srgb, var(--sage) 30%, transparent)" : "var(--border)"}`, fontSize: 12, fontWeight: 600, color: copied ? "var(--sage)" : "var(--dim)", cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif" }}>{copied ? "Copied!" : "Copy Reply"}</button>
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--text)", margin: 0 }}>{response}</p>
                <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
                  <button onClick={generate} style={{ padding: "5px 12px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 7, fontSize: 11, color: "var(--dim)", cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif" }}>Try another version</button>
                  <span style={{ fontSize: 11, color: "var(--light)", display: "flex", alignItems: "center" }}>{response.split(/\s+/).length} words</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* HISTORY TAB — PRO ONLY */}
        {tab === "history" && (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "var(--card)", borderRadius: 16, border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 900, color: "var(--text)", marginBottom: 8 }}>Reply History is a Pro feature</h2>
            <p style={{ fontSize: 14, color: "var(--dim)", maxWidth: 380, margin: "0 auto 24px", lineHeight: 1.6 }}>Pro members get every reply saved automatically. Review, copy, and reuse your best responses anytime.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 280, margin: "0 auto" }}>
              <a href={STRIPE_MONTHLY} target="_blank" rel="noopener" style={{ display: "block", padding: "12px 24px", borderRadius: 10, background: "var(--terra)", fontSize: 14, fontWeight: 700, color: "#fff", textDecoration: "none", textAlign: "center" }}>Go Pro — $19/month</a>
              <p style={{ fontSize: 11, color: "var(--light)" }}>Cancel anytime. Secure checkout via Stripe.</p>
            </div>
            <div style={{ marginTop: 32, padding: "16px 20px", background: "var(--inputBg)", borderRadius: 12, maxWidth: 400, margin: "32px auto 0" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", marginBottom: 10 }}>What you get with Pro:</div>
              {["Unlimited replies per day", "Full reply history — saved automatically", "All 8+ platforms & 8 languages", "Priority AI speed", "Email support"].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text)", marginBottom: 6 }}><span style={{ color: "var(--sage)", fontWeight: 700 }}>✓</span>{f}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", background: "var(--card)", marginTop: "auto" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 11, color: "var(--light)" }}>© 2026 NoteBack</span>
          <div style={{ display: "flex", gap: 12 }}>
            <a href="/" style={{ fontSize: 11, color: "var(--dim)", textDecoration: "none" }}>Home</a>
            <a href="mailto:support@noteback.co" style={{ fontSize: 11, color: "var(--dim)", textDecoration: "none" }}>Contact</a>
            <a href="/privacy" style={{ fontSize: 11, color: "var(--dim)", textDecoration: "none" }}>Privacy</a>
            <a href="/terms" style={{ fontSize: 11, color: "var(--dim)", textDecoration: "none" }}>Terms</a>
            <a href={STRIPE_PORTAL} target="_blank" rel="noopener" style={{ fontSize: 11, color: "var(--dim)", textDecoration: "none" }}>Manage Subscription</a>
          </div>
        </div>
      </footer>

      {/* PRICING MODAL */}
      {showPricing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(44,36,24,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 16 }} onClick={() => setShowPricing(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "var(--card)", borderRadius: 18, padding: 28, maxWidth: 380, width: "100%", boxShadow: "0 24px 64px rgba(44,36,24,0.25)" }}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 900, color: "var(--text)" }}>Go Pro</h2>
              <p style={{ fontSize: 12, color: "var(--dim)", marginTop: 4 }}>Unlimited replies to your customer reviews.</p>
            </div>
            <a href={STRIPE_MONTHLY} target="_blank" rel="noopener" style={{ display: "block", width: "100%", padding: 14, borderRadius: 12, background: "var(--terra)", fontSize: 15, fontWeight: 700, color: "#fff", textAlign: "center", textDecoration: "none", boxSizing: "border-box", marginBottom: 8 }}>Go Pro — $19/month</a>
            <p style={{ textAlign: "center", fontSize: 10, color: "var(--light)" }}>7-day free trial. Cancel anytime via Stripe.</p>
            <button onClick={() => setShowPricing(false)} style={{ display: "block", margin: "8px auto 0", background: "none", border: "none", fontSize: 12, color: "var(--dim)", cursor: "pointer", textDecoration: "underline" }}>Maybe later</button>
          </div>
        </div>
      )}
    </div>
  );
}
