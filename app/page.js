"use client";
import { useState, useEffect, useRef } from "react";

const FREE_LIMIT = 2;
const BIZ_TYPES = ["Restaurant","Plumber","HVAC","Electrician","Dentist","Auto Repair","Salon / Barbershop","Med Spa","Cleaning Service","Roofing","Landscaping","Veterinarian","Real Estate","Law Office","Retail","Other"];
const TONES_KEYS = ["warm","professional","casual","apologetic"];
const PLATFORMS = ["Google","Yelp","Facebook","TripAdvisor","Trustpilot","BBB","Nextdoor","Other"];
const LANG_CODES = ["en","es","fr","pt","de","zh","ja","ko"];
const LANG_FLAGS = { en:"🇺🇸", es:"🇪🇸", fr:"🇫🇷", pt:"🇧🇷", de:"🇩🇪", zh:"🇨🇳", ja:"🇯🇵", ko:"🇰🇷" };
const LANG_NAMES = { en:"English", es:"Español", fr:"Français", pt:"Português", de:"Deutsch", zh:"中文", ja:"日本語", ko:"한국어" };
const LANG_API = { en:"English", es:"Spanish", fr:"French", pt:"Portuguese", de:"German", zh:"Chinese", ja:"Japanese", ko:"Korean" };

/* ═══ TRANSLATIONS ═══ */
const T = {
  en: {
    free: "Free — no signup required", heroTitle1: "They left a note.", heroTitle2: "Write back in seconds.",
    heroSub: "Paste any review from Google, Yelp, Facebook, or TripAdvisor. Get a professional, human-sounding response instantly. Copy, paste, done.",
    heroCta: "Generate a Response — Free", heroNote: "3 free responses per day. No signup.",
    stat1: "read owner responses", stat2: "more revenue with replies", stat3: "platforms supported", stat4: "languages available",
    seeAction: "See it in action", clickTry: "Click any review to try it", genResponse: "Generate response →",
    toolTag: "Review Response Generator", toolTitle: "Paste. Generate. Copy. Done.",
    leftToday: "free responses left today", limitReached: "Daily limit reached — Go Pro for unlimited",
    starLabel: "Star rating", platformLabel: "Platform", pasteLabel: "Paste the review",
    pastePlaceholder: "Paste the customer's review here...",
    bizTypeLabel: "Business type", selectBiz: "Select...", languageLabel: "Response language", toneLabel: "Tone",
    warm: "Warm & Friendly", professional: "Professional", casual: "Casual", apologetic: "Apologetic",
    bizNameLabel: "Business name", bizNameOpt: "(optional)", bizNamePh: "e.g., ProFlow Plumbing",
    signOffLabel: "Sign off as", signOffPh: "e.g., Mike",
    generateBtn: "Generate Response", generating: "Writing your response...", leftSuffix: "left",
    readyPaste: "Ready to paste into", copy: "Copy", copied: "Copied!", regenerate: "Regenerate",
    howTag: "How it works", howTitle: "Three steps. Thirty seconds.",
    step1t: "Paste", step1d: "Copy any review from Google, Yelp, Facebook, TripAdvisor, or any platform. Select star rating and source.",
    step2t: "Generate", step2d: "Our AI writes a professional response tailored to the review, platform, and your chosen language and tone.",
    step3t: "Copy & post", step3d: "One click to copy. Paste it as your reply on whatever platform the review came from. Done.",
    priceTag: "Pricing", priceTitle: "Free forever. Pro when you're ready.",
    freePlan: "Free", freePlanPrice: "$0", forever: "Forever",
    feat1: "3 responses per day", feat2: "All 8+ platforms", feat3: "All languages", feat4: "Copy with one click",
    proMonthly: "Pro Monthly", cancelAnytime: "Cancel anytime",
    profeat1: "Unlimited responses", profeat2: "All platforms & languages", profeat3: "Response history", profeat4: "Priority AI speed", profeat5: "Email support",
    startTrial: "Start Free Trial",
    proYearly: "Pro Yearly", save35: "Save 35%",
    yfeat1: "Everything in Pro", yfeat2: "2 months free", yfeat3: "Priority support", yfeat4: "Early access to features",
    faqTitle: "Questions?",
    faq1q: "Is NoteBack really free?", faq1a: "Yes — 3 responses per day, forever. No credit card, no signup. Pro unlocks unlimited for $19/mo.",
    faq2q: "How does it work?", faq2a: "Paste any review from Google, Yelp, Facebook, TripAdvisor, or any platform. Select the star rating, platform, and your business type. Our AI generates a professional response in seconds.",
    faq3q: "Will the responses sound robotic?", faq3a: "No. NoteBack writes like a real business owner — warm, specific, and genuine. Every response references details from the actual review.",
    faq4q: "Which platforms does it support?", faq4a: "Google, Yelp, Facebook, TripAdvisor, Trustpilot, BBB, Nextdoor, and any other review platform.",
    faq5q: "Does it support other languages?", faq5a: "Yes! NoteBack generates responses in English, Spanish, French, Portuguese, German, Chinese, Japanese, and Korean.",
    faq6q: "What's included in Pro?", faq6a: "Unlimited responses, all platforms, all languages, response history, priority AI speed, and email support.",
    faq7q: "Can I cancel anytime?", faq7a: "Yes. No contracts, no cancellation fees. Cancel with one click.",
    ctaTitle: "Stop ignoring your reviews.", ctaSub: "Every unanswered review is a customer you'll never meet.", ctaBtn: "Try NoteBack Free",
    footerTag: "They left a note. We write back.", contact: "Contact", privacy: "Privacy", terms: "Terms",
    goPro: "Go Pro", goProSub: "Unlimited responses on every platform, in any language.",
    manageSub: "Manage Subscription", tryFree: "Try Free",
    history: "History", clearAll: "Clear All", back: "← Back", noHistory: "No responses yet. Generate your first one!",
    popular: "POPULAR", bestValue: "BEST VALUE", stripeNote: "Secure checkout via Stripe. Cancel anytime.", maybeLater: "Maybe later",
    responseHistory: "Response History",
  },
  es: {
    free: "Gratis — sin registro", heroTitle1: "Dejaron una nota.", heroTitle2: "Responde en segundos.",
    heroSub: "Pega cualquier reseña de Google, Yelp, Facebook o TripAdvisor. Obtén una respuesta profesional al instante. Copia, pega, listo.",
    heroCta: "Generar Respuesta — Gratis", heroNote: "3 respuestas gratis por día. Sin registro.",
    stat1: "leen las respuestas", stat2: "más ingresos con respuestas", stat3: "plataformas", stat4: "idiomas disponibles",
    seeAction: "Míralo en acción", clickTry: "Haz clic en cualquier reseña", genResponse: "Generar respuesta →",
    toolTag: "Generador de Respuestas", toolTitle: "Pega. Genera. Copia. Listo.",
    leftToday: "respuestas gratis restantes", limitReached: "Límite diario alcanzado — Hazte Pro",
    starLabel: "Calificación", platformLabel: "Plataforma", pasteLabel: "Pega la reseña",
    pastePlaceholder: "Pega la reseña del cliente aquí...",
    bizTypeLabel: "Tipo de negocio", selectBiz: "Seleccionar...", languageLabel: "Idioma de respuesta", toneLabel: "Tono",
    warm: "Cálido y Amigable", professional: "Profesional", casual: "Casual", apologetic: "Empático",
    bizNameLabel: "Nombre del negocio", bizNameOpt: "(opcional)", bizNamePh: "ej., ProFlow Plomería",
    signOffLabel: "Firmar como", signOffPh: "ej., Miguel",
    generateBtn: "Generar Respuesta", generating: "Escribiendo tu respuesta...", leftSuffix: "restantes",
    readyPaste: "Lista para pegar en", copy: "Copiar", copied: "¡Copiado!", regenerate: "Regenerar",
    howTag: "Cómo funciona", howTitle: "Tres pasos. Treinta segundos.",
    step1t: "Pega", step1d: "Copia cualquier reseña de Google, Yelp, Facebook, TripAdvisor u otra plataforma.",
    step2t: "Genera", step2d: "Nuestra IA escribe una respuesta profesional adaptada a la reseña, plataforma e idioma.",
    step3t: "Copia y publica", step3d: "Un clic para copiar. Pégala como respuesta en la plataforma. Listo.",
    priceTag: "Precios", priceTitle: "Gratis para siempre. Pro cuando quieras.",
    freePlan: "Gratis", freePlanPrice: "$0", forever: "Para siempre",
    feat1: "3 respuestas por día", feat2: "Todas las plataformas", feat3: "Todos los idiomas", feat4: "Copiar con un clic",
    proMonthly: "Pro Mensual", cancelAnytime: "Cancela cuando quieras",
    profeat1: "Respuestas ilimitadas", profeat2: "Todas las plataformas e idiomas", profeat3: "Historial", profeat4: "IA prioritaria", profeat5: "Soporte por email",
    startTrial: "Prueba Gratis", proYearly: "Pro Anual", save35: "Ahorra 35%",
    yfeat1: "Todo en Pro", yfeat2: "2 meses gratis", yfeat3: "Soporte prioritario", yfeat4: "Acceso anticipado",
    faqTitle: "¿Preguntas?",
    faq1q: "¿Es realmente gratis?", faq1a: "Sí — 3 respuestas por día, para siempre. Sin tarjeta, sin registro. Pro desbloquea ilimitadas por $19/mes.",
    faq2q: "¿Cómo funciona?", faq2a: "Pega cualquier reseña, selecciona la calificación y tipo de negocio. Nuestra IA genera una respuesta profesional en segundos.",
    faq3q: "¿Sonarán robóticas?", faq3a: "No. NoteBack escribe como un dueño real — cálido, específico y genuino.",
    faq4q: "¿Qué plataformas soporta?", faq4a: "Google, Yelp, Facebook, TripAdvisor, Trustpilot, BBB, Nextdoor y más.",
    faq5q: "¿Soporta otros idiomas?", faq5a: "¡Sí! Genera en inglés, español, francés, portugués, alemán, chino, japonés y coreano.",
    faq6q: "¿Qué incluye Pro?", faq6a: "Respuestas ilimitadas, todas las plataformas, todos los idiomas, historial, IA prioritaria y soporte.",
    faq7q: "¿Puedo cancelar?", faq7a: "Sí. Sin contratos ni cargos por cancelación.",
    ctaTitle: "Deja de ignorar tus reseñas.", ctaSub: "Cada reseña sin responder es un cliente que nunca conocerás.", ctaBtn: "Prueba NoteBack Gratis",
    footerTag: "Dejaron una nota. Nosotros respondemos.", contact: "Contacto", privacy: "Privacidad", terms: "Términos",
    goPro: "Hazte Pro", goProSub: "Respuestas ilimitadas en todas las plataformas e idiomas.",
    manageSub: "Gestionar Suscripción", tryFree: "Probar Gratis",
    history: "Historial", clearAll: "Borrar Todo", back: "← Volver", noHistory: "Sin respuestas aún. ¡Genera la primera!",
    popular: "POPULAR", bestValue: "MEJOR VALOR", stripeNote: "Pago seguro con Stripe. Cancela cuando quieras.", maybeLater: "Quizás después",
    responseHistory: "Historial de Respuestas",
  },
  fr: {
    free: "Gratuit — sans inscription", heroTitle1: "Ils ont laissé un mot.", heroTitle2: "Répondez en secondes.",
    heroSub: "Collez un avis de Google, Yelp, Facebook ou TripAdvisor. Obtenez une réponse professionnelle instantanément.",
    heroCta: "Générer une Réponse — Gratuit", heroNote: "3 réponses gratuites par jour.",
    stat1: "lisent les réponses", stat2: "plus de revenus", stat3: "plateformes", stat4: "langues disponibles",
    seeAction: "Voyez en action", clickTry: "Cliquez sur un avis", genResponse: "Générer →",
    toolTag: "Générateur de Réponses", toolTitle: "Collez. Générez. Copiez. Terminé.",
    leftToday: "réponses gratuites restantes", limitReached: "Limite atteinte — Passez Pro",
    starLabel: "Note", platformLabel: "Plateforme", pasteLabel: "Collez l'avis",
    pastePlaceholder: "Collez l'avis du client ici...",
    bizTypeLabel: "Type d'entreprise", selectBiz: "Choisir...", languageLabel: "Langue de réponse", toneLabel: "Ton",
    warm: "Chaleureux", professional: "Professionnel", casual: "Décontracté", apologetic: "Empathique",
    bizNameLabel: "Nom de l'entreprise", bizNameOpt: "(facultatif)", bizNamePh: "ex., ProFlow Plomberie",
    signOffLabel: "Signer comme", signOffPh: "ex., Michel",
    generateBtn: "Générer", generating: "Rédaction en cours...", leftSuffix: "restantes",
    readyPaste: "Prêt à coller sur", copy: "Copier", copied: "Copié !", regenerate: "Régénérer",
    howTag: "Comment ça marche", howTitle: "Trois étapes. Trente secondes.",
    step1t: "Collez", step1d: "Copiez un avis de n'importe quelle plateforme.", step2t: "Générez", step2d: "Notre IA rédige une réponse professionnelle adaptée.", step3t: "Copiez", step3d: "Un clic pour copier. Collez comme réponse. Terminé.",
    priceTag: "Tarifs", priceTitle: "Gratuit pour toujours. Pro quand vous êtes prêt.",
    freePlan: "Gratuit", freePlanPrice: "$0", forever: "Pour toujours",
    feat1: "3 réponses/jour", feat2: "Toutes les plateformes", feat3: "Toutes les langues", feat4: "Copier en un clic",
    proMonthly: "Pro Mensuel", cancelAnytime: "Annulez quand vous voulez",
    profeat1: "Réponses illimitées", profeat2: "Toutes plateformes et langues", profeat3: "Historique", profeat4: "IA prioritaire", profeat5: "Support email",
    startTrial: "Essai Gratuit", proYearly: "Pro Annuel", save35: "Économisez 35%",
    yfeat1: "Tout dans Pro", yfeat2: "2 mois gratuits", yfeat3: "Support prioritaire", yfeat4: "Accès anticipé",
    faqTitle: "Questions ?",
    faq1q: "C'est vraiment gratuit ?", faq1a: "Oui — 3 réponses/jour, pour toujours. Pro débloque l'illimité à $19/mois.",
    faq2q: "Comment ça marche ?", faq2a: "Collez un avis, sélectionnez la note et votre type d'entreprise. Notre IA génère une réponse en secondes.",
    faq3q: "Les réponses sont-elles robotiques ?", faq3a: "Non. NoteBack écrit comme un vrai propriétaire — chaleureux et authentique.",
    faq4q: "Quelles plateformes ?", faq4a: "Google, Yelp, Facebook, TripAdvisor, Trustpilot, BBB, Nextdoor et plus.",
    faq5q: "D'autres langues ?", faq5a: "Oui ! 8 langues supportées.",
    faq6q: "Que comprend Pro ?", faq6a: "Réponses illimitées, toutes plateformes, historique, IA prioritaire, support.",
    faq7q: "Puis-je annuler ?", faq7a: "Oui. Sans engagement.",
    ctaTitle: "Arrêtez d'ignorer vos avis.", ctaSub: "Chaque avis sans réponse est un client perdu.", ctaBtn: "Essayer Gratuitement",
    footerTag: "Ils ont laissé un mot. Nous répondons.", contact: "Contact", privacy: "Confidentialité", terms: "Conditions",
    goPro: "Passer Pro", goProSub: "Réponses illimitées sur toutes les plateformes.",
    manageSub: "Gérer l'Abonnement", tryFree: "Essayer",
    history: "Historique", clearAll: "Tout Effacer", back: "← Retour", noHistory: "Pas encore de réponses.",
    popular: "POPULAIRE", bestValue: "MEILLEURE OFFRE", stripeNote: "Paiement sécurisé via Stripe.", maybeLater: "Plus tard",
    responseHistory: "Historique des Réponses",
  },
  // Simplified entries for pt, de, zh, ja, ko — inherit from en with key overrides
  pt: null, de: null, zh: null, ja: null, ko: null,
};

// Fill remaining languages with key translations (hero, nav, CTA)
const PARTIAL = {
  pt: { heroTitle1: "Deixaram uma nota.", heroTitle2: "Responda em segundos.", heroCta: "Gerar Resposta — Grátis", heroNote: "3 respostas grátis por dia.", goPro: "Assinar Pro", tryFree: "Testar Grátis", manageSub: "Gerenciar Assinatura", ctaTitle: "Pare de ignorar suas avaliações.", ctaBtn: "Teste Grátis", footerTag: "Deixaram uma nota. Nós respondemos." },
  de: { heroTitle1: "Sie hinterließen eine Notiz.", heroTitle2: "Antworten Sie in Sekunden.", heroCta: "Antwort Generieren — Kostenlos", heroNote: "3 kostenlose Antworten pro Tag.", goPro: "Pro Werden", tryFree: "Kostenlos Testen", manageSub: "Abo Verwalten", ctaTitle: "Ignorieren Sie Ihre Bewertungen nicht.", ctaBtn: "Kostenlos Testen", footerTag: "Sie hinterließen eine Notiz. Wir antworten." },
  zh: { heroTitle1: "他们留下了评价。", heroTitle2: "秒速回复。", heroCta: "免费生成回复", heroNote: "每天3次免费回复。", goPro: "升级Pro", tryFree: "免费试用", manageSub: "管理订阅", ctaTitle: "别再忽视你的评价了。", ctaBtn: "免费试用", footerTag: "他们留下了评价。我们来回复。" },
  ja: { heroTitle1: "レビューが届きました。", heroTitle2: "数秒で返信。", heroCta: "無料で返信を生成", heroNote: "1日3回無料。", goPro: "Proへ", tryFree: "無料で試す", manageSub: "サブスク管理", ctaTitle: "レビューを放置しないで。", ctaBtn: "無料で試す", footerTag: "レビューが届いた。私たちが返信します。" },
  ko: { heroTitle1: "리뷰가 도착했습니다.", heroTitle2: "몇 초 만에 답변하세요.", heroCta: "무료로 답변 생성", heroNote: "하루 3회 무료.", goPro: "Pro 시작", tryFree: "무료 체험", manageSub: "구독 관리", ctaTitle: "리뷰를 무시하지 마세요.", ctaBtn: "무료 체험", footerTag: "리뷰가 왔다. 우리가 답한다." },
};
// Merge partials with English as base
LANG_CODES.forEach(c => { if (!T[c]) T[c] = { ...T.en, ...(PARTIAL[c] || {}) }; });

const EXAMPLES = [
  { stars: 1, text: "Waited over an hour for our food. When it finally came, my steak was cold and the waiter didn't seem to care. Very disappointing.", biz: "Restaurant", platform: "Google" },
  { stars: 5, text: "Mike and his team were incredible! Fixed our AC on the hottest day of the year. Showed up on time, explained everything, and the price was fair. Highly recommend!", biz: "HVAC", platform: "Yelp" },
  { stars: 3, text: "The cleaning was okay but they missed the baseboards and behind the toilet. Friendly staff though and they were on time.", biz: "Cleaning Service", platform: "Facebook" },
];

const STRIPE_MONTHLY = "https://buy.stripe.com/aFa4gy6QjcMBebZf68fUQ00";
const STRIPE_YEARLY = "https://buy.stripe.com/28E14m1vZbIxgk73nqfUQ01";
const STRIPE_PORTAL = "https://billing.stripe.com/p/login/aFa4gy6QjcMBebZf68fUQ00";

function useReveal() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}
function Reveal({ children, delay = 0 }) {
  const [ref, vis] = useReveal();
  return <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(20px)", transition: `opacity 0.6s ${delay}s ease, transform 0.6s ${delay}s ease` }}>{children}</div>;
}
function Stars({ n, size = 18, onClick }) {
  return <div style={{ display: "flex", gap: 3 }}>{[1,2,3,4,5].map(s => <span key={s} onClick={() => onClick?.(s)} style={{ fontSize: size, color: s <= n ? "var(--star)" : "var(--starOff)", cursor: onClick ? "pointer" : "default", transition: "color 0.15s", userSelect: "none" }}>★</span>)}</div>;
}
function Pill({ active, children, onClick }) {
  return <button onClick={onClick} style={{ padding: "7px 13px", borderRadius: 8, background: active ? "color-mix(in srgb, var(--terra) 12%, transparent)" : "var(--inputBg)", border: `1px solid ${active ? "color-mix(in srgb, var(--terra) 40%, transparent)" : "var(--border)"}`, fontSize: 12, fontWeight: active ? 600 : 400, color: active ? "var(--terra)" : "var(--dim)", cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif", transition: "all 0.15s" }}>{children}</button>;
}

export default function Home() {
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
  const [faqOpen, setFaqOpen] = useState(null);
  const [dark, setDark] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [siteLang, setSiteLang] = useState("en");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const toolRef = useRef(null);

  const t = T[siteLang] || T.en;

  useEffect(() => {
    try {
      const th = localStorage.getItem("nb_theme"); if (th === "dark") { setDark(true); document.documentElement.setAttribute("data-theme", "dark"); }
      const u = JSON.parse(localStorage.getItem("nb_usage") || "{}"); const today = new Date().toISOString().split("T")[0];
      if (u.date === today) setUsed(u.count || 0); else localStorage.setItem("nb_usage", JSON.stringify({ date: today, count: 0 }));
      const h = JSON.parse(localStorage.getItem("nb_history") || "[]"); setHistory(h);
      const sl = localStorage.getItem("nb_sitelang"); if (sl && LANG_CODES.includes(sl)) setSiteLang(sl);
    } catch {}
  }, []);

  const toggleDark = () => { const n = !dark; setDark(n); document.documentElement.setAttribute("data-theme", n ? "dark" : ""); localStorage.setItem("nb_theme", n ? "dark" : "light"); };
  const changeSiteLang = (c) => { setSiteLang(c); setRespLang(c); setShowLangMenu(false); try { localStorage.setItem("nb_sitelang", c); } catch {} };
  const canGen = used < FREE_LIMIT;
  const scrollToTool = () => toolRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const loadExample = (ex) => { setReview(ex.text); setStars(ex.stars); setBizType(ex.biz); setPlatform(ex.platform); setResponse(""); scrollToTool(); };

  const generate = async () => {
    if (!review.trim() || stars === 0) return;
    if (!canGen) { setShowPricing(true); return; }
    setLoading(true); setResponse("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review, stars, platform, bizType, bizName, ownerName, tone: t[tone] || tone, language: LANG_API[respLang] || "English" }),
      });
      const data = await res.json();
      if (data.error) { if (res.status === 429) { setShowPricing(true); setLoading(false); return; } setResponse(data.error); }
      else {
        setResponse(data.response);
        const nc = used + 1; setUsed(nc);
        const entry = { review: review.slice(0, 150), stars, platform, bizType, response: data.response, language: LANG_NAMES[respLang], time: new Date().toLocaleString(), id: Date.now() };
        const nh = [entry, ...history].slice(0, 50); setHistory(nh);
        try { const td = new Date().toISOString().split("T")[0]; localStorage.setItem("nb_usage", JSON.stringify({ date: td, count: nc })); localStorage.setItem("nb_history", JSON.stringify(nh)); } catch {}
      }
    } catch { setResponse("Something went wrong. Please try again."); }
    setLoading(false);
  };

  const deleteHist = (id) => { const n = history.filter(h => h.id !== id); setHistory(n); try { localStorage.setItem("nb_history", JSON.stringify(n)); } catch {} };
  const clearHist = () => { setHistory([]); try { localStorage.removeItem("nb_history"); } catch {} };

  const inp = { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--inputBg)", fontSize: 14, color: "var(--text)", fontFamily: "'Instrument Sans', sans-serif", outline: "none", boxSizing: "border-box" };

  const faqs = [1,2,3,4,5,6,7].map(n => ({ q: t[`faq${n}q`], a: t[`faq${n}a`] }));

  return (
    <>
      {/* NAV */}
      <nav style={{ padding: "11px 16px", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, background: "color-mix(in srgb, var(--bg) 92%, transparent)", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 960, margin: "0 auto", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--terra)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>N</div>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 700, color: "var(--text)" }}>NoteBack</span>
          </div>
          <div style={{ display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap" }}>
            {/* Language selector */}
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowLangMenu(!showLangMenu)} style={{ width: 36, height: 36, borderRadius: 8, background: "var(--inputBg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16 }}>
                {LANG_FLAGS[siteLang]}
              </button>
              {showLangMenu && (
                <div style={{ position: "absolute", top: 42, right: 0, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 6, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 200, minWidth: 150 }}>
                  {LANG_CODES.map(c => (
                    <button key={c} onClick={() => changeSiteLang(c)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 12px", background: siteLang === c ? "color-mix(in srgb, var(--terra) 10%, transparent)" : "transparent", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif", fontSize: 13, color: siteLang === c ? "var(--terra)" : "var(--text)", fontWeight: siteLang === c ? 600 : 400, textAlign: "left" }}>
                      <span style={{ fontSize: 16 }}>{LANG_FLAGS[c]}</span>{LANG_NAMES[c]}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={toggleDark} style={{ width: 36, height: 36, borderRadius: 8, background: "var(--inputBg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16 }}>{dark ? "☀️" : "🌙"}</button>
            {history.length > 0 && <button onClick={() => setShowHistory(!showHistory)} style={{ padding: "7px 10px", background: showHistory ? "var(--sand)" : "transparent", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11, color: "var(--dim)", cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif" }}>{t.history} ({history.length})</button>}
            <a href={STRIPE_PORTAL} target="_blank" rel="noopener" className="hide-mobile" style={{ padding: "7px 10px", background: "none", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11, color: "var(--dim)", cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif", textDecoration: "none" }}>{t.manageSub}</a>
            <button onClick={() => setShowPricing(true)} style={{ padding: "7px 12px", background: "var(--terra)", border: "none", borderRadius: 8, fontSize: 12, color: "#fff", cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif", fontWeight: 600 }}>{t.goPro}</button>
          </div>
        </div>
      </nav>

      {/* Close lang menu on click outside */}
      {showLangMenu && <div onClick={() => setShowLangMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 99 }} />}

      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* HERO */}
        {!showHistory && (
          <section style={{ padding: "clamp(44px, 8vw, 76px) 20px 44px", textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
            <Reveal><div style={{ display: "inline-block", padding: "5px 14px", background: "color-mix(in srgb, var(--terra) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--terra) 20%, transparent)", borderRadius: 99, fontSize: 12, fontWeight: 600, color: "var(--terra)", marginBottom: 18 }}>{t.free}</div></Reveal>
            <Reveal delay={0.1}><h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(30px, 5.5vw, 52px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-1.5px", marginBottom: 14, color: "var(--text)" }}>{t.heroTitle1}<br /><span style={{ color: "var(--terra)" }}>{t.heroTitle2}</span></h1></Reveal>
            <Reveal delay={0.2}><p style={{ fontSize: "clamp(14px, 2vw, 16px)", color: "var(--dim)", lineHeight: 1.65, maxWidth: 460, margin: "0 auto 26px" }}>{t.heroSub}</p></Reveal>
            <Reveal delay={0.3}>
              <a href="/dashboard" style={{ display: "inline-block", padding: "13px 30px", textDecoration: "none", background: "var(--terra)", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif" }}>{t.heroCta}</a>
              <div style={{ marginTop: 10, fontSize: 13, color: "var(--light)" }}>{t.heroNote}</div>
            </Reveal>
          </section>
        )}

        {/* SOCIAL PROOF */}
        {!showHistory && (
          <Reveal><section style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "22px 20px", background: "var(--card)" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "clamp(18px, 4vw, 44px)", flexWrap: "wrap" }}>
              {[{ n: "89%", d: t.stat1 },{ n: "35%", d: t.stat2 },{ n: "8+", d: t.stat3 },{ n: "8", d: t.stat4 }].map((s, i) => (
                <div key={i} style={{ textAlign: "center", minWidth: 75 }}>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 21, fontWeight: 700, color: "var(--terra)" }}>{s.n}</div>
                  <div style={{ fontSize: 11, color: "var(--light)", marginTop: 2 }}>{s.d}</div>
                </div>
              ))}
            </div>
          </section></Reveal>
        )}

        {/* HISTORY */}
        {showHistory && (
          <section style={{ padding: "24px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{t.responseHistory}</h2>
              <div style={{ display: "flex", gap: 6 }}>
                {history.length > 0 && <button onClick={clearHist} style={{ padding: "5px 10px", background: "none", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11, color: "var(--dim)", cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif" }}>{t.clearAll}</button>}
                <button onClick={() => setShowHistory(false)} style={{ padding: "5px 12px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11, color: "var(--dim)", cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif" }}>{t.back}</button>
              </div>
            </div>
            {history.length === 0 ? <div style={{ textAlign: "center", padding: 36, color: "var(--light)" }}>{t.noHistory}</div> : history.map(h => (
              <div key={h.id} style={{ background: "var(--card)", borderRadius: 12, border: "1px solid var(--border)", padding: "14px 16px", marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Stars n={h.stars} size={11} /><span style={{ fontSize: 10, padding: "2px 6px", background: "var(--sand)", borderRadius: 4, color: "var(--dim)", fontWeight: 600 }}>{h.platform}</span>{h.language !== "English" && <span style={{ fontSize: 10, padding: "2px 6px", background: "color-mix(in srgb, var(--sage) 15%, transparent)", borderRadius: 4, color: "var(--sage)", fontWeight: 600 }}>{h.language}</span>}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 10, color: "var(--light)" }}>{h.time}</span><button onClick={() => deleteHist(h.id)} style={{ background: "none", border: "none", fontSize: 14, color: "var(--light)", cursor: "pointer", padding: 0 }}>×</button></div>
                </div>
                <p style={{ fontSize: 11, color: "var(--dim)", lineHeight: 1.5, fontStyle: "italic", marginBottom: 6 }}>"{h.review}{h.review.length >= 150 ? "..." : ""}"</p>
                <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6, marginBottom: 6 }}>{h.response}</p>
                <button onClick={() => navigator.clipboard.writeText(h.response)} style={{ padding: "3px 10px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 10, color: "var(--dim)", cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif" }}>{t.copy}</button>
              </div>
            ))}
          </section>
        )}

        {/* EXAMPLES */}
        {!showHistory && (
          <section style={{ padding: "44px 20px 14px" }}>
            <Reveal><div style={{ textAlign: "center", marginBottom: 22 }}><div style={{ fontSize: 11, fontWeight: 600, color: "var(--terra)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 5 }}>{t.seeAction}</div><h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 700, color: "var(--text)" }}>{t.clickTry}</h2></div></Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
              {EXAMPLES.map((ex, i) => (
                <Reveal key={i} delay={i * 0.1}><button onClick={() => { try { localStorage.setItem("nb_example", JSON.stringify(ex)); } catch {} window.location.href="/dashboard"; }} style={{ width: "100%", textAlign: "left", padding: "14px 16px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}><Stars n={ex.stars} size={12} /><span style={{ fontSize: 10, padding: "2px 6px", background: "var(--sand)", borderRadius: 4, color: "var(--dim)", fontWeight: 600 }}>{ex.platform} • {ex.biz}</span></div>
                  <p style={{ fontSize: 12, color: "var(--dim)", lineHeight: 1.5, margin: 0 }}>"{ex.text}"</p>
                  <div style={{ marginTop: 7, fontSize: 11, fontWeight: 600, color: "var(--terra)" }}>{t.genResponse}</div>
                </button></Reveal>
              ))}
            </div>
          </section>
        )}

        {/* HOW IT WORKS */}
        {!showHistory && (
          <section style={{ padding: "44px 20px", maxWidth: 680, margin: "0 auto" }}>
            <Reveal><div style={{ textAlign: "center", marginBottom: 24 }}><div style={{ fontSize: 11, fontWeight: 600, color: "var(--terra)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 5 }}>{t.howTag}</div><h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 700, color: "var(--text)" }}>{t.howTitle}</h2></div></Reveal>
            {[{ n: "1", ti: t.step1t, d: t.step1d },{ n: "2", ti: t.step2t, d: t.step2d },{ n: "3", ti: t.step3t, d: t.step3d }].map((s, i) => (
              <Reveal key={i} delay={i * 0.1}><div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "16px 18px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, minWidth: 36, borderRadius: 9, background: "color-mix(in srgb, var(--terra) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--terra) 20%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 700, color: "var(--terra)" }}>{s.n}</div>
                <div><div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2, color: "var(--text)" }}>{s.ti}</div><div style={{ fontSize: 13, color: "var(--dim)", lineHeight: 1.5 }}>{s.d}</div></div>
              </div></Reveal>
            ))}
          </section>
        )}

        {/* PRICING */}
        {!showHistory && (
          <section style={{ padding: "44px 20px", maxWidth: 760, margin: "0 auto" }} id="pricing">
            <Reveal><div style={{ textAlign: "center", marginBottom: 24 }}><div style={{ fontSize: 11, fontWeight: 600, color: "var(--terra)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 5 }}>{t.priceTag}</div><h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 700, color: "var(--text)" }}>{t.priceTitle}</h2></div></Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
              <Reveal><div style={{ padding: 20, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, height: "100%" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{t.freePlan}</div><div style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 900, color: "var(--text)" }}>{t.freePlanPrice}</div><div style={{ fontSize: 12, color: "var(--dim)", marginBottom: 14 }}>{t.forever}</div>
                {[t.feat1, t.feat2, t.feat3, t.feat4].map(f => <div key={f} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--dim)", marginBottom: 6 }}><span style={{ color: "var(--sage)", fontWeight: 700 }}>✓</span>{f}</div>)}
              </div></Reveal>
              <Reveal delay={0.1}><div style={{ padding: 20, background: "var(--card)", border: "2px solid var(--terra)", borderRadius: 14, position: "relative", height: "100%" }}>
                <span style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "var(--terra)", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 10px", borderRadius: 99, letterSpacing: 1 }}>{t.popular}</span>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{t.proMonthly}</div><div style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 900, color: "var(--text)" }}>$19<span style={{ fontSize: 13, fontWeight: 400, color: "var(--dim)" }}>/mo</span></div><div style={{ fontSize: 12, color: "var(--terra)", marginBottom: 14 }}>{t.cancelAnytime}</div>
                {[t.profeat1, t.profeat2, t.profeat3, t.profeat4, t.profeat5].map(f => <div key={f} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text)", marginBottom: 6 }}><span style={{ color: "var(--sage)", fontWeight: 700 }}>✓</span>{f}</div>)}
                <a href={STRIPE_MONTHLY} target="_blank" rel="noopener" style={{ display: "block", width: "100%", marginTop: 10, padding: "10px", borderRadius: 9, background: "var(--terra)", fontSize: 13, fontWeight: 700, color: "#fff", textAlign: "center", textDecoration: "none", boxSizing: "border-box" }}>{t.startTrial}</a>
              </div></Reveal>
              <Reveal delay={0.2}><div style={{ padding: 20, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, height: "100%" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{t.proYearly}</div><div style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 900, color: "var(--text)" }}>$149<span style={{ fontSize: 13, fontWeight: 400, color: "var(--dim)" }}>/yr</span></div><div style={{ fontSize: 12, color: "var(--terra)", marginBottom: 14 }}>{t.save35}</div>
                {[t.yfeat1, t.yfeat2, t.yfeat3, t.yfeat4].map(f => <div key={f} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text)", marginBottom: 6 }}><span style={{ color: "var(--sage)", fontWeight: 700 }}>✓</span>{f}</div>)}
                <a href={STRIPE_YEARLY} target="_blank" rel="noopener" style={{ display: "block", width: "100%", marginTop: 10, padding: "10px", borderRadius: 9, background: "var(--card)", border: "1px solid var(--border)", fontSize: 13, fontWeight: 600, color: "var(--text)", textAlign: "center", textDecoration: "none", boxSizing: "border-box" }}>{t.startTrial}</a>
              </div></Reveal>
            </div>
          </section>
        )}

        {/* FAQ */}
        {!showHistory && (
          <section style={{ padding: "44px 20px 56px", maxWidth: 600, margin: "0 auto" }}>
            <Reveal><h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 700, textAlign: "center", marginBottom: 20, color: "var(--text)" }}>{t.faqTitle}</h2></Reveal>
            {faqs.map((f, i) => (
              <Reveal key={i} delay={i * 0.03}><button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{ width: "100%", textAlign: "left", padding: "12px 16px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, marginBottom: 5, cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{f.q}</span><span style={{ fontSize: 16, color: "var(--dim)", transition: "transform 0.2s", transform: faqOpen === i ? "rotate(45deg)" : "" }}>+</span></div>
                {faqOpen === i && <p style={{ fontSize: 13, color: "var(--dim)", lineHeight: 1.6, margin: "7px 0 0" }}>{f.a}</p>}
              </button></Reveal>
            ))}
          </section>
        )}

        {/* FINAL CTA */}
        {!showHistory && (
          <section style={{ padding: "44px 20px", textAlign: "center", borderTop: "1px solid var(--border)" }}>
            <Reveal>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(20px, 3.5vw, 32px)", fontWeight: 900, marginBottom: 8, color: "var(--text)" }}>{t.ctaTitle}</h2>
              <p style={{ fontSize: 14, color: "var(--dim)", maxWidth: 360, margin: "0 auto 18px", lineHeight: 1.6 }}>{t.ctaSub}</p>
              <a href="/dashboard" style={{ display: "inline-block", padding: "13px 30px", textDecoration: "none", background: "var(--terra)", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif" }}>{t.ctaBtn}</a>
            </Reveal>
          </section>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ padding: "24px 20px", borderTop: "1px solid var(--border)", background: "var(--card)", transition: "background 0.3s" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 20, height: 20, borderRadius: 5, background: "var(--terra)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff" }}>N</div>
            <span style={{ fontSize: 11, color: "var(--light)" }}>© 2026 NoteBack. {t.footerTag}</span>
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <a href="mailto:support@noteback.co" style={{ fontSize: 11, color: "var(--dim)", textDecoration: "none" }}>{t.contact}</a>
            <a href="/privacy" style={{ fontSize: 11, color: "var(--dim)", textDecoration: "none" }}>{t.privacy}</a>
            <a href="/terms" style={{ fontSize: 11, color: "var(--dim)", textDecoration: "none" }}>{t.terms}</a>
            <a href={STRIPE_PORTAL} target="_blank" rel="noopener" style={{ fontSize: 11, color: "var(--dim)", textDecoration: "none" }}>{t.manageSub}</a>
          </div>
        </div>
      </footer>

      {/* PRICING MODAL */}
      {showPricing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(44,36,24,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 16 }} onClick={() => setShowPricing(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "var(--card)", borderRadius: 18, padding: "clamp(18px, 4vw, 28px)", maxWidth: 400, width: "100%", boxShadow: "0 24px 64px rgba(44,36,24,0.25)" }}>
            <div style={{ textAlign: "center", marginBottom: 18 }}><h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 900, color: "var(--text)", marginBottom: 4 }}>{t.goPro}</h2><p style={{ fontSize: 12, color: "var(--dim)" }}>{t.goProSub}</p></div>
            <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
              {[{ name: t.proMonthly, price: "$19", sub: "/mo", note: t.cancelAnytime, href: STRIPE_MONTHLY }, { name: t.proYearly, price: "$149", sub: "/yr", note: t.save35, pop: true, href: STRIPE_YEARLY }].map(p => (
                <a key={p.name} href={p.href} target="_blank" rel="noopener" style={{ flex: 1, padding: 14, borderRadius: 12, textAlign: "center", background: p.pop ? "color-mix(in srgb, var(--terra) 6%, var(--card))" : "var(--inputBg)", border: `2px solid ${p.pop ? "var(--terra)" : "var(--border)"}`, position: "relative", textDecoration: "none", display: "block" }}>
                  {p.pop && <span style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", background: "var(--terra)", color: "#fff", fontSize: 8, fontWeight: 700, padding: "2px 8px", borderRadius: 99, letterSpacing: 1 }}>{t.bestValue}</span>}
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--dim)", marginBottom: 3 }}>{p.name}</div>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 900, color: "var(--text)" }}>{p.price}<span style={{ fontSize: 12, fontWeight: 400, color: "var(--dim)" }}>{p.sub}</span></div>
                  <div style={{ fontSize: 10, color: "var(--terra)", marginTop: 2 }}>{p.note}</div>
                </a>
              ))}
            </div>
            <p style={{ textAlign: "center", fontSize: 10, color: "var(--light)" }}>{t.stripeNote}</p>
            <button onClick={() => setShowPricing(false)} style={{ display: "block", margin: "8px auto 0", background: "none", border: "none", fontSize: 12, color: "var(--dim)", cursor: "pointer", textDecoration: "underline" }}>{t.maybeLater}</button>
          </div>
        </div>
      )}
    </>
  );
}
