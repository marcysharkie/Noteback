export const metadata = {
  title: "NoteBack — Reply to Customer Reviews with AI | For Business Owners",
  description: "NoteBack helps business owners write professional replies to their customer reviews on Google, Yelp, and Facebook. Respond to your existing reviews in seconds.",
  icons: { icon: "/favicon.ico", apple: "/favicon.svg", shortcut: "/favicon.ico" },
  openGraph: { title: "NoteBack — Help Business Owners Reply to Customer Reviews", description: "Write professional responses to your customer reviews on Google, Yelp, Facebook & more.", url: "https://noteback.co", siteName: "NoteBack", type: "website" },
  twitter: { card: "summary_large_image", title: "NoteBack — Reply to Your Customer Reviews with AI", description: "Helps business owners respond to real customer reviews professionally." },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,900&display=swap" rel="stylesheet" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18018204531"></script>
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','AW-18018204531');try{const t=localStorage.getItem('nb_theme');if(t==='dark')document.documentElement.setAttribute('data-theme','dark')}catch(e){}` }} />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          :root {
            --bg: #FAF6F1; --card: #FFFFFF; --terra: #C4652A; --terraHov: #B55A22;
            --sage: #5F8A65; --sand: #E8DDD0; --sandDk: #D4C4B0;
            --text: #1A1610; --dim: #7A6C5E; --light: #B5A494; --border: #E2D8CC;
            --star: #E8A308; --starOff: #E2D8CC; --inputBg: #F7F5F2;
            --glow: rgba(196,101,42,0.06); --cardShadow: 0 1px 3px rgba(44,36,24,0.04), 0 8px 24px rgba(44,36,24,0.06);
          }
          [data-theme="dark"] {
            --bg: #141210; --card: #1E1C18; --terra: #E8843E; --terraHov: #D47230;
            --sage: #72A878; --sand: #2E2A24; --sandDk: #3A352E;
            --text: #F0ECE6; --dim: #9E9184; --light: #5C544A; --border: #2E2A24;
            --star: #F0B020; --starOff: #2E2A24; --inputBg: #262320;
            --glow: rgba(232,132,62,0.04); --cardShadow: 0 1px 3px rgba(0,0,0,0.2), 0 8px 24px rgba(0,0,0,0.3);
          }
          body { font-family: 'Instrument Sans', sans-serif; background: var(--bg); color: var(--text); transition: background 0.4s ease, color 0.3s ease; -webkit-font-smoothing: antialiased; }
          ::selection { background: color-mix(in srgb, var(--terra) 20%, transparent); }
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
          @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
          @media (max-width: 640px) {
            .hide-mobile { display: none !important; }
            .stack-mobile { flex-direction: column !important; gap: 8px !important; }
            .stack-mobile > div { flex: 1 1 auto !important; }
          }
          a { transition: opacity 0.2s; }
          a:hover { opacity: 0.8; }
          button { transition: all 0.2s ease; }
          button:active { transform: scale(0.97); }
          input:focus, textarea:focus, select:focus { border-color: var(--terra) !important; box-shadow: 0 0 0 3px var(--glow); }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
