import React, { useState, useEffect, useRef } from 'react';

// ── Data ──────────────────────────────────────────────────────────────
const RECOMMENDATIONS = [
    {
        title: 'Increase Bond Allocation',
        priority: 'high',
        category: 'Portfolio Rebalancing',
        desc: 'Based on current market volatility and your risk profile, consider increasing your bond allocation by 5–10% to provide more stability.',
        impact: '+2.1% stability',
        timeline: 'Next 30 days',
    },
    {
        title: 'Diversify Into International Markets',
        priority: 'medium',
        category: 'Diversification',
        desc: 'Your portfolio is heavily concentrated in US stocks. Consider allocating 15–20% to international markets for better diversification.',
        impact: '+1.2% expected return',
        timeline: 'Next 60 days',
    },
    {
        title: 'Review High-Fee Mutual Funds',
        priority: 'medium',
        category: 'Cost Optimization',
        desc: "You're paying 1.2% in fees for several mutual funds. Consider switching to low-cost index funds to reduce expenses.",
        impact: '$840/yr savings',
        timeline: 'Next 14 days',
    },
    {
        title: 'Tax-Loss Harvesting Opportunity',
        priority: 'low',
        category: 'Tax Optimization',
        desc: 'You have unrealized losses in GOOGL. Consider tax-loss harvesting to offset capital gains and reduce your tax liability.',
        impact: '$450 tax savings',
        timeline: 'Before year end',
    },
];

const ALLOCATION = [
    { label: 'Stocks',      pct: 45, color: '#3465f4' },
    { label: 'Bonds',       pct: 25, color: '#2f3848' },
    { label: 'Real Estate', pct: 15, color: '#5049e9' },
    { label: 'Cash',        pct: 10, color: '#20a7e3' },
    { label: 'Crypto',      pct:  5, color: '#ef2424' },
];

const MARKET_INSIGHTS = [
    { title: 'Fed Maintains Interest Rates',        sentiment: 'neutral',  desc: 'Rates held at 5.25–5.50%, providing stability for bond investments.',                   time: '2 hours ago' },
    { title: 'Tech Sector Earnings Beat Expectations', sentiment: 'positive', desc: 'Major tech companies reported strong Q1 earnings, driving NASDAQ up 2.3%.',          time: '5 hours ago' },
    { title: 'Rising Energy Prices',                sentiment: 'negative', desc: 'Oil prices up 8% due to supply concerns — may impact consumer spending.',               time: '1 day ago' },
];

const GOALS = [
    { name: 'Retirement Fund',     sub: 'Target: $500,000 by 2045', current: 58342,  target: 500000 },
    { name: 'Emergency Fund',      sub: 'Target: $30,000',          current: 22000,  target: 30000  },
    { name: 'House Down Payment',  sub: 'Target: $80,000 by 2027',  current: 41200,  target: 80000  },
];

const AI_RESPONSES = {
    crypto:   "Crypto carries high volatility. Given your risk score of 6.5/10, limit exposure to 5–8% max. Stick to established assets like BTC or ETH rather than speculative coins.",
    risk:     "To reduce risk: increase bond allocation by 5–10%, diversify internationally, and keep a 10–15% cash buffer. Your US tech concentration is the biggest single risk factor right now.",
    bond:     "With Fed rates at 5.25–5.50%, short-duration Treasuries and I-bonds offer attractive yields with minimal duration risk. 2–5 year notes are a solid hedge.",
    diversif: "Your portfolio is ~85% US equities. Adding 15–20% international exposure (e.g. VXUS, EFA) plus REITs or commodities would meaningfully improve your diversification score.",
    default:  "Based on your analysis, your 78% diversification score has room to improve. Rebalancing toward bonds and international equities is the highest-priority move. Want a specific allocation plan?",
};

// ── Donut Chart (SVG) ─────────────────────────────────────────────────
function AllocationDonut() {
    let offset = 0;
    const r = 54, cx = 64, cy = 64;
    const circumference = 2 * Math.PI * r;
    const slices = ALLOCATION.map(a => {
        const dash = (a.pct / 100) * circumference;
        const slice = { ...a, dash, offset };
        offset += dash;
        return slice;
    });
    return (
        <svg viewBox="0 0 128 128" className="ia-donut">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e3e6ec" strokeWidth="16" />
            {slices.map(s => (
                <circle
                    key={s.label} cx={cx} cy={cy} r={r}
                    fill="none" stroke={s.color} strokeWidth="16"
                    strokeDasharray={`${s.dash} ${circumference - s.dash}`}
                    strokeDashoffset={-(s.offset - circumference / 4)}
                    style={{ transition: 'stroke-dasharray 0.6s ease' }}
                />
            ))}
        </svg>
    );
}

// ── Main Component ────────────────────────────────────────────────────
export default function InvestmentAdvicePage({ onNavigate }) {
    const [analysisTab, setAnalysisTab] = useState('allocation');
    const [chatMessages, setChatMessages] = useState([]);
    const [aiInput, setAiInput] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, aiLoading]);

    const askAI = () => {
        const q = aiInput.trim();
        if (!q) return;
        setAiInput('');
        setChatMessages(prev => [...prev, { role: 'user', text: q }]);
        setAiLoading(true);
        setTimeout(() => {
            const lower = q.toLowerCase();
            let answer = AI_RESPONSES.default;
            if (lower.includes('crypto') || lower.includes('bitcoin')) answer = AI_RESPONSES.crypto;
            else if (lower.includes('risk') || lower.includes('safe'))  answer = AI_RESPONSES.risk;
            else if (lower.includes('bond'))                             answer = AI_RESPONSES.bond;
            else if (lower.includes('diversif') || lower.includes('international')) answer = AI_RESPONSES.diversif;
            setAiLoading(false);
            setChatMessages(prev => [...prev, { role: 'ai', text: answer }]);
        }, 1200);
    };

    const priorityColors = { high: '#ef2424', medium: '#f59e0b', low: '#3465f4' };

    return (
        <main className="page ia-page">
            {/* ── Header ── */}
            <div className="ia-page-header">
                <div>
                    <h1 className="ia-page-title">AI-Powered Investment Guidance</h1>
                    <p className="ia-page-sub">Personalized recommendations based on your portfolio and goals</p>
                </div>
            </div>

            {/* ── KPI Row ── */}
            <div className="ia-stats-grid">
                {[
                    { label: 'Risk Score',              value: '6.5/10',  detail: 'Moderate risk profile',      tone: '' },
                    { label: 'Diversification',         value: '78%',     detail: '⚠ Room for improvement',    tone: 'warn' },
                    { label: 'Active Recommendations',  value: '4',       detail: '● 1 High Priority',          tone: 'negative' },
                    { label: 'Potential Savings',       value: '$1,290',  detail: 'Annual cost reduction',       tone: 'positive' },
                ].map(s => (
                    <section key={s.label} className="ia-stat-card">
                        <div className="ia-stat-label">{s.label}</div>
                        <div className="ia-stat-value">{s.value}</div>
                        <div className={`ia-stat-detail ${s.tone}`}>{s.detail}</div>
                    </section>
                ))}
            </div>

            {/* ── Two-column layout ── */}
            <div className="ia-main-grid">

                {/* ── Left column ── */}
                <div className="ia-left-col">

                    {/* Recommendations */}
                    <div className="ia-panel">
                        <div className="ia-panel-header">
                            <span className="ia-ai-badge">◈ AI</span>
                            <span>Investment Recommendations</span>
                        </div>
                        <p className="ia-panel-sub">Personalized advice based on your portfolio analysis.</p>
                        {RECOMMENDATIONS.map((r, i) => (
                            <div key={i} className="ia-rec-item">
                                <div className="ia-rec-header">
                                    <span className="ia-rec-title">{r.title}</span>
                                    <span
                                        className="ia-rec-badge"
                                        style={{ color: priorityColors[r.priority], background: priorityColors[r.priority] + '18', borderColor: priorityColors[r.priority] + '44' }}
                                    >
                    {r.priority.charAt(0).toUpperCase() + r.priority.slice(1)}
                  </span>
                                </div>
                                <div className="ia-rec-category">{r.category}</div>
                                <p className="ia-rec-desc">{r.desc}</p>
                                <div className="ia-rec-footer">
                                    <span className="ia-rec-stat positive">▲ {r.impact}</span>
                                    <span className="ia-rec-stat warn">⏱ {r.timeline}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Portfolio Analysis */}
                    <div className="ia-panel">
                        <div className="ia-panel-header">
                            <span>Portfolio Analysis</span>
                            <span className="ia-panel-sub-right">Current vs. Recommended allocation</span>
                        </div>
                        <div className="ia-analysis-tabs">
                            <button className={`ia-analysis-tab${analysisTab === 'allocation' ? ' active' : ''}`} onClick={() => setAnalysisTab('allocation')}>Asset Allocation</button>
                            <button className={`ia-analysis-tab${analysisTab === 'risk' ? ' active' : ''}`} onClick={() => setAnalysisTab('risk')}>Risk Analysis</button>
                        </div>

                        {analysisTab === 'allocation' ? (
                            <div className="ia-allocation-layout">
                                <div className="ia-donut-wrap">
                                    <AllocationDonut />
                                </div>
                                <div className="ia-alloc-details">
                                    <div className="ia-alloc-header">Allocation Details</div>
                                    {ALLOCATION.map(a => (
                                        <div key={a.label} className="ia-alloc-item">
                                            <span className="ia-alloc-dot" style={{ background: a.color }} />
                                            <span className="ia-alloc-name">{a.label}</span>
                                            <span className="ia-alloc-pct">{a.pct}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="ia-risk-bars">
                                {[
                                    { label: 'Market Risk',       pct: 72, color: '#3465f4' },
                                    { label: 'Concentration Risk',pct: 45, color: '#f59e0b' },
                                    { label: 'Liquidity Risk',    pct: 88, color: '#20a7e3' },
                                    { label: 'Currency Risk',     pct: 31, color: '#5049e9' },
                                ].map(r => (
                                    <div key={r.label} className="ia-risk-row">
                                        <div className="ia-risk-labels">
                                            <span>{r.label}</span>
                                            <span style={{ color: r.color, fontFamily: 'monospace' }}>{r.pct}%</span>
                                        </div>
                                        <div className="progress-track">
                                            <div className="progress-fill" style={{ width: `${r.pct}%`, background: r.color }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Goals */}
                    <div className="ia-panel">
                        <div className="ia-panel-header"><span>Investment Goals Progress</span></div>
                        {GOALS.map(g => {
                            const pct = Math.round((g.current / g.target) * 100);
                            const color = pct >= 70 ? '#16a34a' : pct >= 40 ? '#f59e0b' : '#ef2424';
                            return (
                                <div key={g.name} className="ia-goal-item">
                                    <div className="ia-goal-header">
                                        <div>
                                            <div className="ia-goal-name">{g.name}</div>
                                            <div className="ia-goal-sub">{g.sub}</div>
                                        </div>
                                        <div className="ia-goal-pct" style={{ color }}>{pct}%</div>
                                    </div>
                                    <div className="progress-track">
                                        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Right column ── */}
                <div className="ia-right-col">

                    {/* Ask AI */}
                    <div className="ia-panel ia-ai-panel">
                        <div className="ia-panel-header">
                            <span className="ia-ai-badge">◈ AI</span>
                            <span>Ask AI Advisor</span>
                        </div>
                        <p className="ia-panel-sub">Get personalized investment advice</p>
                        <div className="ia-chat-area">
                            {chatMessages.length === 0 && (
                                <div className="ia-chat-placeholder">
                                    Ask me anything about investing, e.g. "Should I invest in cryptocurrencies?" or "How do I reduce risk?"
                                </div>
                            )}
                            {chatMessages.map((m, i) => (
                                <div key={i} className={`ia-chat-msg ${m.role}`}>
                                    <div className="ia-chat-sender">{m.role === 'user' ? 'You' : '◈ AI Advisor'}</div>
                                    <div className="ia-chat-bubble">{m.text}</div>
                                </div>
                            ))}
                            {aiLoading && (
                                <div className="ia-chat-msg ai">
                                    <div className="ia-chat-sender">◈ AI Advisor</div>
                                    <div className="ia-chat-bubble ia-chat-loading">Thinking…</div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                        <div className="ia-chat-input-row">
                            <input
                                type="text"
                                className="ia-chat-input"
                                placeholder="Ask AI Advisor..."
                                value={aiInput}
                                onChange={e => setAiInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && askAI()}
                            />
                            <button className="ia-btn-ask" onClick={askAI}>⚡ Get AI Advice</button>
                        </div>
                    </div>

                    {/* Market Insights */}
                    <div className="ia-panel">
                        <div className="ia-panel-header">
                            <span>Market Insights</span>
                            <span className="ia-panel-sub-right">Affecting your portfolio</span>
                        </div>
                        {MARKET_INSIGHTS.map((m, i) => {
                            const tagStyle = {
                                positive: { color: '#16a34a', background: '#dcfce7', borderColor: '#86efac' },
                                negative: { color: '#ef2424', background: '#fee2e2', borderColor: '#fca5a5' },
                                neutral:  { color: '#3465f4', background: '#dbeafe', borderColor: '#93c5fd' },
                            }[m.sentiment];
                            return (
                                <div key={i} className="ia-insight-item">
                                    <div className="ia-insight-header">
                                        <span className="ia-insight-title">{m.title}</span>
                                        <span className="ia-insight-tag" style={tagStyle}>
                      {m.sentiment.charAt(0).toUpperCase() + m.sentiment.slice(1)}
                    </span>
                                    </div>
                                    <p className="ia-insight-desc">{m.desc}</p>
                                    <div className="ia-insight-time">{m.time}</div>
                                </div>
                            );
                        })}
                        <button className="t-btn-outline full">View All Insights</button>
                    </div>

                    {/* Learn More */}
                    <div className="ia-panel">
                        <div className="ia-panel-header">
                            <span>Learn More</span>
                            <span className="ia-panel-sub-right">Educational resources</span>
                        </div>
                        <div className="ia-learn-list">
                            {[
                                ['📊', 'Investment Basics Guide'],
                                ['⚡', 'Understanding Risk Profiles'],
                                ['🌐', 'Diversification Strategies'],
                                ['💰', 'Tax-Efficient Investing'],
                            ].map(([icon, label]) => (
                                <a key={label} href="#" className="ia-learn-item">
                                    <span>{icon}</span><span>{label}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}