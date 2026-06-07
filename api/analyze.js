// api/analyze.js — Vercel serverless function
// Crawls a URL and uses Claude to generate agent-ready assets

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Normalize URL
  let targetUrl = url.trim();
  if (!targetUrl.startsWith('http')) targetUrl = 'https://' + targetUrl;

  try {
    // Step 1: Crawl the website
    const siteContent = await crawlSite(targetUrl);

    // Step 2: Generate all agent-ready assets via Claude
    const assets = await generateAgentAssets(targetUrl, siteContent);

    return res.status(200).json({ success: true, assets });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Analysis failed' });
  }
}

async function crawlSite(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'AgentReady-Crawler/1.0 (https://agentready.ai; agent-readability analysis)',
      'Accept': 'text/html,application/xhtml+xml'
    },
    signal: AbortSignal.timeout(10000)
  });

  if (!response.ok) throw new Error(`Could not fetch site: ${response.status}`);

  const html = await response.text();

  // Extract meaningful text content from HTML
  const cleaned = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 8000); // keep within context limits

  // Extract title and meta description
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);

  return {
    url,
    title: titleMatch ? titleMatch[1].trim() : '',
    description: descMatch ? descMatch[1].trim() : '',
    bodyText: cleaned
  };
}

async function generateAgentAssets(url, siteContent) {
  const domain = new URL(url).hostname;

  const prompt = `You are an expert in AI agent infrastructure. Analyze this business website and generate all assets needed to make it readable and transactable by AI agents.

WEBSITE DATA:
URL: ${url}
Title: ${siteContent.title}
Meta Description: ${siteContent.description}
Page Content: ${siteContent.bodyText}

Generate a JSON response with exactly this structure (no markdown, pure JSON):
{
  "businessName": "extracted business name",
  "businessSummary": "2-3 sentence summary of what this business does",
  "agentsPage": "full markdown content for a /agents page that AI agents will read to understand this business. Include: what the business does, what services/products are available, how to transact, contact methods, and a permissions section stating what agents are allowed to do",
  "jsonLdSchema": "complete JSON-LD schema markup as a string (the full <script type='application/ld+json'>...</script> block) including Organization, LocalBusiness or appropriate type, with all extracted details",
  "capabilityManifest": "a JSON string representing the agent capability manifest with fields: name, description, version (1.0.0), capabilities (array of objects with name, description, action, endpoint placeholder), contact, and agentPolicy",
  "mcpServerConfig": "a JSON string representing an MCP server configuration with fields: name, version, description, tools (array of MCP tool definitions with name, description, inputSchema), and serverInfo",
  "robotsTxtAdditions": "the exact lines to add to robots.txt to allow trusted AI agent crawlers",
  "readabilityScore": {
    "score": number between 0-100,
    "grade": "A/B/C/D/F",
    "issues": ["list of current agent-readability issues found"],
    "improvements": ["list of what the generated assets will fix"]
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
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude API error: ${err}`);
  }

  const data = await response.json();
  const text = data.content[0].text.trim();

  // Strip any markdown fences if present
  const jsonText = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();

  try {
    return JSON.parse(jsonText);
  } catch (e) {
    throw new Error('Failed to parse generated assets. Please try again.');
  }
}
