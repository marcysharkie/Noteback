"use client";
import { useState, useEffect } from "react";

const FREE_LIMIT = 2;
const BIZ_TYPES = ["Restaurant","Plumber","HVAC","Electrician","Dentist","Auto Repair","Salon / Barbershop","Med Spa","Cleaning Service","Roofing","Landscaping","Veterinarian","Real Estate","Law Office","Retail","Other"];
const TONES = [
  { key: "warm", label: "Warm & Friendly", free: true },
  { key: "professional", label: "Professional", free: true },
  { key: "casual", label: "Casual", free: false },
  { key: "apologetic", label: "Apologetic", free: false },
  { key: "confident", label: "Confident", free: false },
  { key: "empathetic", label: "Empathetic", free: false },
];
const PLATFORMS = ["Google","Yelp","Facebook","TripAdvisor","Trustpilot","BBB","Nextdoor","Other"];
const LANG_CODES = ["en","es","fr","pt","de","zh","ja","ko"];
const LANG_LABELS = { en:"English", es:"Spanish", fr:"French", pt:"Portuguese", de:"German", zh:"Chinese", ja:"Japanese", ko:"Korean" };
const LANG_API = { en:"English", es:"Spanish", fr:"French", pt:"Portuguese", de:"German", zh:"Chinese", ja:"Japanese", ko:"Korean" };
const STRIPE_MONTHLY = "https://buy.stripe.com/aFa4gy6QjcMBebZf68fUQ00";
const STRIPE_YEARLY = "https://buy.stripe.com/28E14m1vZbIxgk73nqfUQ01";
const STRIPE_PORTAL = "https://billing.stripe.com/p/login/aFa4gy6QjcMBebZf68fUQ00";

function Pill({ active, locked, children, onClick }) {
  return <button onClick={onClick} style={{ padding: "6px 12px", borderRadius: 7, background: active ? "color-mix(in srgb, var(--terra) 12%, transparent)" : "var(--inputBg)", border: `1px solid ${active ? "color-mix(in srgb, var(--terra) 35%, transparent)" : "var(--border)"}`, fontSize: 12, fontWeight: active ? 600 : 400, color: active ? "var(--terra)" : locked ? "var(--light)" : "var(--dim)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s", opacity: locked ? 0.6 : 1 }}>{children}</button>;
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
  const [isPro, setIsPro] = useState(false);
  const [proEmail, setProEmail] = useState("");
  const [proVerifying, setProVerifying] = useState(false);
  const [proError, setProError] = useState("");
  const [proPlan, setProPlan] = useState("");
  const [showVerify, setShowVerify] = useState(false);
  const [verifyInput, setVerifyInput] = useState("");
  const [brandVoice, setBrandVoice] = useState(null);
  const [showBrandVoice, setShowBrandVoice] = useState(false);
  const [bvName, setBvName] = useState("");
  const [bvTone, setBvTone] = useState("warm");
  const [bvSignoff, setBvSignoff] = useState("");
  const [bvType, setBvType] = useState("");

  useEffect(() => {
    try {
      const th = localStorage.getItem("nb_theme"); if (th === "dark") { setDark(true); document.documentElement.setAttribute("data-theme", "dark"); }
      const u = JSON.parse(localStorage.getItem("nb_usage") || "{}"); const today = new Date().toISOString().split("T")[0];
      if (u.date === today) setUsed(u.count || 0); else localStorage.setItem("nb_usage", JSON.stringify({ date: today, count: 0 }));
      const tg = parseInt(localStorage.getItem("nb_total") || "0"); setTotalGenerated(tg);
      const saved = JSON.parse(localStorage.getItem("nb_pro") || "null");
      if (saved && saved.email && saved.isPro) { setIsPro(true); setProEmail(saved.email); setProPlan(saved.plan || "monthly"); const h = JSON.parse(localStorage.getItem("nb_history") || "[]"); setHistory(h); }
      const bv = JSON.parse(localStorage.getItem("nb_brandvoice") || "null");
      if (bv) { setBrandVoice(bv); setBizName(bv.name || ""); setOwnerName(bv.signoff || ""); setTone(bv.tone || "warm"); setBizType(bv.type || ""); }
      const ex = localStorage.getItem("nb_example");
      if (ex) { const e = JSON.parse(ex); setReview(e.text || ""); setStars(e.stars || 0); setBizType(e.biz || ""); setPlatform(e.platform || "Google"); localStorage.removeItem("nb_example"); }
    } catch {}
  }, []);

  const toggleDark = () => { const n = !dark; setDark(n); document.documentElement.setAttribute("data-theme", n ? "dark" : ""); localStorage.setItem("nb_theme", n ? "dark" : "light"); };
  const canGen = isPro || used < FREE_LIMIT;

  const verifyPro = async () => {
    const email = verifyInput.trim().toLowerCase();
    if (!email || !email.includes("@")) { setProError("Enter a valid email address."); return; }
    setProVerifying(true); setProError("");
    try {
      const res = await fetch("/api/verify-pro", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (data.isPro) { setIsPro(true); setProEmail(email); setProPlan(data.plan || "monthly"); setShowVerify(false); try { localStorage.setItem("nb_pro", JSON.stringify({ email, isPro: true, plan: data.plan })); } catch {} }
      else { setProError("No active subscription found for this email."); }
    } catch { setProError("Could not verify. Try again."); }
    setProVerifying(false);
  };

  const logoutPro = () => { setIsPro(false); setProEmail(""); setProPlan(""); setHistory([]); try { localStorage.removeItem("nb_pro"); localStorage.removeItem("nb_history"); } catch {} };

  const generate = async () => {
    if (!review.trim() || stars === 0) return;
    if (!canGen) { setShowPricing(true); return; }
    setLoading(true); setResponse("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review, stars, platform, bizType, bizName, ownerName, tone: TONES.find(t => t.key === tone)?.label || tone, language: LANG_API[respLang] || "English", proEmail: isPro ? proEmail : null }),
      });
      const data = await res.json();
      if (data.error) { if (res.status === 429) { setShowPricing(true); setLoading(false); return; } setResponse(data.error); }
      else {
        setResponse(data.response);
        if (!isPro) { const nc = used + 1; setUsed(nc); try { const td = new Date().toISOString().split("T")[0]; localStorage.setItem("nb_usage", JSON.stringify({ date: td, count: nc })); } catch {} }
        const nt = totalGenerated + 1; setTotalGenerated(nt);
        if (isPro) { const entry = { review: review.slice(0, 200), stars, platform, bizType, response: data.response, language: LANG_LABELS[respLang], time: new Date().toLocaleString(), id: Date.now() }; const nh = [entry, ...history].slice(0, 100); setHistory(nh); try { localStorage.setItem("nb_history", JSON.stringify(nh)); } catch {} }
        try { localStorage.setItem("nb_total", String(nt)); } catch {}
      }
    } catch { setResponse("Something went wrong. Please try again."); }
    setLoading(false);
  };

  const deleteHist = (id) => { const n = history.filter(h => h.id !== id); setHistory(n); try { localStorage.setItem("nb_history", JSON.stringify(n)); } catch {} };
  const clearHist = () => { setHistory([]); try { localStorage.removeItem("nb_history"); } catch {} };

  const inp = { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--inputBg)", fontSize: 14, color: "var(--text)", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* NAV */}
      <nav style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 960, margin: "0 auto", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a href="/" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
              <div style={{ width: 26, height: 26, borderRadius: 6, background: "var(--terra)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 13, color: "#fff" }}>N</span></div>
              <span className="hide-mobile" style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16, color: "var(--text)" }}>NoteBack</span>
            </a>
            <div style={{ display: "flex", gap: 2, marginLeft: 6 }}>
              <button onClick={() => setTab("generate")} style={{ padding: "5px 12px", borderRadius: 6, background: tab === "generate" ? "color-mix(in srgb, var(--terra) 10%, transparent)" : "transparent", border: "none", fontSize: 12, fontWeight: tab === "generate" ? 600 : 400, color: tab === "generate" ? "var(--terra)" : "var(--dim)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Write Reply</button>
              <button onClick={() => setTab("history")} style={{ padding: "5px 12px", borderRadius: 6, background: tab === "history" ? "color-mix(in srgb, var(--terra) 10%, transparent)" : "transparent", border: "none", fontSize: 12, fontWeight: tab === "history" ? 600 : 400, color: tab === "history" ? "var(--terra)" : "var(--dim)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{isPro ? `History (${history.length})` : "History"}</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <button onClick={toggleDark} style={{ width: 32, height: 32, borderRadius: 7, background: "var(--inputBg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden" }}><div style={{ width: 14, height: 14, borderRadius: 7, background: dark ? "var(--star)" : "var(--dim)", transition: "background 0.2s" }} /></button>
            {isPro ? (
              <>
                <span style={{ fontSize: 10, padding: "4px 10px", background: "color-mix(in srgb, var(--sage) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--sage) 25%, transparent)", borderRadius: 6, color: "var(--sage)", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>PRO</span>
                <a href={STRIPE_PORTAL} target="_blank" rel="noopener" className="hide-mobile" style={{ padding: "5px 10px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11, color: "var(--dim)", textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>Manage</a>
              </>
            ) : (
              <>
                <button onClick={() => setShowVerify(true)} className="hide-mobile" style={{ padding: "5px 10px", background: "none", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11, color: "var(--dim)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Verify Pro</button>
                <button onClick={() => setShowPricing(true)} style={{ padding: "5px 12px", background: "var(--terra)", border: "none", borderRadius: 6, fontSize: 11, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>Go Pro</button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div style={{ flex: 1, maxWidth: 680, width: "100%", margin: "0 auto", padding: "16px 14px" }}>
        {/* STATUS */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {isPro ? (
            <>
              <div style={{ flex: 1, padding: "10px 12px", background: "color-mix(in srgb, var(--sage) 5%, var(--card))", border: "1px solid color-mix(in srgb, var(--sage) 18%, transparent)", borderRadius: 10 }}>
                <div style={{ fontSize: 9, color: "var(--sage)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 2 }}>Plan</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "var(--sage)", fontFamily: "'DM Serif Display', serif" }}>Pro</div>
                <div style={{ fontSize: 10, color: "var(--sage)" }}>{proPlan}</div>
              </div>
              <div style={{ flex: 1, padding: "10px 12px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10 }}>
                <div style={{ fontSize: 9, color: "var(--light)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 2 }}>Replies</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "var(--terra)", fontFamily: "'DM Serif Display', serif" }}>Unlimited</div>
              </div>
              <div style={{ flex: 1, padding: "10px 12px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10 }}>
                <div style={{ fontSize: 9, color: "var(--light)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 2 }}>Saved</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", fontFamily: "'DM Serif Display', serif" }}>{history.length}</div>
              </div>
            </>
          ) : (
            <>
              <div style={{ flex: 1, padding: "10px 12px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10 }}>
                <div style={{ fontSize: 9, color: "var(--light)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 2 }}>Today</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: canGen ? "var(--sage)" : "var(--terra)", fontFamily: "'DM Serif Display', serif" }}>{used}/{FREE_LIMIT}</div>
                <div style={{ fontSize: 10, color: "var(--light)" }}>used</div>
              </div>
              <div style={{ flex: 1, padding: "10px 12px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10 }}>
                <div style={{ fontSize: 9, color: "var(--light)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 2 }}>Total</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", fontFamily: "'DM Serif Display', serif" }}>{totalGenerated}</div>
              </div>
              <div onClick={() => setShowPricing(true)} style={{ flex: 1, padding: "10px 12px", background: "color-mix(in srgb, var(--terra) 4%, var(--card))", border: "1px solid color-mix(in srgb, var(--terra) 15%, transparent)", borderRadius: 10, cursor: "pointer", transition: "border-color 0.15s" }}>
                <div style={{ fontSize: 9, color: "var(--light)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 2 }}>Pro</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--terra)" }}>Upgrade</div>
                <div style={{ fontSize: 10, color: "var(--light)" }}>$19/mo</div>
              </div>
            </>
          )}
        </div>

        {/* GENERATE TAB */}
        {tab === "generate" && (
          <div style={{ background: "var(--card)", borderRadius: 12, border: "1px solid var(--border)", padding: "clamp(12px, 3vw, 20px)" }}>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", display: "block", marginBottom: 4 }}>Star rating</label>
              <div style={{ display: "flex", gap: 4 }}>{[1,2,3,4,5].map(s => <button key={s} onClick={() => setStars(s)} style={{ width: 42, height: 42, borderRadius: 9, background: s <= stars ? "color-mix(in srgb, var(--star) 14%, var(--card))" : "var(--inputBg)", border: s <= stars ? "2px solid var(--star)" : "1px solid var(--border)", fontSize: 19, cursor: "pointer", color: s <= stars ? "var(--star)" : "var(--starOff)", transition: "all 0.12s, transform 0.1s", transform: s <= stars ? "scale(1.05)" : "scale(1)" }}>&#9733;</button>)}</div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", display: "block", marginBottom: 4 }}>Platform</label>
              <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>{PLATFORMS.map(p => <Pill key={p} active={platform === p} onClick={() => setPlatform(p)}>{p}</Pill>)}</div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", display: "block", marginBottom: 4 }}>Customer review</label>
              <textarea value={review} onChange={e => setReview(e.target.value)} placeholder={`Paste the ${platform} review you want to reply to...`} rows={3} style={{ ...inp, fontSize: 14, lineHeight: 1.55, padding: "11px 12px", borderRadius: 10, resize: "vertical" }} />
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }} className="stack-mobile">
              <div style={{ flex: "1 1 120px" }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", display: "block", marginBottom: 4 }}>Business type</label>
                <select value={bizType} onChange={e => setBizType(e.target.value)} style={{ ...inp, cursor: "pointer" }}><option value="">Select...</option>{BIZ_TYPES.map(b => <option key={b}>{b}</option>)}</select>
              </div>
              <div style={{ flex: "1 1 120px" }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", display: "block", marginBottom: 4 }}>Language {!isPro && <span style={{ fontSize: 10, color: "var(--light)" }}>Pro</span>}</label>
                {isPro ? (
                  <select value={respLang} onChange={e => setRespLang(e.target.value)} style={{ ...inp, cursor: "pointer" }}>{LANG_CODES.map(c => <option key={c} value={c}>{LANG_LABELS[c]}</option>)}</select>
                ) : (
                  <button onClick={() => setShowPricing(true)} style={{ ...inp, cursor: "pointer", textAlign: "left", color: "var(--light)" }}>English &middot; Upgrade for 8 languages</button>
                )}
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", display: "block", marginBottom: 4 }}>Tone {!isPro && <span style={{ fontSize: 10, color: "var(--light)" }}>2 of 6 free</span>}</label>
              <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>{TONES.map(t => { const locked = !isPro && !t.free; return <Pill key={t.key} active={tone === t.key} locked={locked} onClick={() => locked ? setShowPricing(true) : setTone(t.key)}>{t.label}{locked ? " *" : ""}</Pill>; })}</div>
            </div>
            {/* Brand Voice — Pro Feature */}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10, marginTop: 4, marginBottom: 10 }}>
              {isPro && brandVoice ? (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 500, color: "var(--light)", letterSpacing: "0.5px", textTransform: "uppercase" }}>Brand Voice</label>
                    <div style={{ fontSize: 12, color: "var(--dim)", marginTop: 2 }}>{brandVoice.name} / {TONES.find(t => t.key === brandVoice.tone)?.label} / {brandVoice.signoff}</div>
                  </div>
                  <button onClick={() => { setBvName(brandVoice.name); setBvTone(brandVoice.tone); setBvSignoff(brandVoice.signoff); setBvType(brandVoice.type); setShowBrandVoice(true); }} style={{ padding: "3px 10px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 5, fontSize: 10, color: "var(--dim)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Edit</button>
                </div>
              ) : isPro ? (
                <button onClick={() => setShowBrandVoice(true)} style={{ width: "100%", padding: "10px", borderRadius: 8, background: "var(--inputBg)", border: "1px dashed var(--border)", fontSize: 12, color: "var(--dim)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: 6 }}>+ Set up Brand Voice — save your business details for every reply</button>
              ) : (
                <div onClick={() => setShowPricing(true)} style={{ padding: "10px 12px", borderRadius: 8, background: "var(--inputBg)", border: "1px dashed var(--border)", cursor: "pointer", marginBottom: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "var(--dim)" }}>Brand Voice</span>
                      <span style={{ fontSize: 10, color: "var(--light)", marginLeft: 6 }}>Pro</span>
                    </div>
                    <span style={{ fontSize: 10, color: "var(--terra)", fontWeight: 600 }}>Upgrade</span>
                  </div>
                  <p style={{ fontSize: 11, color: "var(--light)", marginTop: 3, lineHeight: 1.4 }}>Save your business name, tone, and sign-off. Auto-fills every reply.</p>
                </div>
              )}
              <label style={{ fontSize: 11, fontWeight: 500, color: "var(--light)", display: "block", marginBottom: 6, letterSpacing: "0.5px", textTransform: "uppercase" }}>Optional overrides</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }} className="stack-mobile">
                <div style={{ flex: "1 1 140px" }}><label style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", display: "block", marginBottom: 4 }}>Business name</label><input value={bizName} onChange={e => setBizName(e.target.value)} placeholder={brandVoice ? brandVoice.name : "e.g., ProFlow Plumbing"} style={inp} /></div>
                <div style={{ flex: "1 1 100px" }}><label style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", display: "block", marginBottom: 4 }}>Sign off as</label><input value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder={brandVoice ? brandVoice.signoff : "e.g., Mike"} style={inp} /></div>
              </div>
            </div>
            <button onClick={generate} disabled={!review.trim() || stars === 0 || loading} style={{ width: "100%", padding: "13px", borderRadius: 10, background: (!review.trim() || stars === 0) ? "var(--sandDk)" : loading ? "color-mix(in srgb, var(--terra) 70%, var(--sandDk))" : "var(--terra)", border: "none", fontSize: 15, fontWeight: 700, cursor: (!review.trim() || stars === 0 || loading) ? "not-allowed" : "pointer", color: (!review.trim() || stars === 0) ? "var(--light)" : "#fff", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s", letterSpacing: "-0.2px" }}>
              {loading ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><span style={{ width: 14, height: 14, border: "2px solid #fff4", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .6s linear infinite", display: "inline-block" }} />Writing...</span> : !canGen ? "Limit reached — upgrade to Pro" : isPro ? "Write My Reply" : `Write My Reply${used > 0 ? ` (${FREE_LIMIT - used} left)` : ""}`}
            </button>
            {response && (
              <div style={{ marginTop: 14, padding: "14px 16px", background: "color-mix(in srgb, var(--sage) 6%, var(--card))", borderRadius: 10, border: "1px solid color-mix(in srgb, var(--sage) 15%, transparent)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--sage)" }}>Ready to post on {platform}</span>
                  <button onClick={() => { navigator.clipboard.writeText(response); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ padding: "5px 14px", borderRadius: 6, background: copied ? "color-mix(in srgb, var(--sage) 8%, var(--card))" : "var(--card)", border: `1px solid ${copied ? "color-mix(in srgb, var(--sage) 25%, transparent)" : "var(--border)"}`, fontSize: 11, fontWeight: 600, color: copied ? "var(--sage)" : "var(--dim)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{copied ? "Copied" : "Copy Reply"}</button>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text)", margin: 0 }}>{response}</p>
                <button onClick={generate} style={{ marginTop: 8, padding: "4px 10px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11, color: "var(--dim)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Try another</button>
              </div>
            )}
            {/* Blurred Pro Preview — only for free users after generating */}
            {response && !isPro && (
              <div onClick={() => setShowPricing(true)} style={{ marginTop: 10, padding: "14px 16px", background: "color-mix(in srgb, var(--terra) 4%, var(--card))", borderRadius: 10, border: "1px dashed color-mix(in srgb, var(--terra) 25%, transparent)", cursor: "pointer", position: "relative", overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--terra)" }}>Pro version — more detailed, empathetic tone</span>
                  <span style={{ fontSize: 10, padding: "2px 8px", background: "var(--terra)", color: "#fff", borderRadius: 4, fontWeight: 600 }}>PRO</span>
                </div>
                <div style={{ filter: "blur(5px)", userSelect: "none", pointerEvents: "none" }}>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--dim)", margin: 0 }}>Thank you so much for taking the time to share your experience with us. We truly appreciate your honest feedback and want you to know that we take every comment seriously. Your satisfaction is our top priority, and we would love the opportunity to make things right. Please don't hesitate to reach out to us directly so we can address your concerns personally and ensure your next experience exceeds your expectations.</p>
                </div>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 50, background: "linear-gradient(transparent, var(--card))" }} />
                <div style={{ textAlign: "center", marginTop: -8, position: "relative", zIndex: 1 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--terra)" }}>Unlock Pro replies — $19/mo</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* HISTORY TAB — LOCKED */}
        {tab === "history" && !isPro && (
          <div style={{ textAlign: "center", padding: "56px 20px", background: "var(--card)", borderRadius: 12, border: "1px solid var(--border)" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--inputBg)", border: "1px solid var(--border)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 16, color: "var(--dim)" }}>&#9911;</div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, fontWeight: 400, color: "var(--text)", marginBottom: 8 }}>Reply history is a Pro feature</h2>
            <p style={{ fontSize: 13, color: "var(--dim)", maxWidth: 320, margin: "0 auto 20px", lineHeight: 1.5 }}>Every reply you write is saved automatically. Search, copy, and reuse your best responses.</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              <a href={STRIPE_MONTHLY} target="_blank" rel="noopener" style={{ padding: "10px 24px", borderRadius: 8, background: "var(--terra)", fontSize: 13, fontWeight: 600, color: "#fff", textDecoration: "none" }}>Go Pro — $19/mo</a>
              <button onClick={() => setShowVerify(true)} style={{ padding: "10px 20px", borderRadius: 8, background: "var(--card)", border: "1px solid var(--border)", fontSize: 13, color: "var(--dim)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Already Pro? Verify</button>
            </div>
          </div>
        )}

        {/* HISTORY TAB — PRO */}
        {tab === "history" && isPro && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, fontWeight: 400, color: "var(--text)" }}>Reply History</h2>
              {history.length > 0 && <button onClick={clearHist} style={{ padding: "4px 10px", background: "none", border: "1px solid var(--border)", borderRadius: 6, fontSize: 10, color: "var(--dim)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Clear All</button>}
            </div>
            {history.length === 0 ? (
              <div style={{ textAlign: "center", padding: 36, background: "var(--card)", borderRadius: 12, border: "1px solid var(--border)" }}>
                <p style={{ color: "var(--dim)", fontSize: 13, marginBottom: 10 }}>Your replies will appear here automatically.</p>
                <button onClick={() => setTab("generate")} style={{ padding: "8px 18px", background: "var(--terra)", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Write a Reply</button>
              </div>
            ) : history.map(h => (
              <div key={h.id} style={{ background: "var(--card)", borderRadius: 10, border: "1px solid var(--border)", padding: "12px 14px", marginBottom: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5, flexWrap: "wrap", gap: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ display: "flex", gap: 1 }}>{[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 10, color: s <= h.stars ? "var(--star)" : "var(--starOff)" }}>&#9733;</span>)}</div>
                    <span style={{ fontSize: 10, padding: "1px 6px", background: "var(--sand)", borderRadius: 3, color: "var(--dim)", fontWeight: 500 }}>{h.platform}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ fontSize: 9, color: "var(--light)" }}>{h.time}</span>
                    <button onClick={() => deleteHist(h.id)} style={{ background: "none", border: "none", fontSize: 13, color: "var(--light)", cursor: "pointer", padding: 0, lineHeight: 1 }}>&#215;</button>
                  </div>
                </div>
                <p style={{ fontSize: 11, color: "var(--dim)", lineHeight: 1.4, fontStyle: "italic", marginBottom: 6, padding: "5px 8px", background: "var(--inputBg)", borderRadius: 6 }}>"{h.review}{h.review.length >= 200 ? "..." : ""}"</p>
                <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.55, marginBottom: 5 }}>{h.response}</p>
                <button onClick={() => navigator.clipboard.writeText(h.response)} style={{ padding: "3px 8px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 5, fontSize: 10, color: "var(--dim)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Copy</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ padding: "14px 16px", borderTop: "1px solid var(--border)", background: "var(--card)", marginTop: "auto" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
          <span style={{ fontSize: 10, color: "var(--light)" }}>NoteBack 2026</span>
          <div style={{ display: "flex", gap: 12 }}>
            <a href="/" style={{ fontSize: 10, color: "var(--dim)", textDecoration: "none" }}>Home</a>
            <a href="mailto:support@noteback.co" style={{ fontSize: 10, color: "var(--dim)", textDecoration: "none" }}>Contact</a>
            <a href="/privacy" style={{ fontSize: 10, color: "var(--dim)", textDecoration: "none" }}>Privacy</a>
            <a href="/terms" style={{ fontSize: 10, color: "var(--dim)", textDecoration: "none" }}>Terms</a>
            <a href={STRIPE_PORTAL} target="_blank" rel="noopener" style={{ fontSize: 10, color: "var(--dim)", textDecoration: "none" }}>Manage</a>
            {isPro && <button onClick={logoutPro} style={{ background: "none", border: "none", fontSize: 10, color: "var(--light)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Logout</button>}
          </div>
        </div>
      </footer>

      {/* BRAND VOICE MODAL */}
      {showBrandVoice && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(28,25,23,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 16 }} onClick={() => setShowBrandVoice(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "var(--card)", borderRadius: 14, padding: 24, maxWidth: 400, width: "100%", border: "1px solid var(--border)" }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, fontWeight: 400, color: "var(--text)", marginBottom: 4 }}>Brand Voice</h2>
            <p style={{ fontSize: 13, color: "var(--dim)", marginBottom: 16, lineHeight: 1.5 }}>Save your business details. Every reply will use these automatically.</p>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", display: "block", marginBottom: 4 }}>Business name</label>
              <input value={bvName} onChange={e => setBvName(e.target.value)} placeholder="e.g., ProFlow Plumbing" style={inp} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", display: "block", marginBottom: 4 }}>Business type</label>
              <select value={bvType} onChange={e => setBvType(e.target.value)} style={{ ...inp, cursor: "pointer" }}><option value="">Select...</option>{BIZ_TYPES.map(b => <option key={b}>{b}</option>)}</select>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", display: "block", marginBottom: 4 }}>Default tone</label>
              <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>{TONES.map(t => <Pill key={t.key} active={bvTone === t.key} onClick={() => setBvTone(t.key)}>{t.label}</Pill>)}</div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", display: "block", marginBottom: 4 }}>Sign off as</label>
              <input value={bvSignoff} onChange={e => setBvSignoff(e.target.value)} placeholder="e.g., Mike" style={inp} />
            </div>
            <button onClick={() => { const bv = { name: bvName, type: bvType, tone: bvTone, signoff: bvSignoff }; setBrandVoice(bv); setBizName(bv.name); setBizType(bv.type); setTone(bv.tone); setOwnerName(bv.signoff); setShowBrandVoice(false); try { localStorage.setItem("nb_brandvoice", JSON.stringify(bv)); } catch {} }} style={{ width: "100%", padding: 11, borderRadius: 8, background: "var(--terra)", border: "none", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Save Brand Voice</button>
            {brandVoice && <button onClick={() => { setBrandVoice(null); setShowBrandVoice(false); try { localStorage.removeItem("nb_brandvoice"); } catch {} }} style={{ display: "block", margin: "8px auto 0", background: "none", border: "none", fontSize: 11, color: "var(--light)", cursor: "pointer" }}>Remove Brand Voice</button>}
            <button onClick={() => setShowBrandVoice(false)} style={{ display: "block", margin: "6px auto 0", background: "none", border: "none", fontSize: 12, color: "var(--dim)", cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* VERIFY MODAL */}
      {showVerify && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(28,25,23,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 16 }} onClick={() => setShowVerify(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "var(--card)", borderRadius: 14, padding: 24, maxWidth: 380, width: "100%", border: "1px solid var(--border)" }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, fontWeight: 400, color: "var(--text)", marginBottom: 8 }}>Verify your subscription</h2>
            <p style={{ fontSize: 13, color: "var(--dim)", marginBottom: 14, lineHeight: 1.5 }}>Enter the email address you used when you subscribed.</p>
            <input value={verifyInput} onChange={e => setVerifyInput(e.target.value)} placeholder="you@email.com" onKeyDown={e => e.key === "Enter" && verifyPro()} style={{ ...inp, marginBottom: 8 }} />
            {proError && <p style={{ fontSize: 12, color: "#B85C38", marginBottom: 8 }}>{proError}</p>}
            <button onClick={verifyPro} disabled={proVerifying} style={{ width: "100%", padding: 11, borderRadius: 8, background: proVerifying ? "var(--sandDk)" : "var(--terra)", border: "none", fontSize: 13, fontWeight: 600, color: "#fff", cursor: proVerifying ? "wait" : "pointer", fontFamily: "'DM Sans', sans-serif" }}>{proVerifying ? "Checking..." : "Verify"}</button>
            <button onClick={() => setShowVerify(false)} style={{ display: "block", margin: "10px auto 0", background: "none", border: "none", fontSize: 12, color: "var(--dim)", cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* PRICING MODAL */}
      {showPricing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(28,25,23,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 16 }} onClick={() => setShowPricing(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "var(--card)", borderRadius: 14, padding: 24, maxWidth: 400, width: "100%", border: "1px solid var(--border)" }}>
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: "var(--text)", marginBottom: 6 }}>Upgrade to Pro</h2>
              <p style={{ fontSize: 13, color: "var(--dim)" }}>Unlimited replies, all 6 tones, 8 languages, history.</p>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {[{ name: "Monthly", price: "$19", sub: "/mo", note: "Cancel anytime", href: STRIPE_MONTHLY }, { name: "Yearly", price: "$149", sub: "/yr", note: "Save 35%", pop: true, href: STRIPE_YEARLY }].map(p => (
                <a key={p.name} href={p.href} target="_blank" rel="noopener" style={{ flex: 1, padding: 14, borderRadius: 10, textAlign: "center", background: "var(--card)", border: `2px solid ${p.pop ? "var(--terra)" : "var(--border)"}`, position: "relative", textDecoration: "none" }}>
                  {p.pop && <span style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", background: "var(--terra)", color: "#fff", fontSize: 8, fontWeight: 700, padding: "2px 8px", borderRadius: 99 }}>BEST VALUE</span>}
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--dim)", marginBottom: 2 }}>{p.name}</div>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, color: "var(--text)" }}>{p.price}<span style={{ fontSize: 12, color: "var(--dim)", fontFamily: "'DM Sans', sans-serif" }}>{p.sub}</span></div>
                  <div style={{ fontSize: 10, color: "var(--terra)", marginTop: 2 }}>{p.note}</div>
                </a>
              ))}
            </div>
            <p style={{ textAlign: "center", fontSize: 10, color: "var(--light)", marginBottom: 8 }}>Secure checkout via Stripe.</p>
            <div style={{ textAlign: "center", borderTop: "1px solid var(--border)", paddingTop: 10 }}>
              <button onClick={() => { setShowPricing(false); setShowVerify(true); }} style={{ background: "none", border: "none", fontSize: 12, color: "var(--terra)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Already subscribed? Verify here</button>
            </div>
            <button onClick={() => setShowPricing(false)} style={{ display: "block", margin: "8px auto 0", background: "none", border: "none", fontSize: 12, color: "var(--dim)", cursor: "pointer" }}>Maybe later</button>
          </div>
        </div>
      )}
    </div>
  );
}
