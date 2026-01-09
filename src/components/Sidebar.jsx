import React, { useState, useEffect } from 'react';
import { useChartStore } from '../store/chartStore';
import { fetchTickerData } from '../utils/binanceWebSocket';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const { theme, setSymbol } = useChartStore();
  const [tickers, setTickers] = useState([]);
  const [loading, setLoading] = useState(true);

  const watchlistSymbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT'];

  useEffect(() => {
    const loadWatchlist = async () => {
      try {
        const data = await Promise.all(
          watchlistSymbols.map((symbol) => fetchTickerData(symbol))
        );
        setTickers(data);
      } catch (error) {
        console.error('Error loading watchlist:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWatchlist();
  }, []);

  return (
    <div className={`sidebar ${theme}`}>
      <div className="sidebar-header">
        <h3>Watchlist</h3>
      </div>

      <div className="watchlist">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          tickers.map((ticker) => (
            <div
              key={ticker.symbol}
              className="watchlist-item"
              onClick={() => setSymbol(ticker.symbol)}
            >
              <div className="symbol-info">
                <div className="symbol-name">
                  {ticker.symbol.replace('USDT', '')}
                </div>
                <div className="symbol-price">${ticker.lastPrice.toFixed(2)}</div>
              </div>
              <div className={`symbol-change ${ticker.changePercent >= 0 ? 'positive' : 'negative'}`}>
                {ticker.changePercent > 0 ? '+' : ''}
                {ticker.changePercent.toFixed(2)}%
              </div>
            </div>
          ))
        )}
      </div>

      <div className="sidebar-footer">
        <button className="settings-link">⚙️ Settings</button>
      </div>
    </div>
  );
};

export default Sidebar;