import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const navItems = ['Dashboard', 'Goals', 'Investments', 'AI Advisor', 'Credit', 'Settings', 'Help'];

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

function TopNav({ active, onNavigate }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => onNavigate('credit')}>FinanceHub</button>
      <nav className="nav-links" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive = active === item || (active === 'Credit & Debt' && item === 'Credit');
          return (
            <button
              key={item}
              className={isActive ? 'nav-link active' : 'nav-link'}
              onClick={() => item === 'Settings' ? onNavigate('settings') : onNavigate('credit')}
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

function App() {
  const initialPage = useMemo(() => window.location.hash === '#settings' ? 'settings' : 'credit', []);
  const [page, setPage] = useState(initialPage);
  const navigate = (next) => {
    setPage(next);
    window.location.hash = next === 'settings' ? 'settings' : 'credit';
  };

  return page === 'settings' ? <SettingsPage onNavigate={navigate} /> : <CreditPage onNavigate={navigate} />;
}

createRoot(document.getElementById('root')).render(<App />);
