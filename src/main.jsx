import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import TradingPage from './pages/TradingPage';
import InvestmentAdvicePage from './pages/InvestmentAdvicePage';

const navItems = ['Dashboard', 'Portfolio Performance', 'Goals', 'Investments', 'Trading', 'AI Advisor', 'Credit', 'Settings', 'Help'];


/* ---------- Icons ---------- */

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-4 2.8-6.5 7-6.5S19 16 19 20" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 15V4" />
      <path d="m8 8 4-4 4 4" />
      <path d="M5 15v4h14v-4" />
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="metric-icon-svg">
      <path d="M12 3v18" />
      <path d="M16 7c0-1.7-1.8-3-4-3s-4 1.3-4 3 1.8 3 4 3 4 1.3 4 3-1.8 3-4 3-4-1.3-4-3" />
    </svg>
  );
}

function PulseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="metric-icon-svg">
      <path d="M3 12h4l2-6 4 12 2-6h6" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="metric-icon-svg">
      <path d="M3 17 9 11l4 4 8-8" />
      <path d="M14 7h7v7" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="metric-icon-svg">
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M16 13h2" />
      <path d="M3 9h14" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="action-icon-svg">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function SwapIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="action-icon-svg">
      <path d="M7 4v16" />
      <path d="m3 8 4-4 4 4" />
      <path d="M17 20V4" />
      <path d="m21 16-4 4-4-4" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="action-icon-svg">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="action-icon-svg">
      <path d="M3 17 9 11l4 4 8-8" />
      <path d="M14 7h7v7" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="action-icon-svg">
      <path d="M7 3h8l4 4v14H7z" />
      <path d="M15 3v4h4" />
      <path d="M10 12h6" />
      <path d="M10 16h6" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="action-icon-svg">
      <path d="M5 5h14v11H9l-4 4z" />
    </svg>
  );
}

/* ---------- Top Nav ---------- */

function TopNav({ active, onNavigate }) {
    return (
        <header className="topbar">
            <button className="brand" onClick={() => onNavigate('dashboard')}>FinanceHub</button>
            <nav className="nav-links" aria-label="Main navigation">
                {navItems.map((item) => {
                    const isActive =
                        active === item ||
                        (active === 'Credit & Debt' && item === 'Credit');
                    return (
                        <button
                            key={item}
                            className={isActive ? 'nav-link active' : 'nav-link'}
                            onClick={() => {
                                if (item === 'Dashboard')              onNavigate('dashboard');
                                else if (item === 'Portfolio Performance') onNavigate('portfolio');
                                else if (item === 'Trading')           onNavigate('trading');
                                else if (item === 'AI Advisor')        onNavigate('investment-advice');
                                else if (item === 'Settings')          onNavigate('settings');
                                else if (item === 'Credit')            onNavigate('credit');
                                else onNavigate('dashboard');
                            }}
                        >
                            {item === 'Credit' && active === 'Credit & Debt' ? 'Credit & Debt' : item}
                        </button>
                    );
                })}
            </nav>
            <div className="top-actions">
                <div className="search">
                    <SearchIcon />
                    <span>Search</span>
                </div>
                <button className="avatar-button" aria-label="Profile"><UserIcon /></button>
            </div>
        </header>
    );
}

/* ---------- Dashboard ---------- */

function PortfolioCard({ label, value, detail, tone, icon }) {
  return (
    <section className="portfolio-card">
      <div className="portfolio-card-head">
        <h3>{label}</h3>
        <div className="metric-icon-chip">{icon}</div>
      </div>
      <div className="portfolio-value">{value}</div>
      <p className={tone ? `portfolio-detail ${tone}` : 'portfolio-detail'}>{detail}</p>
    </section>
  );
}

function QuickActionButton({ icon, label, sub, onClick }) {
  return (
    <button className="quick-action" onClick={onClick}>
      <div className="quick-action-icon">{icon}</div>
      <div className="quick-action-label">{label}</div>
      <div className="quick-action-sub">{sub}</div>
    </button>
  );
}

function DashboardPage({ onNavigate }) {
  // Each Quick Action is wired to a route name. The actual sub-pages
  // are not implemented yet — clicking just updates the URL hash so
  // future pages can be plugged into the router below.
  const handleAction = (route) => onNavigate(route);

  return (
    <>
      <TopNav active="Dashboard" onNavigate={onNavigate} />
      <main className="page dashboard-page">
        <section className="welcome-panel">
          <h1>Welcome back, Nishant</h1>
          <p className="welcome-sub">Here's your portfolio overview for March 8, 2026</p>

          <div className="portfolio-grid">
            <PortfolioCard
              label="Total Portfolio Value"
              value="$1,247,382"
              detail="+3.5% ↗"
              tone="positive"
              icon={<DollarIcon />}
            />
            <PortfolioCard
              label="Today's Change"
              value="+ $8,432"
              detail="+0.68% ↗ Since market open"
              tone="positive"
              icon={<PulseIcon />}
            />
            <PortfolioCard
              label="Total Return"
              value="+ $189,240"
              detail="+17.9% ↗ All time"
              tone="positive"
              icon={<TrendIcon />}
            />
            <PortfolioCard
              label="Cash Available"
              value="$52,180"
              detail="4.2% of portfolio · Ready to invest"
              icon={<WalletIcon />}
            />
          </div>
        </section>

        <section className="quick-actions-panel">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            <QuickActionButton icon={<PlusIcon />}    label="Add Funds"   sub="Deposit money"      onClick={() => handleAction('add-funds')} />
            <QuickActionButton icon={<SwapIcon />}    label="Trade"       sub="Buy or sell"        onClick={() => handleAction('trade')} />
            <QuickActionButton icon={<ClockIcon />}   label="Rebalance"   sub="Optimize portfolio" onClick={() => handleAction('rebalance')} />
            <QuickActionButton icon={<ArrowUpIcon />} label="Invest More" sub="Auto-invest"        onClick={() => handleAction('invest-more')} />
            <QuickActionButton icon={<DocIcon />}     label="Reports"     sub="View statements"    onClick={() => handleAction('reports')} />
            <QuickActionButton icon={<ChatIcon />}    label="Ask AI"      sub="Get advice"         onClick={() => handleAction('ask-ai')} />
          </div>
        </section>
      </main>
    </>
  );
}

/* ---------- Portfolio Performance Page ---------- */

function PortfolioChart() {
  // 12 monthly anchor points along x-axis (Jan -> Dec).
  // Two flat-ish lines hovering near the $1.2M mark, matching the screenshot.
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // y-axis tick labels (top to bottom) and their pixel y positions in the chart area.
  const yTicks = [
    { label: '$1200K', y: 40 },
    { label: '$1100K', y: 100 },
    { label: '$1000K', y: 160 },
    { label: '$900K',  y: 220 },
    { label: '$800K',  y: 280 },
    { label: '$700K',  y: 340 },
    { label: '$600K',  y: 400 }
  ];

  // Subtle wave for the portfolio line (blue), slightly trending up.
  const portfolioY = [78, 80, 76, 74, 72, 70, 68, 66, 64, 62, 60, 58];
  // S&P 500 line (gray, dashed) — sits a hair below portfolio.
  const benchmarkY = [82, 83, 80, 79, 77, 75, 74, 72, 70, 68, 66, 64];

  // X positions across the plot area (left padding 60, right padding 20, width 1080).
  const xs = months.map((_, i) => 60 + i * (1080 / 11));

  const portfolioPoints = xs.map((x, i) => `${x},${portfolioY[i]}`).join(' ');
  const benchmarkPoints = xs.map((x, i) => `${x},${benchmarkY[i]}`).join(' ');

  return (
    <svg className="perf-chart" viewBox="0 0 1140 470" role="img" aria-label="Portfolio performance vs S&P 500">
      {/* horizontal grid + y-axis labels */}
      <g className="perf-grid">
        {yTicks.map((t) => (
          <line key={`h-${t.y}`} x1="60" y1={t.y} x2="1140" y2={t.y} />
        ))}
      </g>
      <g className="perf-y-labels">
        {yTicks.map((t) => (
          <text key={`yl-${t.y}`} x="50" y={t.y + 4}>{t.label}</text>
        ))}
      </g>

      {/* x-axis baseline */}
      <line className="perf-axis" x1="60" y1="400" x2="1140" y2="400" />

      {/* benchmark line — gray dashed */}
      <polyline className="perf-benchmark" points={benchmarkPoints} />
      {/* portfolio line — blue solid */}
      <polyline className="perf-portfolio" points={portfolioPoints} />

      {/* x-axis month labels */}
      {months.map((m, i) => (
        <text className="perf-month" key={m} x={xs[i]} y="425">{m}</text>
      ))}
    </svg>
  );
}

function RangeTabs() {
  const ranges = ['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'];
  const active = '1Y';
  return (
    <div className="range-tabs" role="tablist" aria-label="Time range">
      {ranges.map((r) => (
        <button
          key={r}
          className={r === active ? 'range-tab active' : 'range-tab'}
          role="tab"
          aria-selected={r === active}
        >
          {r}
        </button>
      ))}
    </div>
  );
}

function PortfolioPerformancePage({ onNavigate }) {
  return (
    <>
      <TopNav active="Portfolio Performance" onNavigate={onNavigate} />
      <main className="page portfolio-page">
        <section className="panel perf-panel">
          <div className="perf-header">
            <div>
              <h2 className="perf-title">Portfolio Performance</h2>
              <p className="perf-sub">12-month performance vs S&amp;P 500 benchmark</p>
            </div>
            <RangeTabs />
          </div>

          <PortfolioChart />

          <div className="perf-legend">
            <span className="perf-legend-item">
              <span className="perf-legend-dot portfolio" />
              Your Portfolio
            </span>
            <span className="perf-legend-item">
              <span className="perf-legend-dot benchmark" />
              S&amp;P 500
            </span>
          </div>
        </section>

        <section className="panel recommendation perf-recommendation">
          <div className="recommendation-box">
            <div className="ai-badge">AI</div>
            <div>
              <h3 className="ai-title">AI Financial Advisor</h3>
              <p>Based on your portfolio performance and market conditions, I've identified 3 key recommendations for you:</p>
              <ul>
                <li>Your portfolio is well-diversified across 8 sectors</li>
                <li>Expected annual return: 8.5% – 11.2% (90% confidence)</li>
                <li>Tax-loss harvesting opportunities: $3,400 potential savings</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

/* ---------- Existing Credit Page (unchanged) ---------- */

function MetricCard({ label, value, detail, tone }) {
  return (
    <section className="metric-card">
      <h3>{label}</h3>
      <div className="metric-value">{value}</div>
      <p className={tone ? `metric-detail ${tone}` : 'metric-detail'}>{detail}</p>
    </section>
  );
}

function Tabs({ items }) {
  return (
    <div className="tabs">
      {items.map((item, index) => (
        <button className={index === 0 ? 'tab active' : 'tab'} key={item}>{item}</button>
      ))}
    </div>
  );
}

function UtilisationBar({ name, amount, limit, percent }) {
  return (
    <div className="util-row">
      <div className="util-labels">
        <span>{name}</span>
        <span>{amount} / {limit}</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function CreditLineChart() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const points = [
    [0, 175], [58, 166], [116, 156], [174, 145], [232, 134], [290, 113],
    [348, 104], [406, 94], [464, 84], [522, 73], [580, 62], [638, 49]
  ];
  const polyline = points.map(([x, y]) => `${x + 36},${y + 18}`).join(' ');

  return (
    <svg className="line-chart" viewBox="0 0 720 270" role="img" aria-label="Credit score trend">
      <g className="grid">
        {Array.from({ length: 12 }).map((_, i) => <line key={`v${i}`} x1={36 + i * 58} y1="18" x2={36 + i * 58} y2="222" />)}
        {[18, 99, 180, 222].map((y) => <line key={`h${y}`} x1="36" y1={y} x2="674" y2={y} />)}
      </g>
      <path className="axis" d="M36 18v204h638" />
      <text x="0" y="28">800</text>
      <text x="0" y="103">730</text>
      <text x="0" y="184">690</text>
      <text x="0" y="228">650</text>
      <polyline className="score-line" points={polyline} />
      {points.map(([x, y]) => <circle className="score-dot" cx={x + 36} cy={y + 18} r="6" key={`${x}-${y}`} />)}
      {months.map((month, i) => <text className="month" x={36 + i * 58} y="254" key={month}>{month}</text>)}
    </svg>
  );
}

function DonutChart() {
  return (
    <div className="donut-wrap">
      <div className="donut" aria-label="Debt breakdown donut chart" />
    </div>
  );
}

function DebtBreakdown() {
  const rows = [
    ['Credit Cards', '$12,400', 'purple'],
    ['Student Loans', '$28,900', 'blue'],
    ['Auto Loan', '$18,600', 'violet']
  ];
  return (
    <section className="panel debt-panel">
      <h2>Debt Breakdown</h2>
      <DonutChart />
      <div className="legend">
        {rows.map(([name, amount, color]) => (
          <div className="legend-row" key={name}>
            <span className={`legend-dot ${color}`} />
            <span>{name}</span>
            <strong>{amount}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function CreditPage({ onNavigate }) {
  return (
    <>
      <TopNav active="Credit & Debt" onNavigate={onNavigate} />
      <main className="page credit-page">
        <p className="breadcrumb">Home / Credit & Debt</p>
        <h1>Credit & Debt Management</h1>

        <div className="metric-grid">
          <MetricCard label="Credit Score" value="742" detail="↗ +7 pts this month" tone="positive" />
          <MetricCard label="Total Debt" value="$59,900" detail="↘ -$1,200 this month" tone="negative" />
          <MetricCard label="Credit Utilisation" value="42%" detail="$9,400 of $22,000" />
          <MetricCard label="Next Payment Due" value="Apr 5" detail="$2,850 minimum" />
        </div>

        <Tabs items={['Overview', 'My Debts', 'Credit Score', 'AI Insights']} />

        <div className="overview-grid">
          <section className="panel utilisation-panel">
            <h2>Credit Utilisation</h2>
            <UtilisationBar name="Credit Card A" amount="$2,400" limit="$10,400" percent={23} />
            <UtilisationBar name="Credit Card B" amount="$5,800" limit="$8,000" percent={72} />
            <UtilisationBar name="Credit Card C" amount="$1,200" limit="$5,000" percent={24} />
            <CreditLineChart />
          </section>
          <DebtBreakdown />
        </div>

        <section className="panel recommendation">
          <h2>AI Recommendation</h2>
          <div className="recommendation-box">
            <div className="ai-badge">AI</div>
            <div>
              <p>Based on your current debt levels and payment history, I've identified 3 key recommendations for you:</p>
              <ul>
                <li>Consider paying an extra $200/month on your highest interest credit card to save $3,400 in interest over 2 years</li>
                <li>Your credit utilization is optimal. Maintain below 30% to continue improving your score</li>
                <li>You're on track to be debt-free in 4.2 years with current payment schedule</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

/* ---------- Settings Page (unchanged) ---------- */

function ProfilePhotoCard() {
  return (
    <section className="panel settings-card photo-card">
      <h2>Profile Photo</h2>
      <div className="section-rule" />
      <div className="photo-controls">
        <div className="large-avatar"><UserIcon /></div>
        <button className="light-button"><UploadIcon />Upload</button>
        <button className="ghost-button">Remove</button>
      </div>
    </section>
  );
}

function Field({ label, value, wide }) {
  return (
    <label className={wide ? 'field wide' : 'field'}>
      <span>{label}</span>
      <input value={value} readOnly />
    </label>
  );
}

function PersonalInformationCard() {
  return (
    <section className="panel settings-card info-card">
      <h2>Personal Information</h2>
      <div className="section-rule" />
      <div className="form-grid">
        <Field label="First Name" value="John" />
        <Field label="Last Name" value="Doe" />
        <Field label="Email" value="john.doe@example.com" />
        <Field label="Phone" value="+1 (555) 123-4567" />
        <Field label="Date of Birth" value="03/31/2026" />
        <Field label="Country" value="United States" />
        <Field label="Address" value="123 Main Street, Apt 4B" wide />
        <Field label="City" value="New York" />
        <Field label="ZIP Code" value="10001" />
      </div>
      <div className="form-actions">
        <button className="cancel-button">Cancel</button>
        <button className="save-button">Save</button>
      </div>
    </section>
  );
}

function SettingsPage({ onNavigate }) {
  return (
    <>
      <TopNav active="Settings" onNavigate={onNavigate} />
      <main className="page settings-page">
        <p className="breadcrumb">Account / Settings</p>
        <h1>Profile Settings</h1>
        <Tabs items={['Personal Info', 'Security', 'Notifications', 'Preferences', 'Linked Accounts']} />
        <ProfilePhotoCard />
        <PersonalInformationCard />
      </main>
    </>
  );
}

/* ---------- Router ----------
   Quick-Action routes ('add-funds', 'trade', 'rebalance', 'invest-more',
   'reports', 'ask-ai') are valid hash targets but have no page component
   yet. The router falls through to the dashboard for unknown values.
   To wire one up later, build a component and add a case to the switch. */

const VALID_PAGES = ['dashboard', 'portfolio', 'credit', 'settings', 'trading', 'investment-advice'];

function App() {
  const initialPage = useMemo(() => {
    const hash = window.location.hash.replace('#', '');
    return VALID_PAGES.includes(hash) ? hash : 'dashboard';
  }, []);

  const [page, setPage] = useState(initialPage);

  const navigate = (next) => {
    setPage(VALID_PAGES.includes(next) ? next : 'dashboard');
    window.location.hash = next;
    window.scrollTo(0, 0);
  };

  switch (page) {
      case 'trading':           return <TradingPage onNavigate={navigate} />;
      case 'investment-advice': return <InvestmentAdvicePage onNavigate={navigate} />;
    case 'portfolio': return <PortfolioPerformancePage onNavigate={navigate} />;
    case 'credit':    return <CreditPage onNavigate={navigate} />;
    case 'settings':  return <SettingsPage onNavigate={navigate} />;
    case 'dashboard':
    default:          return <DashboardPage onNavigate={navigate} />;
  }
}

createRoot(document.getElementById('root')).render(<App />);
