export default function Privacy() {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 80px" }}>
      <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 32 }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--terra, #C4652A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>N</div>
        <span style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 700, color: "var(--text, #2C2418)" }}>NoteBack</span>
      </a>

      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 900, marginBottom: 8, color: "var(--text, #2C2418)" }}>Privacy Policy</h1>
      <p style={{ fontSize: 13, color: "var(--dim, #8C7B6B)", marginBottom: 32 }}>Last updated: March 15, 2026</p>

      {[
        { t: "What we collect", b: "When you use NoteBack, we process the review text you paste into the tool to generate a response. We do not store your reviews or generated responses on our servers. Usage counts (free tier limits) are tracked by IP address and reset daily." },
        { t: "Local storage", b: "NoteBack stores the following data locally in your browser (not on our servers): your dark/light mode preference, site language preference, daily usage count, and response history (if you choose to keep it). You can clear this data at any time by clearing your browser data or using the 'Clear All' button in the history panel." },
        { t: "Payment information", b: "Payments are processed by Stripe. We never see, store, or have access to your credit card number. Stripe handles all payment data securely. See Stripe's privacy policy at stripe.com/privacy for details." },
        { t: "AI processing", b: "Review text you submit is sent to Anthropic's Claude API to generate responses. This data is processed in real-time and not stored by NoteBack. Anthropic's data usage policies apply to the AI processing step. See anthropic.com/privacy for details." },
        { t: "Cookies", b: "NoteBack does not use tracking cookies. We do not use Google Analytics or any third-party tracking scripts. The only data stored is in your browser's localStorage as described above." },
        { t: "Third-party services", b: "NoteBack uses the following third-party services: Vercel (hosting), Stripe (payments), and Anthropic Claude API (AI processing). Each has their own privacy policy governing their handling of data." },
        { t: "Data deletion", b: "Since we don't store your data on our servers, there's nothing to delete. To remove locally stored data, clear your browser's localStorage. To cancel your subscription and remove payment data, use the Manage Subscription link or contact support@noteback.co." },
        { t: "Contact", b: "For privacy questions, email support@noteback.co." },
      ].map((s, i) => (
        <div key={i} style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700, marginBottom: 6, color: "var(--text, #2C2418)" }}>{s.t}</h2>
          <p style={{ fontSize: 14, color: "var(--dim, #8C7B6B)", lineHeight: 1.7 }}>{s.b}</p>
        </div>
      ))}

      <div style={{ borderTop: "1px solid var(--border, #E8DDD0)", paddingTop: 24, marginTop: 32 }}>
        <a href="/" style={{ fontSize: 13, color: "var(--terra, #C4652A)", textDecoration: "none", fontWeight: 600 }}>← Back to NoteBack</a>
      </div>
    </div>
  );
}
