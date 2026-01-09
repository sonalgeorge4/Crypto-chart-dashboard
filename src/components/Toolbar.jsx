import React, { useState } from 'react';
import { useChartStore } from '../store/chartStore';
import '../styles/Toolbar.css';

const Toolbar = () => {
  const {
    symbol,
    timeframe,
    theme,
    setSymbol,
    setTimeframe,
    setTheme,
    toggleDrawingTool,
    setShowSettings,
  } = useChartStore();

  const [showSymbolDropdown, setShowSymbolDropdown] = useState(false);
  const [searchSymbol, setSearchSymbol] = useState('');

  const timeframes = ['1s', '1m', '3m', '5m', '15m', '30m', '1h', '4h', '1d', '1w', '1M'];
  const popularSymbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT', 'DOGEUSDT', 'SOLUSDT', 'MATICUSDT'];

  const handleSymbolChange = (newSymbol) => {
    setSymbol(newSymbol);
    setShowSymbolDropdown(false);
    setSearchSymbol('');
  };

  const filteredSymbols = popularSymbols.filter((s) =>
    s.toLowerCase().includes(searchSymbol.toLowerCase())
  );

  return (
    <div className={`toolbar ${theme}`}>
      <div className="toolbar-left">
        {/* Symbol Selector */}
        <div className="symbol-selector">
          <button
            className="symbol-button"
            onClick={() => setShowSymbolDropdown(!showSymbolDropdown)}
          >
            <span className="symbol-text">{symbol}</span>
            <span className="dropdown-icon">▼</span>
          </button>

          {showSymbolDropdown && (
            <div className="symbol-dropdown">
              <input
                type="text"
                className="symbol-search"
                placeholder="Search symbol..."
                value={searchSymbol}
                onChange={(e) => setSearchSymbol(e.target.value)}
                autoFocus
              />
              <div className="symbol-list">
                {filteredSymbols.length > 0 ? (
                  filteredSymbols.map((s) => (
                    <div
                      key={s}
                      className={`symbol-item ${s === symbol ? 'active' : ''}`}
                      onClick={() => handleSymbolChange(s)}
                    >
                      {s}
                    </div>
                  ))
                ) : (
                  <div className="symbol-item disabled">No symbols found</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Timeframe Buttons */}
        <div className="timeframe-buttons">
          {timeframes.map((tf) => (
            <button
              key={tf}
              className={`timeframe-btn ${tf === timeframe ? 'active' : ''}`}
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar-right">
        {/* Drawing Tools */}
        <div className="drawing-tools-group">
          <button
            className="tool-btn"
            title="Trend Line"
            onClick={() => toggleDrawingTool('trendline')}
          >
            📏
          </button>
          <button
            className="tool-btn"
            title="Rectangle"
            onClick={() => toggleDrawingTool('rectangle')}
          >
            ▭
          </button>
          <button
            className="tool-btn"
            title="Fibonacci"
            onClick={() => toggleDrawingTool('fibonacci')}
          >
            Φ
          </button>
          <button
            className="tool-btn"
            title="Horizontal Line"
            onClick={() => toggleDrawingTool('horizontalLine')}
          >
            —
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Toggle Theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Settings */}
        <button
          className="settings-btn"
          onClick={() => setShowSettings(true)}
          title="Settings"
        >
          ⚙️
        </button>
      </div>
    </div>
  );
};

export default Toolbar;