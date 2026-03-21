export const metadata = {
  title: "NoteBack — Reply to Customer Reviews with AI | For Business Owners",
  description: "NoteBack helps business owners write professional replies to their customer reviews on Google, Yelp, and Facebook. Respond to your existing reviews in seconds.",
  icons: { icon: "/favicon.ico", apple: "/favicon.svg", shortcut: "/favicon.ico" },
  openGraph: {
    title: "NoteBack — Help Business Owners Reply to Customer Reviews",
    description: "Write professional responses to your customer reviews on Google, Yelp, Facebook & more.",
    url: "https://noteback.co",
    siteName: "NoteBack",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NoteBack — Reply to Your Customer Reviews with AI",
    description: "Helps business owners respond to real customer reviews professionally.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="A9C30z8ycfyJMUiIdFCSTFmIf1gda7mbJagULz58qgQ" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18018204531"></script>
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','AW-18018204531');try{const t=localStorage.getItem('nb_theme');if(t==='dark')document.documentElement.setAttribute('data-theme','dark')}catch(e){}` }} />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          :root {
            --bg: #FAFAF7; --card: #FFFFFF; --terra: #B85C38; --terraHov: #A04E2E;
            --sage: #5B8C5A; --sand: #EDE8E1; --sandDk: #D8D0C4;
            --text: #1C1917; --dim: #78716C; --light: #A8A29E; --border: #E7E5E4;
            --star: #D97706; --starOff: #D6D3D1; --inputBg: #F5F5F4;
            --accent: #B85C38;
          }
          [data-theme="dark"] {
            --bg: #171412; --card: #1C1917; --terra: #D4845A; --terraHov: #C0764E;
            --sage: #6B9F6A; --sand: #292524; --sandDk: #3C3632;
            --text: #FAFAF9; --dim: #A8A29E; --light: #57534E; --border: #292524;
            --star: #F59E0B; --starOff: #292524; --inputBg: #211F1C;
            --accent: #D4845A;
          }
          body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); -webkit-font-smoothing: antialiased; }
          @keyframes spin { to { transform: rotate(360deg); } }
          @media (max-width: 640px) {
            .hide-mobile { display: none !important; }
            .stack-mobile { flex-direction: column !important; gap: 8px !important; }
            .stack-mobile > div { flex: 1 1 auto !important; }
          }
          a { transition: opacity 0.15s; }
          a:hover { opacity: 0.85; }
          ::selection { background: color-mix(in srgb, var(--terra) 20%, transparent); }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
