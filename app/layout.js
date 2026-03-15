export const metadata = {
  title: "NoteBack — Reply to Customer Reviews with AI | For Business Owners",
  description: "NoteBack helps business owners write professional replies to their customer reviews on Google, Yelp, and Facebook. Respond to your existing reviews in seconds.",
  icons: { icon: "/favicon.ico", apple: "/favicon.svg", shortcut: "/favicon.ico" },
  openGraph: {
    title: "NoteBack — Help Business Owners Reply to Customer Reviews",
    description: "Write professional responses to your customer reviews on Google, Yelp, Facebook & more. A reply tool for business owners — not a review generator.",
    url: "https://noteback.co",
    siteName: "NoteBack",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NoteBack — Reply to Your Customer Reviews with AI",
    description: "Helps business owners respond to real customer reviews professionally. Not a review generator.",
  },
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
            --sage: #6B8F71; --sand: #E8DDD0; --sandDk: #D4C4B0;
            --text: #2C2418; --dim: #8C7B6B; --light: #B5A494; --border: #E8DDD0;
            --star: #F59E0B; --starOff: #E2D8CC; --inputBg: #FAFAF8;
          }
          [data-theme="dark"] {
            --bg: #1A1612; --card: #242019; --terra: #E07A3A; --terraHov: #D4702E;
            --sage: #7DA882; --sand: #3A342C; --sandDk: #4A433A;
            --text: #EDE8E2; --dim: #A89B8C; --light: #6E6358; --border: #3A342C;
            --star: #F5B731; --starOff: #3A342C; --inputBg: #2E2922;
          }
          body { font-family: 'Instrument Sans', sans-serif; background: var(--bg); color: var(--text); transition: background 0.3s, color 0.3s; }
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @media (max-width: 600px) {
            .hide-mobile { display: none !important; }
            .stack-mobile { flex-direction: column !important; }
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
