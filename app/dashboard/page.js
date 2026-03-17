"use client";
import { useState, useEffect } from "react";

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
const STRIPE_YEARLY = "https://buy.stripe.com/28E14m1vZbIxgk73nqfUQ01";
const STRIPE_PORTAL = "https://billing.stripe.com/p/login/aFa4gy6QjcMBebZf68fUQ00";

function Pill({ active, children, onClick, locked }) {
  return <button onClick={onClick} style={{ padding: "6px 12px", borderRadius: 8, background: active ? "color-mix(in srgb, var(--terra) 12%, transparent)" : locked ? "var(--inputBg)" : "var(--inputBg)", border: `1px solid ${active ? "color-mix(in srgb, var(--terra) 40%, transparent)" : "var(--border)"}`, fontSize: 12, fontWeight: active ? 600 : 400, color: active ? "var(--terra)" : locked ? "var(--light)" : "var(--dim)", cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif", transition: "all 0.15s", opacity: locked ? 0.7 : 1 }}>{children}</button>;
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
  // Pro state
  const [isPro, setIsPro] = useState(false);
  const [proEmail, setProEmail] = useState("");
  const [proVerifying, setProVerifying] = useState(false);
  const [proError, setProError] = useState("");
  const [proPlan, setProPlan] = useState("");
  const [showVerify, setShowVerify] = useState(false);
  const [verifyInput, setVerifyInput] = useState("");

  useEffect(() => {
    try {
      const th = localStorage.getItem("nb_theme"); if (th === "dark") { setDark(true); document.documentElement.setAttribute("data-theme", "dark"); }
      const u = JSON.parse(localStorage.getItem("nb_usage") || "{}"); const today = new Date().toISOString().split("T")[0];
      if (u.date === today) setUsed(u.count || 0); else localStorage.setItem("nb_usage", JSON.stringify({ date: today, count: 0 }));
      const tg = parseInt(localStorage.getItem("nb_total") || "0"); setTotalGenerated(tg);
      // Check saved Pro status
      const saved = JSON.parse(localStorage.getItem("nb_pro") || "null");
      if (saved && saved.email && saved.isPro) {
        setIsPro(true); setProEmail(saved.email); setProPlan(saved.plan || "monthly");
        const h = JSON.parse(localStorage.getItem("nb_history") || "[]"); setHistory(h);
      }
      // Load example from landing page
      const ex = localStorage.getItem("nb_example");
      if (ex) { const e = JSON.parse(ex); setReview(e.text || ""); setStars(e.stars || 0); setBizType(e.biz || ""); setPlatform(e.platform || "Google"); localStorage.removeItem("nb_example"); }
    } catch {}
  }, []);

  const toggleDark = () => { const n = !dark; setDark(n); document.documentElement.setAttribute("data-theme", n ? "dark" : ""); localStorage.setItem("nb_theme", n ? "dark" : "light"); };
  const canGen = isPro || used < FREE_LIMIT;

  const verifyPro = async () => {
    const email = verifyInput.trim().toLowerCase();
    if (!email || !email.includes("@")) { setProError("Enter a valid email"); return; }
    setProVerifying(true); setProError("");
    try {
      const res = await fetch("/api/verify-pro", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (data.isPro) {
        setIsPro(true); setProEmail(email); setProPlan(data.plan || "monthly"); setShowVerify(false);
        try { localStorage.setItem("nb_pro", JSON.stringify({ email, isPro: true, plan: data.plan })); } catch {}
      } else {
        setProError("No active subscription found for this email. Make sure you use the same email you used on Stripe.");
      }
    } catch { setProError("Could not verify. Please try again."); }
    setProVerifying(false);
  };

  const logoutPro = () => {
    setIsPro(false); setProEmail(""); setProPlan(""); setHistory([]);
    try { localStorage.removeItem("nb_pro"); localStorage.removeItem("nb_history"); } catch {}
  };

  const generate = async () => {
    if (!review.trim() || stars === 0) return;
    if (!canGen) { setShowPricing(true); return; }
    setLoading(true); setResponse("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review, stars, platform, bizType, bizName, ownerName, tone: TONE_LABELS[tone] || tone, language: LANG_API[respLang] || "English", proEmail: isPro ? proEmail : null }),
      });
      const data = await res.json();
      if (data.error) { if (res.status === 429) { setShowPricing(true); setLoading(false); return; } setResponse(data.error); }
      else {
        setResponse(data.response);
        const nc = isPro ? used : used + 1; if (!isPro) setUsed(nc);
        const nt = totalGenerated + 1; setTotalGenerated(nt);
        // Save history for Pro users
        if (isPro) {
          const entry = { review: review.slice(0, 200), stars, platform, bizType, response: data.response, language: LANG_NAMES[respLang], time: new Date().toLocaleString(), id: Date.now() };
          const nh = [entry, ...history].slice(0, 100); setHistory(nh);
          try { localStorage.setItem("nb_history", JSON.stringify(nh)); } catch {}
        }
        try {
          if (!isPro) { const td = new Date().toISOString().split("T")[0]; localStorage.setItem("nb_usage", JSON.stringify({ date: td, count: nc })); }
          localStorage.setItem("nb_total", String(nt));
        } catch {}
      }
    } catch { setResponse("Something went wrong. Please try again."); }
    setLoading(false);
  };

  const deleteHist = (id) => { const n = history.filter(h => h.id !== id); setHistory(n); try { localStorage.setItem("nb_history", JSON.stringify(n)); } catch {} };
  const clearHist = () => { setHistory([]); try { localStorage.removeItem("nb_history"); } catch {} };

  const inp = { width: "100%", padding: "11px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--inputBg)", fontSize: 14, color: "var(--text)", fontFamily: "'Instrument Sans', sans-serif", outline: "none", boxSizing: "border-box" };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* NAV */}
      <nav style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", background: "var(--card)", transition: "background 0.3s" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1000, margin: "0 auto", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <a href="/" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
              <div style={{ width: 26, height: 26, borderRadius: 6, background: "var(--terra)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>N</div>
              <span className="hide-mobile" style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 700, color: "var(--text)" }}>NoteBack</span>
            </a>
            <div style={{ display: "flex", gap: 2, marginLeft: 4 }}>
              <button onClick={() => setTab("generate")} style={{ padding: "5px 10px", borderRadius: 7, background: tab === "generate" ? "color-mix(in srgb, var(--terra) 10%, transparent)" : "transparent", border: "none", fontSize: 11, fontWeight: tab === "generate" ? 600 : 400, color: tab === "generate" ? "var(--terra)" : "var(--dim)", cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif" }}>Write Reply</button>
              <button onClick={() => setTab("history")} style={{ padding: "5px 10px", borderRadius: 7, background: tab === "history" ? "color-mix(in srgb, var(--terra) 10%, transparent)" : "transparent", border: "none", fontSize: 11, fontWeight: tab === "history" ? 600 : 400, color: tab === "history" ? "var(--terra)" : "var(--dim)", cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif" }}>{isPro ? `History (${history.length})` : "History 🔒"}</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <button onClick={toggleDark} style={{ width: 32, height: 32, borderRadius: 7, background: "var(--inputBg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14 }}>{dark ? "☀️" : "🌙"}</button>
            {isPro ? (
              <>
                <span className="hide-mobile" style={{ fontSize: 10, padding: "4px 8px", background: "color-mix(in srgb, var(--sage) 12%, transparent)", border: "1px solid color-mix(in srgb, var(--sage) 25%, transparent)", borderRadius: 6, color: "var(--sage)", fontWeight: 600 }}>PRO ✓</span>
                <a href={STRIPE_PORTAL} target="_blank" rel="noopener" className="hide-mobile" style={{ padding: "5px 8px", background: "none", border: "1px solid var(--border)", borderRadius: 7, fontSize: 10, color: "var(--dim)", textDecoration: "none", fontFamily: "'Instrument Sans', sans-serif" }}>Manage</a>
              </>
            ) : (
              <>
                <button onClick={() => setShowVerify(true)} style={{ padding: "5px 10px", background: "none", border: "1px solid var(--border)", borderRadius: 7, fontSize: 11, color: "var(--dim)", cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif" }}>Verify Pro</button>
                <button onClick={() => setShowPricing(true)} style={{ padding: "5px 10px", background: "var(--terra)", border: "none", borderRadius: 7, fontSize: 11, color: "#fff", cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif", fontWeight: 600 }}>Go Pro</button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div style={{ flex: 1, maxWidth: 720, width: "100%", margin: "0 auto", padding: "14px 14px" }}>

        {/* Status bar */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          {isPro ? (
            <>
              <div style={{ flex: "1 1 80px", padding: "10px 12px", background: "color-mix(in srgb, var(--sage) 6%, var(--card))", border: "1px solid color-mix(in srgb, var(--sage) 20%, transparent)", borderRadius: 10 }}>
                <div style={{ fontSize: 9, color: "var(--sage)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>Status</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--sage)", fontFamily: "'Fraunces', serif" }}>Pro ✓</div>
                <div style={{ fontSize: 10, color: "var(--sage)" }}>{proPlan}</div>
              </div>
              <div style={{ flex: "1 1 80px", padding: "10px 12px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10 }}>
                <div style={{ fontSize: 9, color: "var(--light)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>Replies</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--terra)", fontFamily: "'Fraunces', serif" }}>∞</div>
                <div style={{ fontSize: 10, color: "var(--light)" }}>unlimited</div>
              </div>
              <div style={{ flex: "1 1 80px", padding: "10px 12px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10 }}>
                <div style={{ fontSize: 9, color: "var(--light)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>History</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--terra)", fontFamily: "'Fraunces', serif" }}>{history.length}</div>
                <div style={{ fontSize: 10, color: "var(--light)" }}>saved</div>
              </div>
            </>
          ) : (
            <>
              <div style={{ flex: "1 1 80px", padding: "10px 12px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10 }}>
                <div style={{ fontSize: 9, color: "var(--light)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>Today</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: canGen ? "var(--sage)" : "var(--terra)", fontFamily: "'Fraunces', serif" }}>{used}/{FREE_LIMIT}</div>
                <div style={{ fontSize: 10, color: "var(--light)" }}>used</div>
              </div>
              <div style={{ flex: "1 1 80px", padding: "10px 12px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10 }}>
                <div style={{ fontSize: 9, color: "var(--light)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>Total</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--terra)", fontFamily: "'Fraunces', serif" }}>{totalGenerated}</div>
                <div style={{ fontSize: 10, color: "var(--light)" }}>all time</div>
              </div>
              <div style={{ flex: "1 1 80px", padding: "10px 12px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10 }}>
                <div style={{ fontSize: 9, color: "var(--light)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>History</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--dim)", fontFamily: "'Fraunces', serif" }}>Pro</div>
                <div style={{ fontSize: 10, color: "var(--light)" }}>upgrade</div>
              </div>
            </>
          )}
        </div>

        {/* GENERATE TAB */}
        {tab === "generate" && (
          <div style={{ background: "var(--card)", borderRadius: 14, border: "1px solid var(--border)", padding: "clamp(12px, 3vw, 22px)", transition: "background 0.3s" }}>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", display: "block", marginBottom: 4 }}>Star rating</label>
              <div style={{ display: "flex", gap: 4 }}>{[1,2,3,4,5].map(s => <button key={s} onClick={() => setStars(s)} style={{ width: 38, height: 38, borderRadius: 8, background: s <= stars ? "color-mix(in srgb, var(--star) 15%, var(--card))" : "var(--inputBg)", border: s <= stars ? "2px solid var(--star)" : "1px solid var(--border)", fontSize: 17, cursor: "pointer", color: s <= stars ? "var(--star)" : "var(--starOff)", transition: "all 0.15s" }}>★</button>)}</div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", display: "block", marginBottom: 4 }}>Platform</label>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{PLATFORMS.map(p => <Pill key={p} active={platform === p} onClick={() => setPlatform(p)}>{p}</Pill>)}</div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", display: "block", marginBottom: 4 }}>Paste the customer review</label>
              <textarea value={review} onChange={e => setReview(e.target.value)} placeholder={`Paste a customer ${platform} review here...`} rows={3} style={{ ...inp, fontSize: 15, lineHeight: 1.6, padding: "12px", borderRadius: 12, resize: "vertical" }} />
              {review.length > 0 && <div style={{ fontSize: 10, color: "var(--light)", marginTop: 2, textAlign: "right" }}>{review.length} chars</div>}
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }} className="stack-mobile">
              <div style={{ flex: "1 1 130px" }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", display: "block", marginBottom: 4 }}>Your business type</label>
                <select value={bizType} onChange={e => setBizType(e.target.value)} style={{ ...inp, cursor: "pointer" }}><option value="">Select...</option>{BIZ_TYPES.map(b => <option key={b}>{b}</option>)}</select>
              </div>
              <div style={{ flex: "1 1 100px" }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", display: "block", marginBottom: 4 }}>Reply language</label>
                <select value={respLang} onChange={e => setRespLang(e.target.value)} style={{ ...inp, cursor: "pointer" }}>{LANG_CODES.map(c => <option key={c} value={c}>{LANG_FLAGS[c]} {LANG_NAMES[c]}</option>)}</select>
              </div>
              <div style={{ flex: "1 1 180px" }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", display: "block", marginBottom: 4 }}>Tone</label>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{TONES_KEYS.map(k => { const locked = !isPro && (k === "casual" || k === "apologetic"); return <Pill key={k} active={tone === k} locked={locked} onClick={() => locked ? setShowPricing(true) : setTone(k)}>{TONE_LABELS[k]}{locked ? " 🔒" : ""}</Pill>; })}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }} className="stack-mobile">
              <div style={{ flex: "1 1 150px" }}><label style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", display: "block", marginBottom: 4 }}>Business name <span style={{ fontWeight: 400, color: "var(--light)" }}>(optional)</span></label><input value={bizName} onChange={e => setBizName(e.target.value)} placeholder="e.g., ProFlow Plumbing" style={inp} /></div>
              <div style={{ flex: "1 1 110px" }}><label style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", display: "block", marginBottom: 4 }}>Sign off as <span style={{ fontWeight: 400, color: "var(--light)" }}>(optional)</span></label><input value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="e.g., Mike" style={inp} /></div>
            </div>
            <button onClick={generate} disabled={!review.trim() || stars === 0 || loading} style={{ width: "100%", padding: "13px", borderRadius: 11, background: (!review.trim() || stars === 0) ? "var(--sandDk)" : loading ? "var(--sandDk)" : "var(--terra)", border: "none", fontSize: 15, fontWeight: 700, cursor: (!review.trim() || stars === 0 || loading) ? "not-allowed" : "pointer", color: (!review.trim() || stars === 0) ? "var(--light)" : "#fff", fontFamily: "'Instrument Sans', sans-serif", transition: "all 0.2s" }}>
              {loading ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><span style={{ width: 15, height: 15, border: "2px solid #fff4", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .6s linear infinite", display: "inline-block" }} />Writing your reply...</span> : !canGen ? "Daily limit reached — Go Pro for unlimited" : isPro ? "Write My Reply" : `Write My Reply${used > 0 ? ` (${FREE_LIMIT - used} left)` : ""}`}
            </button>
            {response && (
              <div style={{ marginTop: 16, padding: "14px 16px", background: "color-mix(in srgb, var(--sage) 8%, var(--card))", borderRadius: 12, border: "1px solid color-mix(in srgb, var(--sage) 20%, transparent)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, background: "var(--sage)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#fff" }}>✓</div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "var(--sage)" }}>Your reply — ready to post on {platform}</span>
                    {respLang !== "en" && <span style={{ fontSize: 10, padding: "1px 5px", background: "color-mix(in srgb, var(--sage) 15%, transparent)", borderRadius: 4, color: "var(--sage)" }}>{LANG_NAMES[respLang]}</span>}
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText(response); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ padding: "5px 14px", borderRadius: 7, background: copied ? "color-mix(in srgb, var(--sage) 10%, var(--card))" : "var(--card)", border: `1px solid ${copied ? "color-mix(in srgb, var(--sage) 30%, transparent)" : "var(--border)"}`, fontSize: 11, fontWeight: 600, color: copied ? "var(--sage)" : "var(--dim)", cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif" }}>{copied ? "Copied!" : "Copy Reply"}</button>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text)", margin: 0 }}>{response}</p>
                <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                  <button onClick={generate} style={{ padding: "4px 10px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 7, fontSize: 11, color: "var(--dim)", cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif" }}>Try another</button>
                  <span style={{ fontSize: 10, color: "var(--light)", display: "flex", alignItems: "center" }}>{response.split(/\s+/).length} words</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* HISTORY TAB */}
        {tab === "history" && !isPro && (
          <div style={{ textAlign: "center", padding: "48px 16px", background: "var(--card)", borderRadius: 14, border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 900, color: "var(--text)", marginBottom: 6 }}>Reply History is a Pro feature</h2>
            <p style={{ fontSize: 13, color: "var(--dim)", maxWidth: 340, margin: "0 auto 20px", lineHeight: 1.5 }}>Pro members get every reply saved automatically. Review, copy, and reuse your best responses.</p>
            <a href={STRIPE_MONTHLY} target="_blank" rel="noopener" style={{ display: "inline-block", padding: "11px 24px", borderRadius: 10, background: "var(--terra)", fontSize: 14, fontWeight: 700, color: "#fff", textDecoration: "none" }}>Go Pro — $19/month</a>
            <p style={{ fontSize: 10, color: "var(--light)", marginTop: 8 }}>Cancel anytime.</p>
            <div style={{ marginTop: 10, borderTop: "1px solid var(--border)", paddingTop: 10 }}>
              <button onClick={() => setShowVerify(true)} style={{ background: "none", border: "none", fontSize: 12, color: "var(--terra)", cursor: "pointer", textDecoration: "underline", fontFamily: "'Instrument Sans', sans-serif" }}>Already subscribed? Verify here</button>
            </div>
          </div>
        )}
        {tab === "history" && isPro && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700, color: "var(--text)" }}>Reply History</h2>
              {history.length > 0 && <button onClick={clearHist} style={{ padding: "4px 10px", background: "none", border: "1px solid var(--border)", borderRadius: 7, fontSize: 10, color: "var(--dim)", cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif" }}>Clear All</button>}
            </div>
            {history.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, background: "var(--card)", borderRadius: 14, border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📝</div>
                <div style={{ color: "var(--dim)", fontSize: 13 }}>No replies yet. Your replies will be saved here automatically.</div>
                <button onClick={() => setTab("generate")} style={{ marginTop: 10, padding: "7px 18px", background: "var(--terra)", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif" }}>Write Your First Reply</button>
              </div>
            ) : history.map(h => (
              <div key={h.id} style={{ background: "var(--card)", borderRadius: 10, border: "1px solid var(--border)", padding: "12px 14px", marginBottom: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5, flexWrap: "wrap", gap: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ display: "flex", gap: 1 }}>{[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 10, color: s <= h.stars ? "var(--star)" : "var(--starOff)" }}>★</span>)}</div>
                    <span style={{ fontSize: 9, padding: "2px 5px", background: "var(--sand)", borderRadius: 4, color: "var(--dim)", fontWeight: 600 }}>{h.platform}</span>
                    {h.language !== "English" && <span style={{ fontSize: 9, padding: "2px 5px", background: "color-mix(in srgb, var(--sage) 15%, transparent)", borderRadius: 4, color: "var(--sage)", fontWeight: 600 }}>{h.language}</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ fontSize: 9, color: "var(--light)" }}>{h.time}</span>
                    <button onClick={() => deleteHist(h.id)} style={{ background: "none", border: "none", fontSize: 13, color: "var(--light)", cursor: "pointer", padding: 0 }}>×</button>
                  </div>
                </div>
                <p style={{ fontSize: 11, color: "var(--dim)", lineHeight: 1.4, fontStyle: "italic", marginBottom: 6, padding: "6px 8px", background: "var(--inputBg)", borderRadius: 6 }}>"{h.review}{h.review.length >= 200 ? "..." : ""}"</p>
                <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6, marginBottom: 6 }}>{h.response}</p>
                <button onClick={() => navigator.clipboard.writeText(h.response)} style={{ padding: "3px 10px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 5, fontSize: 10, color: "var(--dim)", cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif" }}>Copy</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ padding: "14px 16px", borderTop: "1px solid var(--border)", background: "var(--card)", marginTop: "auto" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
          <span style={{ fontSize: 10, color: "var(--light)" }}>© 2026 NoteBack</span>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <a href="/" style={{ fontSize: 10, color: "var(--dim)", textDecoration: "none" }}>Home</a>
            <a href="mailto:support@noteback.co" style={{ fontSize: 10, color: "var(--dim)", textDecoration: "none" }}>Contact</a>
            <a href="/privacy" style={{ fontSize: 10, color: "var(--dim)", textDecoration: "none" }}>Privacy</a>
            <a href="/terms" style={{ fontSize: 10, color: "var(--dim)", textDecoration: "none" }}>Terms</a>
            <a href={STRIPE_PORTAL} target="_blank" rel="noopener" style={{ fontSize: 10, color: "var(--dim)", textDecoration: "none" }}>Manage Subscription</a>
            {isPro && <button onClick={logoutPro} style={{ background: "none", border: "none", fontSize: 10, color: "var(--light)", cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif" }}>Logout</button>}
          </div>
        </div>
      </footer>

      {/* VERIFY PRO MODAL */}
      {showVerify && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(44,36,24,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 16 }} onClick={() => setShowVerify(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "var(--card)", borderRadius: 16, padding: 24, maxWidth: 380, width: "100%", boxShadow: "0 24px 64px rgba(44,36,24,0.25)" }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 900, color: "var(--text)", marginBottom: 6 }}>Verify Pro</h2>
            <p style={{ fontSize: 13, color: "var(--dim)", marginBottom: 16, lineHeight: 1.5 }}>Enter the email you used when subscribing on Stripe. We'll check your subscription status.</p>
            <input value={verifyInput} onChange={e => setVerifyInput(e.target.value)} placeholder="your@email.com" onKeyDown={e => e.key === "Enter" && verifyPro()} style={{ ...inp, marginBottom: 10 }} />
            {proError && <p style={{ fontSize: 12, color: "#c44", marginBottom: 8 }}>{proError}</p>}
            <button onClick={verifyPro} disabled={proVerifying} style={{ width: "100%", padding: 12, borderRadius: 10, background: proVerifying ? "var(--sandDk)" : "var(--terra)", border: "none", fontSize: 14, fontWeight: 700, color: "#fff", cursor: proVerifying ? "wait" : "pointer", fontFamily: "'Instrument Sans', sans-serif" }}>{proVerifying ? "Checking..." : "Verify Subscription"}</button>
            <div style={{ marginTop: 12, textAlign: "center" }}>
              <p style={{ fontSize: 11, color: "var(--light)" }}>Don't have Pro yet?</p>
              <a href={STRIPE_MONTHLY} target="_blank" rel="noopener" style={{ fontSize: 12, color: "var(--terra)", fontWeight: 600, textDecoration: "none" }}>Subscribe — $19/mo</a>
            </div>
            <button onClick={() => setShowVerify(false)} style={{ display: "block", margin: "10px auto 0", background: "none", border: "none", fontSize: 12, color: "var(--dim)", cursor: "pointer", textDecoration: "underline" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* PRICING MODAL */}
      {showPricing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(44,36,24,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 16 }} onClick={() => setShowPricing(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "var(--card)", borderRadius: 16, padding: 24, maxWidth: 380, width: "100%", boxShadow: "0 24px 64px rgba(44,36,24,0.25)" }}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 900, color: "var(--text)" }}>Go Pro</h2>
              <p style={{ fontSize: 12, color: "var(--dim)", marginTop: 4 }}>Unlimited replies. All tones. Reply history.</p>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[{ name: "Monthly", price: "$19", sub: "/mo", note: "Cancel anytime", href: STRIPE_MONTHLY }, { name: "Yearly", price: "$149", sub: "/yr", note: "Save 35%", pop: true, href: STRIPE_YEARLY }].map(p => (
                <a key={p.name} href={p.href} target="_blank" rel="noopener" style={{ flex: 1, padding: 12, borderRadius: 12, textAlign: "center", background: p.pop ? "color-mix(in srgb, var(--terra) 6%, var(--card))" : "var(--inputBg)", border: `2px solid ${p.pop ? "var(--terra)" : "var(--border)"}`, position: "relative", textDecoration: "none", display: "block" }}>
                  {p.pop && <span style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", background: "var(--terra)", color: "#fff", fontSize: 8, fontWeight: 700, padding: "2px 8px", borderRadius: 99, letterSpacing: 1 }}>BEST VALUE</span>}
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--dim)", marginBottom: 2 }}>{p.name}</div>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 900, color: "var(--text)" }}>{p.price}<span style={{ fontSize: 11, fontWeight: 400, color: "var(--dim)" }}>{p.sub}</span></div>
                  <div style={{ fontSize: 10, color: "var(--terra)", marginTop: 2 }}>{p.note}</div>
                </a>
              ))}
            </div>
            <p style={{ textAlign: "center", fontSize: 10, color: "var(--light)" }}>Secure checkout via Stripe. Cancel anytime.</p>
            <div style={{ marginTop: 10, textAlign: "center", borderTop: "1px solid var(--border)", paddingTop: 10 }}>
              <button onClick={() => { setShowPricing(false); setShowVerify(true); }} style={{ background: "none", border: "none", fontSize: 12, color: "var(--terra)", cursor: "pointer", textDecoration: "underline", fontFamily: "'Instrument Sans', sans-serif" }}>Already subscribed? Verify here</button>
            </div>
            <button onClick={() => setShowPricing(false)} style={{ display: "block", margin: "8px auto 0", background: "none", border: "none", fontSize: 12, color: "var(--dim)", cursor: "pointer", textDecoration: "underline" }}>Maybe later</button>
          </div>
        </div>
      )}
    </div>
  );
}
