# NoteBack — They left a note. We write back.

AI-powered review response generator for local businesses. Works with Google, Yelp, Facebook, TripAdvisor & more.

## Deploy to Vercel (Step by Step)

### Prerequisites
- Node.js installed (https://nodejs.org — download the LTS version)
- Git installed (https://git-scm.com/downloads)
- GitHub account
- Vercel account (linked to GitHub)
- Anthropic API key

### Step 1: Set up the project locally

Open your terminal (Command Prompt on Windows, Terminal on Mac) and run:

```bash
cd Desktop
git clone https://github.com/YOUR_GITHUB_USERNAME/noteback.git
cd noteback
npm install
```

If you haven't created the GitHub repo yet:
1. Go to github.com → New Repository
2. Name it "noteback"
3. Make it Public
4. DON'T initialize with README (we already have one)
5. Click Create

### Step 2: Test locally

Create a file called `.env.local` in the project folder:
```
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
```

Then run:
```bash
npm run dev
```

Open http://localhost:3000 in your browser. Test the tool!

### Step 3: Push to GitHub

```bash
git add .
git commit -m "Initial NoteBack launch"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/noteback.git
git push -u origin main
```

### Step 4: Deploy on Vercel

1. Go to vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your "noteback" repo from GitHub
4. Before clicking Deploy, add your environment variable:
   - Click "Environment Variables"
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-your-actual-key-here`
5. Click "Deploy"
6. Wait 1-2 minutes — your site is live!

### Step 5: Connect your domain

1. In Vercel dashboard → Your project → Settings → Domains
2. Type: noteback.co
3. Vercel shows you DNS records to add
4. Go to your domain registrar (Porkbun, Namecheap, etc.)
5. Go to DNS settings → Add the records Vercel tells you
6. Wait 5-30 minutes
7. noteback.co is now live!

## Project Structure

```
noteback/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.js    ← Secure API route (Claude key hidden here)
│   ├── layout.js           ← SEO metadata, fonts, global styles
│   └── page.js             ← Full landing page + tool
├── .env.local              ← Your API key (never committed to git)
├── .gitignore
├── next.config.js
├── package.json
└── README.md
```
