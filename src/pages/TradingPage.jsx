import React, { useState, useEffect, useRef } from 'react';

const WATCHLIST = [
    { ticker: 'AAPL', company: 'Apple Inc.',      price: 158.21, change: 2.34,  pct:  1.50 },
    { ticker: 'GOOGL', company: 'Alphabet Inc.',  price: 142.65, change: 0.43,  pct:  0.30 },
    { ticker: 'MSFT',  company: 'Microsoft Corp.',price: 185.44, change: 2.12,  pct:  1.16 },
    { ticker: 'TSLA',  company: 'Tesla Inc.',     price: 195.52, change: -1.88, pct: -0.95 },
    { ticker: 'AMZN',  company: 'Amazon.com Inc.',price: 178.93, change: 3.24,  pct:  1.84 },
];

const POSITIONS = [
    { ticker: 'AAPL', shares: 50,  value: 7910.50,  change:  326.00, pct:  4.30, cost: 150.33 },
    { ticker: 'MSFT', shares: 60,  value: 11566.20, change: -468.00, pct: -3.88, cost: 193.14 },
    { ticker: 'GOOGL', shares: 12, value: 1714.00,  change:   80.00, pct:  4.89, cost: 136.15 },
];

const TRADES = [
    { type: 'buy',  ticker: 'AAPL', shares: 10, value: 1582.10, time: '10:30 AM', date: 'Today' },
    { type: 'sell', ticker: 'TSLA', shares:  5, value:  976.60, time:  '9:45 AM', date: 'Today' },
    { type: 'buy',  ticker: 'MSFT', shares: 15, value: 2783.52, time:  '2:15 PM', date: 'Yesterday' },
];

function Sparkline({ color = '#3465f4' }) {
    const pts = Array.from({ length: 20 }, (_, i) => {
        const x = (i / 19) * 200;
        const y = 30 + Math.sin(i * 0.6) * 10 + (Math.random() - 0.46) * 6;
        return `${x},${y}`;
    }).join(' ');
    return (
        <svg className="t-sparkline" viewBox="0 0 200 60" preserveAspectRatio="none">
            <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        </svg>
    );
}

export default function TradingPage({ onNavigate, TopNav }) {
    const [selectedTicker, setSelectedTicker] = useState('AAPL');
    const [side, setSide]       = useState('buy');
    const [shares, setShares]   = useState(10);
    const [orderType, setOrderType] = useState('Market Order');
    const [toast, setToast]     = useState(null);
    const [watchlist, setWatchlist] = useState(WATCHLIST);
    const [timeframe, setTimeframe] = useState('1W');

    const selected = watchlist.find(s => s.ticker === selectedTicker) || watchlist[0];
    const totalCost = (selected.price * shares).toLocaleString('en-US', {
        style: 'currency', currency: 'USD',
    });

    useEffect(() => {
        const id = setInterval(() => {
            setWatchlist(prev => prev.map(s => {
                const delta = (Math.random() - 0.5) * 0.4;
                return { ...s, price: parseFloat((s.price + delta).toFixed(2)) };
            }));
        }, 3500);
        return () => clearInterval(id);
    }, []);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const placeOrder = () => {
        showToast(`✓ ${side === 'buy' ? 'Buy' : 'Sell'} order placed: ${shares} shares of ${selectedTicker} for ${totalCost}`);
    };

    const TIMEFRAMES = ['Today', '1W', '1M', '3M', '1Y'];

    return (
        <>
            <TopNav active="Trading" onNavigate={onNavigate} />
            <main className="page t-page">
                <div className="t-page-header">
                    <div>
                        <h1 className="t-page-title">Trading Dashboard</h1>
                        <p className="t-page-sub">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="t-header-actions">
                        <div className="t-search-bar">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg>
                            <input type="text" placeholder="Search stocks..." />
                        </div>
                    </div>
                </div>

                <div className="t-stats-grid">
                    {[
                        { label: 'Portfolio Value',  value: '$58,342.67', detail: '▲ +$803.12 (1.4%) today', tone: 'positive' },
                        { label: 'Buying Power',     value: '$12,450.00', detail: 'Available to trade',       tone: '' },
                        { label: "Day's Gain/Loss",  value: '−$883.20',   detail: '▼ −1.5%',                  tone: 'negative' },
                        { label: 'Total Gain/Loss',  value: '+$8,342.67', detail: '▲ +16.67% all time',       tone: 'positive' },
                    ].map(s => (
                        <section key={s.label} className={`t-stat-card${s.tone === 'positive' ? ' t-stat-highlight' : ''}`}>
                            <div className="t-stat-label">{s.label}</div>
                            <div className={`t-stat-value ${s.tone}`}>{s.value}</div>
                            <div className={`t-stat-detail ${s.tone}`}>{s.detail}</div>
                        </section>
                    ))}
                </div>

                <div className="t-main-grid">
                    <div className="t-left-col">
                        <div className="t-stock-header">
                            <div>
                                <div className="t-stock-ticker">{selected.ticker}</div>
                                <div className="t-stock-name">{selected.company} · NASDAQ</div>
                            </div>
                            <div className="t-stock-price-block">
                                <div className="t-stock-price">${selected.price.toFixed(2)}</div>
                                <div className={`t-stock-change ${selected.change >= 0 ? 'positive' : 'negative'}`}>
                                    {selected.change >= 0 ? '▲' : '▼'} {Math.abs(selected.change).toFixed(2)} ({Math.abs(selected.pct).toFixed(2)}%)
                                </div>
                            </div>
                        </div>

                        <div className="t-chart-controls">
                            {TIMEFRAMES.map(tf => (
                                <button key={tf} className={`t-time-btn${timeframe === tf ? ' active' : ''}`} onClick={() => setTimeframe(tf)}>{tf}</button>
                            ))}
                        </div>

                        <div className="t-chart-area">
                            <Sparkline color="#3465f4" key={`${selectedTicker}-${timeframe}`} />
                            <div className="t-chart-labels">
                                {['9:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00'].map(l => (
                                    <span key={l}>{l}</span>
                                ))}
                            </div>
                        </div>

                        <div className="t-order-panel">
                            <div className="t-order-title-row">
                                <div>
                                    <div className="t-order-title">Place Order</div>
                                    <div className="t-order-sub">Execute trades for {selected.ticker}</div>
                                </div>
                            </div>
                            <div className="t-order-tabs">
                                <button className={`t-order-tab buy${side === 'buy' ? ' active' : ''}`} onClick={() => setSide('buy')}>Buy</button>
                                <button className={`t-order-tab sell${side === 'sell' ? ' active' : ''}`} onClick={() => setSide('sell')}>Sell</button>
                            </div>
                            <div className="t-form-row">
                                <div className="t-form-group">
                                    <label>Order Type</label>
                                    <select value={orderType} onChange={e => setOrderType(e.target.value)} className="t-form-control">
                                        <option>Market Order</option>
                                        <option>Limit Order</option>
                                        <option>Stop Order</option>
                                    </select>
                                </div>
                                <div className="t-form-group">
                                    <label>Shares</label>
                                    <input type="number" min="1" value={shares} onChange={e => setShares(Math.max(1, parseInt(e.target.value) || 1))} className="t-form-control" />
                                </div>
                            </div>
                            <div className="t-form-row">
                                <div className="t-form-group">
                                    <label>Price per Share</label>
                                    <input readOnly value={`$${selected.price.toFixed(2)}`} className="t-form-control t-readonly" />
                                </div>
                                <div className="t-form-group">
                                    <label>Total Cost</label>
                                    <input readOnly value={totalCost} className="t-form-control t-readonly" />
                                </div>
                            </div>
                            <div className="t-form-actions">
                                <button className={`t-btn-order${side === 'sell' ? ' sell' : ''}`} onClick={placeOrder}>
                                    {side === 'buy' ? 'Buy' : 'Sell'} {selected.ticker}
                                </button>
                                <button className="t-btn-cancel">Cancel</button>
                            </div>
                        </div>

                        <div className="t-perf-panel">
                            <div className="t-perf-header">
                                <span className="t-perf-title">Portfolio Performance</span>
                                <span className="t-perf-sub">Your portfolio value over the last 6 months</span>
                            </div>
                            <div className="t-perf-chart-wrap">
                                <div className="t-perf-y-labels">
                                    {['$60k','$55k','$50k','$45k'].map(l => <span key={l}>{l}</span>)}
                                </div>
                                <div className="t-perf-chart-area">
                                    <Sparkline color="#3465f4" />
                                    <div className="t-perf-x-labels">
                                        {['Jan','Feb','Mar','Apr','May','Jun'].map(l => <span key={l}>{l}</span>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="t-right-col">
                        <div className="t-panel">
                            <div className="t-panel-header"><span>Watchlist</span></div>
                            <input type="text" className="t-search-mini" placeholder="Search stocks..." />
                            <div className="t-watchlist">
                                {watchlist.map(s => (
                                    <div key={s.ticker} className={`t-watch-item${s.ticker === selectedTicker ? ' selected' : ''}`} onClick={() => setSelectedTicker(s.ticker)}>
                                        <div>
                                            <div className="t-watch-ticker">
                                                {s.ticker}
                                                {s.ticker === selectedTicker && <span className="t-watch-star">★</span>}
                                            </div>
                                            <div className="t-watch-company">{s.company}</div>
                                        </div>
                                        <div className="t-watch-right">
                                            <div className="t-watch-price">${s.price.toFixed(2)}</div>
                                            <div className={`t-watch-change ${s.change >= 0 ? 'positive' : 'negative'}`}>
                                                {s.change >= 0 ? '▲' : '▼'} {Math.abs(s.pct).toFixed(2)}%
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="t-btn-outline full" onClick={() => showToast('Add to Watchlist coming soon')}>+ Add to Watchlist</button>
                        </div>

                        <div className="t-panel">
                            <div className="t-panel-header">
                                <span>Your Positions</span>
                                <span className="t-panel-sub">Active holdings</span>
                            </div>
                            {POSITIONS.map(p => (
                                <div key={p.ticker} className="t-position-item">
                                    <div className="t-position-top">
                                        <div>
                                            <div className="t-position-ticker">{p.ticker}</div>
                                            <div className="t-position-meta">{p.shares} shares @ ${p.cost}</div>
                                        </div>
                                        <div className="t-position-right">
                                            <div className="t-position-value">${p.value.toLocaleString('en-US', { minimumFractionDigits: 1 })}</div>
                                            <div className={`t-position-change ${p.change >= 0 ? 'positive' : 'negative'}`}>
                                                {p.change >= 0 ? '+' : ''}${p.change.toFixed(2)} ({p.change >= 0 ? '+' : ''}{p.pct.toFixed(2)}%)
                                            </div>
                                        </div>
                                    </div>
                                    <div className="t-position-actions">
                                        <button className="t-pos-btn buy" onClick={() => showToast(`Opening buy for ${p.ticker}`)}>Buy More</button>
                                        <button className="t-pos-btn sell" onClick={() => showToast(`Opening sell for ${p.ticker}`)}>Sell</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="t-panel">
                            <div className="t-panel-header">
                                <span>Recent Trades</span>
                                <span className="t-panel-sub">Latest transactions</span>
                            </div>
                            {TRADES.map((t, i) => (
                                <div key={i} className="t-trade-item">
                                    <span className={`t-trade-badge ${t.type}`}>{t.type.toUpperCase()}</span>
                                    <div className="t-trade-info">
                                        <div className="t-trade-ticker">{t.ticker}</div>
                                        <div className="t-trade-meta">{t.shares} shares · {t.date}</div>
                                    </div>
                                    <div className="t-trade-right">
                                        <div className="t-trade-value">${t.value.toFixed(2)}</div>
                                        <div className="t-trade-time">{t.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {toast && <div className="t-toast">{toast}</div>}
            </main>
        </>
    );
}