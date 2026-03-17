"use client";
import { useState, useEffect, useRef } from "react";

const FREE_LIMIT = 1;
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

const DEMO_REVIEW = "Waited over an hour for our food. When it finally came, my steak was cold and the waiter didn't seem to care. Very disappointing experience overall.";
const DEMO_REPLY = "Thank you for sharing your experience — I'm genuinely sorry your visit didn't meet our standards. A cold steak and a long wait is not what we're about, and I take full responsibility. I'd love the chance to make this right. Would you be open to reaching out to me directly at [phone/email]? I want to make sure your next visit is the experience you deserve. — James, Owner";

export default function Dashboard() {
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [bizType, setBizType] = useState("");
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
  const [tab, setTab] = useState("write");
  const [totalGenerated, setTotalGenerated] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const [proEmail, setProEmail] = useState("");
  const [proVerifying, setProVerifying] = useState(false);
  const [proError, setProError] = useState("");
  const [proPlan, setProPlan] = useState("");
  const [showVerify, setShowVerify] = useState(false);
  const [verifyInput, setVerifyInput] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [brandSignoff, setBrandSignoff] = useState("");
  // Demo animation
  const [demoVisible, setDemoVisible] = useState(true);
  const [demoTyped, setDemoTyped] = useState("");
  const [demoComplete, setDemoComplete] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    try {
      const th = localStorage.getItem("nb_theme"); if (th === "dark") { setDark(true); document.documentElement.setAttribute("data-theme", "dark"); }
      const u = JSON.parse(localStorage.getItem("nb_usage") || "{}"); const today = new Date().toISOString().split("T")[0];
      if (u.date === today) setUsed(u.count || 0); else localStorage.setItem("nb_usage", JSON.stringify({ date: today, count: 0 }));
      const tg = parseInt(localStorage.getItem("nb_total") || "0"); setTotalGenerated(tg);
      const saved = JSON.parse(localStorage.getItem("nb_pro") || "null");
      if (saved && saved.email && saved.isPro) { setIsPro(true); setProEmail(saved.email); setProPlan(saved.plan || "monthly"); const h = JSON.parse(localStorage.getItem("nb_history") || "[]"); setHistory(h); }
      const bv = JSON.parse(localStorage.getItem("nb_brand") || "null");
      if (bv) { setBrandName(bv.name || ""); setBrandSignoff(bv.signoff || ""); setBizType(bv.type || ""); }
      const ex = localStorage.getItem("nb_example");
      if (ex) { const e = JSON.parse(ex); setReview(e.text || ""); setStars(e.stars || 0); setBizType(e.biz || ""); setPlatform(e.platform || "Google"); localStorage.removeItem("nb_example"); setDemoVisible(false); }
      // If they've already used the tool, hide demo
      if (tg > 0) setDemoVisible(false);
    } catch {}
  }, []);

  // Typing animation for demo
  useEffect(() => {
    if (!demoVisible || demoComplete) return;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDemoTyped(DEMO_REPLY.slice(0, i));
      if (i >= DEMO_REPLY.length) { clearInterval(timer); setDemoComplete(true); }
    }, 12);
    return () => clearInterval(timer);
  }, [demoVisible, demoComplete]);

  const toggleDark = () => { const n = !dark; setDark(n); document.documentElement.setAttribute("data-theme", n ? "dark" : ""); localStorage.setItem("nb_theme", n ? "dark" : "light"); };
  const canGen = isPro || used < FREE_LIMIT;

  const scrollToForm = () => { setDemoVisible(false); formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  const verifyPro = async () => {
    const email = verifyInput.trim().toLowerCase();
    if (!email || !email.includes("@")) { setProError("Enter a valid email."); return; }
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
  const saveBrand = () => { try { localStorage.setItem("nb_brand", JSON.stringify({ name: brandName, signoff: brandSignoff, type: bizType })); } catch {} setShowSettings(false); };

  const generate = async () => {
    if (!review.trim() || stars === 0) return;
    if (!canGen) { setShowPricing(true); return; }
    setLoading(true); setResponse(""); setDemoVisible(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review, stars, platform, bizType, bizName: brandName, ownerName: brandSignoff, tone: TONES.find(t => t.key === tone)?.label || tone, language: LANG_API[respLang] || "English", proEmail: isPro ? proEmail : null }),
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
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      {/* NAV */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <a href="/" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--terra)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 14, color: "#fff" }}>N</span></div>
            </a>
            <div style={{ height: 20, width: 1, background: "var(--border)" }} />
            {["write","history"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: "4px 12px", borderRadius: 6, background: tab === t ? "var(--inputBg)" : "transparent", border: "none", fontSize: 12, fontWeight: tab === t ? 600 : 400, color: tab === t ? "var(--text)" : "var(--light)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize" }}>{t === "write" ? "Write" : isPro ? `History (${history.length})` : "History"}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <button onClick={toggleDark} style={{ width: 30, height: 30, borderRadius: 6, background: "var(--inputBg)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 10, height: 10, borderRadius: 5, background: dark ? "var(--star)" : "var(--dim)" }} /></button>
            {isPro && <button onClick={() => setShowSettings(true)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--inputBg)", fontSize: 11, color: "var(--dim)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Settings</button>}
            {isPro ? (
              <span style={{ fontSize: 10, padding: "4px 10px", background: "color-mix(in srgb, var(--sage) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--sage) 20%, transparent)", borderRadius: 6, color: "var(--sage)", fontWeight: 600 }}>PRO</span>
            ) : (
              <button onClick={() => setShowPricing(true)} style={{ padding: "5px 14px", background: "var(--terra)", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Upgrade</button>
            )}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, maxWidth: 640, width: "100%", margin: "0 auto", padding: "20px 16px" }}>

        {tab === "write" && (<>

          {/* ═══ LIVE DEMO — first thing visitors see ═══ */}
          {demoVisible && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: "var(--terra)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 3 }}>See it in action</div>
                  <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, fontWeight: 400, color: "var(--text)", margin: 0 }}>NoteBack turns this...</h1>
                </div>
              </div>

              {/* The review */}
              <div style={{ background: "var(--card)", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden", marginBottom: 8 }}>
                <div style={{ padding: "10px 16px", background: "var(--inputBg)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ display: "flex", gap: 2 }}>{[1,2,3,4,5].map(n => <span key={n} style={{ fontSize: 12, color: n <= 1 ? "var(--star)" : "var(--starOff)" }}>&#9733;</span>)}</div>
                  <span style={{ fontSize: 11, color: "var(--dim)", fontWeight: 500 }}>Google Review</span>
                </div>
                <div style={{ padding: "14px 16px" }}>
                  <p style={{ fontSize: 14, color: "var(--dim)", lineHeight: 1.6, fontStyle: "italic", margin: 0 }}>"{DEMO_REVIEW}"</p>
                </div>
              </div>

              {/* Arrow */}
              <div style={{ textAlign: "center", margin: "4px 0", color: "var(--light)", fontSize: 18 }}>&#8595;</div>

              {/* Into this */}
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 6 }}>...into this:</div>
              <div style={{ background: "var(--card)", borderRadius: 12, border: "1px solid color-mix(in srgb, var(--sage) 20%, var(--border))", overflow: "hidden", marginBottom: 16 }}>
                <div style={{ padding: "10px 16px", background: "color-mix(in srgb, var(--sage) 5%, var(--card))", borderBottom: "1px solid color-mix(in srgb, var(--sage) 15%, var(--border))", display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: demoComplete ? "var(--sage)" : "var(--terra)", transition: "background 0.3s" }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--sage)" }}>{demoComplete ? "Owner reply — ready to post" : "NoteBack is writing..."}</span>
                </div>
                <div style={{ padding: "16px 18px", minHeight: 80 }}>
                  <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--text)", margin: 0 }}>{demoTyped}<span style={{ display: demoComplete ? "none" : "inline", animation: "pulse 1s infinite", color: "var(--terra)" }}>|</span></p>
                </div>
              </div>

              {/* CTA */}
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={scrollToForm} style={{ flex: 1, padding: "14px", borderRadius: 10, background: "var(--terra)", border: "none", fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Try with your own review</button>
              </div>
              <style>{`@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
            </div>
          )}

          {/* ═══ THE FORM ═══ */}
          <div ref={formRef}>
            {!demoVisible && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, fontWeight: 400, color: "var(--text)", margin: 0 }}>Write a reply</h1>
                {!isPro && <span style={{ fontSize: 11, color: canGen ? "var(--sage)" : "var(--terra)", fontWeight: 600 }}>{canGen ? "1 free reply" : "Free reply used"}</span>}
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <textarea value={review} onChange={e => setReview(e.target.value)} placeholder="Paste the customer review here..." rows={4} style={{ width: "100%", padding: "16px 18px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", fontSize: 16, color: "var(--text)", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box", lineHeight: 1.6, resize: "vertical", transition: "border-color 0.15s" }} onFocus={e => e.target.style.borderColor = "var(--terra)"} onBlur={e => e.target.style.borderColor = "var(--border)"} />
            </div>

            <div style={{ background: "var(--card)", borderRadius: 12, border: "1px solid var(--border)", padding: 16, marginBottom: 14 }}>
              <div style={{ display: "flex", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: "var(--light)", marginBottom: 5, letterSpacing: "0.5px" }}>RATING</div>
                  <div style={{ display: "flex", gap: 2 }}>{[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setStars(n)} style={{ width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", border: n <= stars ? "2px solid var(--star)" : "1px solid var(--border)", background: n <= stars ? "color-mix(in srgb, var(--star) 10%, var(--card))" : "var(--inputBg)", cursor: "pointer", transition: "all 0.1s" }}><span style={{ fontSize: 16, color: n <= stars ? "var(--star)" : "var(--starOff)" }}>&#9733;</span></button>
                  ))}</div>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: "var(--light)", marginBottom: 5, letterSpacing: "0.5px" }}>PLATFORM</div>
                  <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>{PLATFORMS.map(p => (
                    <button key={p} onClick={() => setPlatform(p)} style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${platform === p ? "color-mix(in srgb, var(--terra) 40%, transparent)" : "var(--border)"}`, background: platform === p ? "color-mix(in srgb, var(--terra) 8%, transparent)" : "var(--inputBg)", fontSize: 12, fontWeight: platform === p ? 600 : 400, color: platform === p ? "var(--terra)" : "var(--dim)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.1s" }}>{p}</button>
                  ))}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 130px" }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: "var(--light)", marginBottom: 4, letterSpacing: "0.5px" }}>BUSINESS TYPE</div>
                  <select value={bizType} onChange={e => setBizType(e.target.value)} style={{ ...inp, padding: "8px 10px", cursor: "pointer", fontSize: 13 }}><option value="">Select...</option>{BIZ_TYPES.map(b => <option key={b}>{b}</option>)}</select>
                </div>
                <div style={{ flex: "1 1 130px" }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: "var(--light)", marginBottom: 4, letterSpacing: "0.5px" }}>LANGUAGE {!isPro && <span style={{ color: "var(--terra)", fontSize: 9, fontWeight: 600 }}>PRO</span>}</div>
                  {isPro ? (
                    <select value={respLang} onChange={e => setRespLang(e.target.value)} style={{ ...inp, padding: "8px 10px", cursor: "pointer", fontSize: 13 }}>{LANG_CODES.map(c => <option key={c} value={c}>{LANG_LABELS[c]}</option>)}</select>
                  ) : (
                    <button onClick={() => setShowPricing(true)} style={{ ...inp, padding: "8px 10px", cursor: "pointer", textAlign: "left", color: "var(--light)", fontSize: 13 }}>English</button>
                  )}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 500, color: "var(--light)", marginBottom: 6, letterSpacing: "0.5px" }}>TONE</div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>{TONES.filter(t => t.free).map(t => (
                  <button key={t.key} onClick={() => setTone(t.key)} style={{ padding: "6px 14px", borderRadius: 7, border: `1.5px solid ${tone === t.key ? "var(--terra)" : "var(--border)"}`, background: tone === t.key ? "color-mix(in srgb, var(--terra) 10%, var(--card))" : "var(--inputBg)", fontSize: 12, fontWeight: tone === t.key ? 600 : 400, color: tone === t.key ? "var(--terra)" : "var(--dim)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.12s" }}>{t.label}</button>
                ))}</div>
                {!isPro && <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{TONES.filter(t => !t.free).map(t => (
                  <button key={t.key} onClick={() => setShowPricing(true)} style={{ padding: "6px 12px", borderRadius: 7, border: "1px dashed color-mix(in srgb, var(--terra) 30%, var(--border))", background: "color-mix(in srgb, var(--terra) 3%, var(--inputBg))", fontSize: 12, fontWeight: 400, color: "var(--light)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 5 }}>{t.label}<span style={{ fontSize: 8, fontWeight: 700, color: "var(--terra)", padding: "1px 5px", background: "color-mix(in srgb, var(--terra) 8%, transparent)", borderRadius: 3, letterSpacing: "0.5px" }}>PRO</span></button>
                ))}</div>}
                {isPro && <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{TONES.filter(t => !t.free).map(t => (
                  <button key={t.key} onClick={() => setTone(t.key)} style={{ padding: "6px 14px", borderRadius: 7, border: `1.5px solid ${tone === t.key ? "var(--terra)" : "var(--border)"}`, background: tone === t.key ? "color-mix(in srgb, var(--terra) 10%, var(--card))" : "var(--inputBg)", fontSize: 12, fontWeight: tone === t.key ? 600 : 400, color: tone === t.key ? "var(--terra)" : "var(--dim)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.12s" }}>{t.label}</button>
                ))}</div>}
              </div>
            </div>

            <button onClick={generate} disabled={!review.trim() || stars === 0 || loading} style={{ width: "100%", padding: "16px", borderRadius: 12, background: (!review.trim() || stars === 0) ? "var(--border)" : loading ? "var(--dim)" : "var(--terra)", border: "none", fontSize: 16, fontWeight: 700, cursor: (!review.trim() || stars === 0 || loading) ? "default" : "pointer", color: (!review.trim() || stars === 0) ? "var(--light)" : "#fff", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s", marginBottom: 14 }}>
              {loading ? "Writing your reply..." : !canGen ? "Upgrade to Pro for unlimited replies" : "Write My Reply"}
            </button>

            {/* Response */}
            {response && (
              <div style={{ background: "var(--card)", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden", marginBottom: 12 }}>
                <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "color-mix(in srgb, var(--sage) 4%, var(--card))" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--sage)" }}>Your reply for {platform}</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={generate} style={{ padding: "4px 10px", borderRadius: 5, background: "var(--card)", border: "1px solid var(--border)", fontSize: 11, color: "var(--dim)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Rewrite</button>
                    <button onClick={() => { navigator.clipboard.writeText(response); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ padding: "4px 14px", borderRadius: 5, background: copied ? "var(--sage)" : "var(--text)", border: "none", fontSize: 11, fontWeight: 600, color: copied ? "#fff" : "var(--card)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "background 0.15s" }}>{copied ? "Copied" : "Copy"}</button>
                  </div>
                </div>
                <div style={{ padding: "18px 20px" }}>
                  <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--text)", margin: 0 }}>{response}</p>
                </div>
              </div>
            )}

            {/* Blurred Pro Preview */}
            {response && !isPro && (
              <div onClick={() => setShowPricing(true)} style={{ background: "var(--card)", borderRadius: 12, border: "1px dashed color-mix(in srgb, var(--terra) 30%, transparent)", overflow: "hidden", cursor: "pointer", position: "relative", marginBottom: 12 }}>
                <div style={{ padding: "10px 18px", borderBottom: "1px dashed color-mix(in srgb, var(--terra) 20%, transparent)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--terra)" }}>Pro alternative — empathetic, detailed</span>
                  <span style={{ fontSize: 9, padding: "2px 8px", background: "var(--terra)", color: "#fff", borderRadius: 4, fontWeight: 700, letterSpacing: "0.5px" }}>PRO</span>
                </div>
                <div style={{ padding: "18px 20px", filter: "blur(5px)", userSelect: "none" }}>
                  <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--dim)", margin: 0 }}>Thank you so much for taking the time to share your experience. We truly value your honest feedback and want you to know that we take every comment seriously. Your satisfaction is our top priority, and we would love the opportunity to make things right. Please don't hesitate to reach out directly so we can address your concerns personally.</p>
                </div>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: "linear-gradient(transparent, var(--card))", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 14 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--terra)", background: "var(--card)", padding: "0 8px" }}>Unlock with Pro — $19/mo</span>
                </div>
              </div>
            )}
          </div>
        </>)}

        {/* HISTORY — locked */}
        {tab === "history" && !isPro && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--card)", border: "1px solid var(--border)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--dim)" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: "var(--text)", marginBottom: 8 }}>Reply history</h2>
            <p style={{ fontSize: 14, color: "var(--dim)", maxWidth: 320, margin: "0 auto 24px", lineHeight: 1.55 }}>Pro members get every reply saved. Copy and reuse your best responses anytime.</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              <a href={STRIPE_MONTHLY} target="_blank" rel="noopener" style={{ padding: "11px 28px", borderRadius: 10, background: "var(--terra)", fontSize: 14, fontWeight: 600, color: "#fff", textDecoration: "none" }}>Go Pro — $19/mo</a>
              <button onClick={() => setShowVerify(true)} style={{ padding: "11px 20px", borderRadius: 10, background: "var(--card)", border: "1px solid var(--border)", fontSize: 14, color: "var(--dim)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Already Pro? Verify</button>
            </div>
          </div>
        )}

        {/* HISTORY — pro */}
        {tab === "history" && isPro && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, fontWeight: 400, color: "var(--text)" }}>Reply history</h2>
              {history.length > 0 && <button onClick={clearHist} style={{ padding: "4px 10px", background: "none", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11, color: "var(--dim)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Clear all</button>}
            </div>
            {history.length === 0 ? (
              <div style={{ textAlign: "center", padding: 48, background: "var(--card)", borderRadius: 12, border: "1px solid var(--border)" }}>
                <p style={{ color: "var(--dim)", fontSize: 14 }}>Replies appear here as you write them.</p>
                <button onClick={() => setTab("write")} style={{ marginTop: 12, padding: "10px 24px", background: "var(--terra)", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Write a reply</button>
              </div>
            ) : history.map(h => (
              <div key={h.id} style={{ background: "var(--card)", borderRadius: 10, border: "1px solid var(--border)", marginBottom: 8, overflow: "hidden" }}>
                <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--inputBg)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ display: "flex", gap: 1 }}>{[1,2,3,4,5].map(n => <span key={n} style={{ fontSize: 10, color: n <= h.stars ? "var(--star)" : "var(--starOff)" }}>&#9733;</span>)}</div>
                    <span style={{ fontSize: 10, color: "var(--dim)", fontWeight: 500 }}>{h.platform}</span>
                    <span style={{ fontSize: 9, color: "var(--light)" }}>{h.time}</span>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={() => navigator.clipboard.writeText(h.response)} style={{ padding: "2px 8px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 4, fontSize: 10, color: "var(--dim)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Copy</button>
                    <button onClick={() => deleteHist(h.id)} style={{ background: "none", border: "none", fontSize: 12, color: "var(--light)", cursor: "pointer" }}>&#215;</button>
                  </div>
                </div>
                <div style={{ padding: "10px 14px", fontSize: 11, color: "var(--dim)", fontStyle: "italic", borderBottom: "1px solid var(--border)" }}>"{h.review}{h.review.length >= 200 ? "..." : ""}"</div>
                <div style={{ padding: "12px 14px", fontSize: 13, color: "var(--text)", lineHeight: 1.6 }}>{h.response}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
          <span style={{ fontSize: 10, color: "var(--light)" }}>NoteBack 2026</span>
          <div style={{ display: "flex", gap: 12 }}>
            <a href="/" style={{ fontSize: 10, color: "var(--light)", textDecoration: "none" }}>Home</a>
            <a href="mailto:support@noteback.co" style={{ fontSize: 10, color: "var(--light)", textDecoration: "none" }}>Support</a>
            <a href="/privacy" style={{ fontSize: 10, color: "var(--light)", textDecoration: "none" }}>Privacy</a>
            <a href={STRIPE_PORTAL} target="_blank" rel="noopener" style={{ fontSize: 10, color: "var(--light)", textDecoration: "none" }}>Billing</a>
            {!isPro && <button onClick={() => setShowVerify(true)} style={{ background: "none", border: "none", fontSize: 10, color: "var(--light)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Verify Pro</button>}
            {isPro && <button onClick={logoutPro} style={{ background: "none", border: "none", fontSize: 10, color: "var(--light)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Logout</button>}
          </div>
        </div>
      </footer>

      {/* SETTINGS */}
      {showSettings && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(28,25,23,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 16 }} onClick={() => setShowSettings(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "var(--card)", borderRadius: 14, padding: 24, maxWidth: 400, width: "100%", border: "1px solid var(--border)" }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, fontWeight: 400, color: "var(--text)", marginBottom: 4 }}>Brand Voice</h2>
            <p style={{ fontSize: 13, color: "var(--dim)", marginBottom: 16 }}>Included in every reply you generate.</p>
            <div style={{ marginBottom: 10 }}><div style={{ fontSize: 11, fontWeight: 500, color: "var(--light)", marginBottom: 4 }}>BUSINESS NAME</div><input value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="e.g., ProFlow Plumbing" style={inp} /></div>
            <div style={{ marginBottom: 10 }}><div style={{ fontSize: 11, fontWeight: 500, color: "var(--light)", marginBottom: 4 }}>BUSINESS TYPE</div><select value={bizType} onChange={e => setBizType(e.target.value)} style={{ ...inp, cursor: "pointer" }}><option value="">Select...</option>{BIZ_TYPES.map(b => <option key={b}>{b}</option>)}</select></div>
            <div style={{ marginBottom: 16 }}><div style={{ fontSize: 11, fontWeight: 500, color: "var(--light)", marginBottom: 4 }}>SIGN OFF AS</div><input value={brandSignoff} onChange={e => setBrandSignoff(e.target.value)} placeholder="e.g., Mike, Owner" style={inp} /></div>
            <button onClick={saveBrand} style={{ width: "100%", padding: 12, borderRadius: 8, background: "var(--terra)", border: "none", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Save</button>
            <button onClick={() => setShowSettings(false)} style={{ display: "block", margin: "8px auto 0", background: "none", border: "none", fontSize: 12, color: "var(--dim)", cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* VERIFY */}
      {showVerify && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(28,25,23,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 16 }} onClick={() => setShowVerify(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "var(--card)", borderRadius: 14, padding: 24, maxWidth: 380, width: "100%", border: "1px solid var(--border)" }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, fontWeight: 400, color: "var(--text)", marginBottom: 8 }}>Verify subscription</h2>
            <p style={{ fontSize: 13, color: "var(--dim)", marginBottom: 14 }}>Enter the email you used on Stripe.</p>
            <input value={verifyInput} onChange={e => setVerifyInput(e.target.value)} placeholder="you@email.com" onKeyDown={e => e.key === "Enter" && verifyPro()} style={{ ...inp, marginBottom: 8 }} />
            {proError && <p style={{ fontSize: 12, color: "var(--terra)", marginBottom: 8 }}>{proError}</p>}
            <button onClick={verifyPro} disabled={proVerifying} style={{ width: "100%", padding: 12, borderRadius: 8, background: proVerifying ? "var(--dim)" : "var(--terra)", border: "none", fontSize: 14, fontWeight: 600, color: "#fff", cursor: proVerifying ? "wait" : "pointer", fontFamily: "'DM Sans', sans-serif" }}>{proVerifying ? "Checking..." : "Verify"}</button>
            <button onClick={() => setShowVerify(false)} style={{ display: "block", margin: "8px auto 0", background: "none", border: "none", fontSize: 12, color: "var(--dim)", cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* PRICING */}
      {showPricing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(28,25,23,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 16 }} onClick={() => setShowPricing(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "var(--card)", borderRadius: 14, padding: 24, maxWidth: 400, width: "100%", border: "1px solid var(--border)" }}>
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, fontWeight: 400, color: "var(--text)", marginBottom: 8 }}>Go Pro</h2>
              <p style={{ fontSize: 13, color: "var(--dim)" }}>Unlimited replies. All 6 tones. 8 languages. History. Brand voice.</p>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {[{ name: "Monthly", price: "$19", sub: "/mo", note: "Cancel anytime", href: STRIPE_MONTHLY },{ name: "Yearly", price: "$149", sub: "/yr", note: "Save 35%", pop: true, href: STRIPE_YEARLY }].map(p => (
                <a key={p.name} href={p.href} target="_blank" rel="noopener" style={{ flex: 1, padding: 16, borderRadius: 12, textAlign: "center", background: "var(--card)", border: `2px solid ${p.pop ? "var(--terra)" : "var(--border)"}`, position: "relative", textDecoration: "none" }}>
                  {p.pop && <span style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)", background: "var(--terra)", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 10px", borderRadius: 99 }}>BEST VALUE</span>}
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--dim)", marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 30, color: "var(--text)" }}>{p.price}<span style={{ fontSize: 13, color: "var(--dim)", fontFamily: "'DM Sans', sans-serif" }}>{p.sub}</span></div>
                  <div style={{ fontSize: 10, color: "var(--terra)", marginTop: 4 }}>{p.note}</div>
                </a>
              ))}
            </div>
            <p style={{ textAlign: "center", fontSize: 10, color: "var(--light)", marginBottom: 10 }}>Secure checkout via Stripe.</p>
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
