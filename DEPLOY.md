# AgentReady — Setup & Deployment Guide

## Local Development

1. **Install dependencies**
   ```
   npm install
   ```

2. **Set up environment variables**
   ```
   cp .env.example .env.local
   ```
   Then edit `.env.local` and add your Anthropic API key.
   Get one at: https://console.anthropic.com

3. **Run locally**
   ```
   npm run dev
   ```
   Open http://localhost:5173

   Note: The /api route needs Vercel CLI for local testing:
   ```
   npm install -g vercel
   vercel dev
   ```

---

## Deploy to Vercel (5 minutes)

1. Push this folder to a GitHub repo

2. Go to https://vercel.com and click "Add New Project"

3. Import your GitHub repo

4. In the Environment Variables section, add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your Anthropic API key

5. Click Deploy

That's it. Vercel handles the serverless API function automatically.

---

## Project Structure

```
agentready/
├── api/
│   └── analyze.js        ← Serverless function: crawls URL + calls Claude
├── src/
│   ├── App.jsx           ← Main UI component
│   ├── main.jsx          ← React entry point
│   └── index.css         ← Global styles
├── index.html            ← HTML shell
├── vite.config.js        ← Build config
├── vercel.json           ← Vercel routing config
└── package.json
```

---

## How It Works

1. User enters a URL in the frontend
2. Frontend POST to /api/analyze
3. Serverless function fetches and parses the website HTML
4. Extracted content is sent to Claude with a structured prompt
5. Claude returns all 5 agent-ready assets as JSON
6. Frontend displays them in tabs with copy/download buttons

---

## Customization Ideas

- **Add a pricing page** — gate the MCP config behind a paid tier
- **Add email capture** — "Email me the full package" before showing results
- **Industry-specific prompts** — detect automotive/insurance sites and tailor the output
- **Webhook delivery** — send the assets to a client's email automatically
- **White-label mode** — rebrand for agencies to resell

---

## Getting Your Anthropic API Key

1. Go to https://console.anthropic.com
2. Sign up or log in
3. Click "API Keys" in the left sidebar
4. Click "Create Key"
5. Copy the key and add it to your .env.local or Vercel environment variables

The app uses claude-sonnet-4 which costs roughly $0.003–0.015 per analysis depending on site size.
At $500–$1,500 per client, your API costs are negligible.
