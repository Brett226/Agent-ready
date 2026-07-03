import { useState } from 'react'
import { ArrowRight, Copy, Check, Download, AlertCircle, Zap, Globe, Shield, Cpu, FileCode, BarChart3, ChevronDown, ChevronUp } from 'lucide-react'

const TABS = [
  { id: 'agentsPage', label: '/agents Page', icon: Globe, description: 'Human-readable page for AI agents' },
  { id: 'jsonLdSchema', label: 'JSON-LD Schema', icon: FileCode, description: 'Structured data markup' },
  { id: 'capabilityManifest', label: 'Capability Manifest', icon: Zap, description: 'What agents can do with your business' },
  { id: 'mcpServerConfig', label: 'MCP Server', icon: Cpu, description: 'Model Context Protocol configuration' },
  { id: 'robotsTxtAdditions', label: 'robots.txt', icon: Shield, description: 'Allow trusted AI crawlers' },
]

function ScoreRing({ score, grade }) {
  const color = score >= 80 ? '#00ff88' : score >= 60 ? '#ffaa00' : '#ff4444'
  const circumference = 2 * Math.PI * 36
  const dash = (score / 100) * circumference

  return (
    <div style={{ position: 'relative', width: 100, height: 100, flexShrink: 0 }}>
      <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="50" cy="50" r="36" fill="none" stroke="#222" strokeWidth="6" />
        <circle
          cx="50" cy="50" r="36" fill="none"
          stroke={color} strokeWidth="6"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease', filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center'
      }}>
        <span style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{grade}</span>
        <span style={{ fontSize: 11, color: '#666', fontFamily: 'var(--font-mono)' }}>{score}/100</span>
      </div>
    </div>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handleCopy} style={{
      display: 'flex', alignItems: 'center', gap: 6,
      background: copied ? 'var(--accent-dim)' : 'var(--bg-elevated)',
      border: `1px solid ${copied ? 'var(--accent)' : 'var(--border-bright)'}`,
      color: copied ? 'var(--accent)' : 'var(--text-secondary)',
      padding: '6px 14px', borderRadius: 'var(--radius)',
      cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-display)',
      transition: 'all 0.2s', letterSpacing: '0.05em'
    }}>
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? 'COPIED' : 'COPY'}
    </button>
  )
}

function DownloadButton({ content, filename, label }) {
  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = filename
    a.click()
  }
  return (
    <button onClick={handleDownload} style={{
      display: 'flex', alignItems: 'center', gap: 6,
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border-bright)',
      color: 'var(--text-secondary)',
      padding: '6px 14px', borderRadius: 'var(--radius)',
      cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-display)',
      transition: 'all 0.2s', letterSpacing: '0.05em'
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-bright)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
    >
      <Download size={13} />
      {label || 'DOWNLOAD'}
    </button>
  )
}

function CollapsibleIssue({ items, label, color }) {
  const [open, setOpen] = useState(false)
  if (!items?.length) return null
  return (
    <div style={{ marginTop: 12 }}>
      <button onClick={() => setOpen(!open)} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'none', border: 'none', color: color || 'var(--text-secondary)',
        cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-display)',
        letterSpacing: '0.05em', padding: 0
      }}>
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        {label} ({items.length})
      </button>
      {open && (
        <ul style={{ marginTop: 8, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {items.map((item, i) => (
            <li key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', lineHeight: 1.6 }}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function LoadingState() {
  const steps = ['Fetching website...', 'Extracting business data...', 'Generating /agents page...', 'Building capability manifest...', 'Configuring MCP server...', 'Scoring agent-readability...']
  const [step, setStep] = useState(0)

  useState(() => {
    const interval = setInterval(() => {
      setStep(s => (s + 1) % steps.length)
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '80px 24px', gap: 32, animation: 'fadeUp 0.4s ease'
    }}>
      <div style={{ position: 'relative', width: 80, height: 80 }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '2px solid var(--accent)', opacity: 0.3,
          animation: 'pulse-ring 2s ease-out infinite'
        }} />
        <div style={{
          position: 'absolute', inset: 8, borderRadius: '50%',
          border: '1px solid var(--accent-mid)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Cpu size={24} color="var(--accent)" />
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 13,
          color: 'var(--accent)', letterSpacing: '0.1em',
          animation: 'fadeUp 0.3s ease'
        }}>
          {steps[step]}
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, fontFamily: 'var(--font-mono)' }}>
          This takes 15–30 seconds
        </p>
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: i <= step ? 'var(--accent)' : 'var(--border-bright)',
            transition: 'background 0.3s ease',
            boxShadow: i === step ? '0 0 8px var(--accent)' : 'none'
          }} />
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [activeTab, setActiveTab] = useState('agentsPage')

  const handleAnalyze = async () => {
    if (!url.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed')
      setResult(data.assets)
      setActiveTab('agentsPage')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAnalyze()
  }

  const activeTabData = TABS.find(t => t.id === activeTab)
  const activeContent = result?.[activeTab] || ''

  const handleDownloadAll = () => {
    if (!result) return
    const files = [
      { content: result.agentsPage, name: 'agents.md' },
      { content: result.jsonLdSchema, name: 'schema.jsonld' },
      { content: result.capabilityManifest, name: 'capability-manifest.json' },
      { content: result.mcpServerConfig, name: 'mcp-server-config.json' },
      { content: result.robotsTxtAdditions, name: 'robots-additions.txt' },
    ]
    files.forEach(({ content, name }) => {
      const blob = new Blob([content], { type: 'text/plain' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = name
      a.click()
    })
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      <header style={{
        borderBottom: '1px solid var(--border)',
        padding: '0 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 60, flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 4,
            background: 'var(--accent)', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <Cpu size={14} color="#000" strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em' }}>
            Fit For<span style={{ color: 'var(--accent)' }}> Agents</span>
          </span>
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11,
          color: 'var(--text-muted)', letterSpacing: '0.1em'
        }}>
          MAKE YOUR BUSINESS VISIBLE TO AI AGENTS
        </div>
      </header>

      <section style={{
        padding: result ? '40px 32px 32px' : '80px 32px 64px',
        maxWidth: 760, margin: '0 auto', width: '100%',
        transition: 'padding 0.4s ease',
        animation: 'fadeUp 0.5s ease'
      }}>
        {!result && !loading && (
          <>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 11,
              color: 'var(--accent)', letterSpacing: '0.15em',
              marginBottom: 20
            }}>
              ◆ THE AGENT-FIRST INTERNET IS HERE
            </div>
            <h1 style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 800,
              lineHeight: 1.4,
              letterSpacing: '-0.03em',
              marginBottom: 20,
              paddingBottom: 0
            }}>
              Make your website<br />
              <span style={{
                background: 'linear-gradient(135deg, var(--accent), #00ccff)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                readable by AI agents
              </span>
            </h1>
            <p style={{
              fontSize: 16, color: 'var(--text-secondary)',
              lineHeight: 1.7, maxWidth: 520, marginBottom: 40
            }}>
              AI agents are the new buyers. Enter your URL and we'll generate everything
              they need to find, understand, and transact with your business — in seconds.
            </p>
          </>
        )}

        {result && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
              ANALYZING ANOTHER SITE?
            </p>
          </div>
        )}

        <div style={{
          display: 'flex', gap: 0,
          border: '1px solid var(--border-bright)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
          background: 'var(--bg-card)',
          boxShadow: '0 0 0 1px transparent',
          transition: 'box-shadow 0.2s',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', paddingLeft: 16,
            color: 'var(--text-muted)'
          }}>
            <Globe size={16} />
          </div>
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="yourbusiness.com"
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: 'var(--text-primary)', padding: '16px 16px',
              fontSize: 15, fontFamily: 'var(--font-mono)',
              letterSpacing: '0.02em'
            }}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !url.trim()}
            style={{
              background: url.trim() && !loading ? 'var(--accent)' : 'var(--bg-elevated)',
              color: url.trim() && !loading ? '#000' : 'var(--text-muted)',
              border: 'none', padding: '0 24px',
              cursor: url.trim() && !loading ? 'pointer' : 'not-allowed',
              fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-display)',
              letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 8,
              transition: 'all 0.2s', whiteSpace: 'nowrap'
            }}
          >
            ANALYZE <ArrowRight size={14} />
          </button>
        </div>

        {error && (
          <div style={{
            marginTop: 16, padding: '12px 16px', borderRadius: 'var(--radius)',
            border: '1px solid var(--error)', background: 'rgba(255,68,68,0.08)',
            display: 'flex', alignItems: 'center', gap: 10,
            animation: 'fadeUp 0.3s ease'
          }}>
            <AlertCircle size={15} color="var(--error)" />
            <span style={{ fontSize: 13, color: 'var(--error)', fontFamily: 'var(--font-mono)' }}>
              {error}
            </span>
          </div>
        )}
      </section>

      {loading && <LoadingState />}

      {result && !loading && (
        <section style={{
          flex: 1, maxWidth: 1100, margin: '0 auto', width: '100%',
          padding: '0 32px 60px', animation: 'fadeUp 0.5s ease'
        }}>
          <div style={{
            display: 'flex', gap: 24, marginBottom: 32,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: 24,
            flexWrap: 'wrap', alignItems: 'center'
          }}>
            <ScoreRing
              score={result.readabilityScore?.score || 0}
              grade={result.readabilityScore?.grade || 'F'}
            />
            <div style={{ flex: 1, minWidth: 200 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6, letterSpacing: '-0.02em' }}>
                {result.businessName}
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 12 }}>
                {result.businessSummary}
              </p>
              <CollapsibleIssue
                items={result.readabilityScore?.issues}
                label="CURRENT ISSUES"
                color="var(--warning)"
              />
              <CollapsibleIssue
                items={result.readabilityScore?.improvements}
                label="WHAT WE'RE FIXING"
                color="var(--accent)"
              />
            </div>
            <button
              onClick={handleDownloadAll}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--accent)', color: '#000',
                border: 'none', padding: '10px 20px',
                borderRadius: 'var(--radius)', cursor: 'pointer',
                fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-display)',
                letterSpacing: '0.05em', whiteSpace: 'nowrap', alignSelf: 'flex-start'
              }}
            >
              <Download size={13} />
              DOWNLOAD ALL
            </button>
          </div>

          <div style={{
            display: 'flex', gap: 2, marginBottom: 0,
            borderBottom: '1px solid var(--border)', overflowX: 'auto'
          }}>
            {TABS.map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '12px 18px', background: 'none',
                    border: 'none', borderBottom: `2px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-display)',
                    fontWeight: isActive ? 700 : 400, letterSpacing: '0.05em',
                    transition: 'all 0.2s', whiteSpace: 'nowrap',
                    marginBottom: -1
                  }}
                >
                  <Icon size={13} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderTop: 'none', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
            animation: 'fadeUp 0.2s ease'
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 20px', borderBottom: '1px solid var(--border)'
            }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-primary)' }}>
                  {activeTabData?.label}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 12, fontFamily: 'var(--font-mono)' }}>
                  {activeTabData?.description}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <CopyButton text={activeContent} />
                <DownloadButton
                  content={activeContent}
                  filename={
                    activeTab === 'agentsPage' ? 'agents.md' :
                    activeTab === 'jsonLdSchema' ? 'schema.jsonld' :
                    activeTab === 'capabilityManifest' ? 'capability-manifest.json' :
                    activeTab === 'mcpServerConfig' ? 'mcp-server-config.json' :
                    'robots-additions.txt'
                  }
                />
              </div>
            </div>

            <pre style={{
              padding: 24, margin: 0,
              fontFamily: 'var(--font-mono)', fontSize: 12,
              color: 'var(--text-secondary)', lineHeight: 1.8,
              whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              maxHeight: 480, overflowY: 'auto',
              background: 'none'
            }}>
              {activeContent}
            </pre>

            <div style={{
              padding: '16px 24px', borderTop: '1px solid var(--border)',
              background: 'var(--bg-elevated)'
            }}>
              <InstallInstructions tab={activeTab} domain={result?.businessName} />
            </div>
          </div>
        </section>
      )}

      {!result && !loading && (
        <footer style={{ marginTop: 'auto', padding: '40px 32px' }}>
          <div style={{
            maxWidth: 760, margin: '0 auto',
            display: 'flex', gap: 40, flexWrap: 'wrap'
          }}>
            {[
              { icon: Globe, label: '/agents page', desc: 'A dedicated page AI agents read to understand your business' },
              { icon: FileCode, label: 'JSON-LD Schema', desc: 'Structured data that agents parse automatically' },
              { icon: Cpu, label: 'MCP Server config', desc: 'Let agents take actions with your business' },
              { icon: BarChart3, label: 'Readability score', desc: 'See exactly how agent-visible you are today' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} style={{ flex: '1 1 160px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Icon size={13} color="var(--accent)" />
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.05em' }}>{label}</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, fontFamily: 'var(--font-mono)' }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </footer>
      )}
    </div>
  )
}

function InstallInstructions({ tab }) {
  const instructions = {
    agentsPage: 'Save as agents.md or agents.html and host at yourdomain.com/agents — then link to it from your homepage footer.',
    jsonLdSchema: 'Paste this inside a <script type="application/ld+json"> tag in your site\'s <head> section, or add via Google Tag Manager.',
    capabilityManifest: 'Host this JSON file at yourdomain.com/agent-manifest.json and link to it from your /agents page.',
    mcpServerConfig: 'Deploy this config to Vercel or Cloudflare Workers. Then list your MCP server URL in your /agents page under "Tools."',
    robotsTxtAdditions: 'Add these lines to your existing robots.txt file at yourdomain.com/robots.txt',
  }
  return (
    <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', lineHeight: 1.7 }}>
      <span style={{ color: 'var(--accent)', marginRight: 8 }}>↗ HOW TO INSTALL:</span>
      {instructions[tab]}
    </p>
  )
}
