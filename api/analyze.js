// api/analyze.js — Vercel serverless function
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  let targetUrl = url.trim();
  if (!targetUrl.startsWith('http')) targetUrl = 'https://' + targetUrl;

  try {
    const siteContent = await crawlSite(targetUrl);
    const assets = await generateAgentAssets(targetUrl, siteContent);
    return res.status(200).json({ success: true, assets });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Analysis failed' });
  }
}

async function crawlSite(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AgentReady-Crawler/1.0 (agent-readability analysis)',
        'Accept': 'text/html,application/xhtml+xml'
      },
      signal: AbortSignal.timeout(10000)
    });

    const html = await response.text();
    const cleaned = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 6000);

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);

    return {
      url,
      title: titleMatch ? titleMatch[1].trim() : url,
      description: descMatch ? descMatch[1].trim() : '',
      bodyText: cleaned
    };
  } catch (e) {
    return { url, title: url, description: '', bodyText: 'Could not fetch site content.' };
  }
}

async function generateAgentAssets(url, siteContent) {
  const prompt = `You are an expert in AI agent infrastructure. Analyze this business website and generate agent-ready assets.

WEBSITE DATA:
URL: ${url}
Title: ${siteContent.title}
Description: ${siteContent.description}
Content: ${siteContent.bodyText}

Respond with ONLY a valid JSON object, no markdown, no explanation, no code fences. Just raw JSON:
{
  "businessName": "business name here",
  "businessSummary": "2-3 sentence summary",
  "agentsPage": "markdown content for /agents page",
  "jsonLdSchema": "complete JSON-LD script tag as a string",
  "capabilityManifest": "JSON manifest as a string",
  "mcpServerConfig": "MCP config JSON as a string",
  "robotsTxtAdditions": "robots.txt lines to add",
  "readabilityScore": {
    "score": 25,
    "grade": "D",
    "issues": ["issue 1", "issue 2"],
    "improvements": ["improvement 1", "improvement 2"]
  }
}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.content || !data.content[0]) {
    throw new Error('No response from AI');
  }

  let text = data.content[0].text.trim();
  
  // Remove any markdown fences
  text = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
  
  // Find the JSON object
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  
  if (start === -1 || end === -1) {
    throw new Error('Failed to parse generated assets. Please try again.');
  }
  
  text = text.slice(start, end + 1);

  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error('Failed to parse generated assets. Please try again.');
  }
}
