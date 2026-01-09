# 🚀 Crypto Chart Dashboard

Professional **TradingView-style charting application** for cryptocurrency trading analysis built with **React + Vite + TradingView Lightweight Charts**.

## ✨ Features

### 📊 Chart Types
- ✅ Candlestick (Default)
- ✅ Heikin-Ashi (Trend smoothing)
- ✅ Hollow Candles
- ✅ Bar, Line, Area Charts
- ⏳ Renko, Kagi, Point & Figure (Coming Soon)

### 📈 Technical Indicators
- ✅ Moving Averages (SMA, EMA, WMA)
- ✅ Momentum: RSI, MACD, Stochastic RSI
- ✅ Volatility: Bollinger Bands, ATR, SuperTrend
- ✅ Volume: OBV, ADL, VWAP
- ⏳ Ichimoku, Volume Profile, Pivot Points (Coming Soon)

### 🎨 Multi-Pane Oscillators
- ✅ RSI with overbought/oversold levels
- ✅ MACD with signal & histogram
- ✅ Stochastic RSI with K/D lines
- ⏳ Additional panes (ADX, Williams %R, CCI)

### 🛠️ Drawing Tools
- ✅ Trendlines
- ✅ Rectangles
- ✅ Horizontal/Vertical Lines
- ⏳ Fibonacci (Retracement, Extension, Channels)
- ⏳ Pitchforks, Gann Tools
- ⏳ Annotations, Text, Arrows

### 🌍 Data & Integration
- ✅ Real-time Binance WebSocket (klines)
- ✅ Historical OHLC data (REST API)
- ✅ Multiple timeframes (1m to 1M)
- ✅ Live candle updates
- ⏳ Multi-symbol sync
- ⏳ Alerts system

### 🎯 UI/UX
- ✅ Dark/Light theme toggle
- ✅ Responsive design (desktop-first)
- ✅ Watchlist sidebar
- ✅ Indicator parameter tuning
- ✅ Color customization
- ⏳ Save/Load layouts
- ⏳ Keyboard shortcuts

---

## 📁 Project Structure

```
crypto-chart-dashboard/
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   │
│   ├── store/
│   │   └── chartStore.js (Zustand state management)
│   │
│   ├── components/
│   │   ├── ChartContainer.jsx (Main chart)
│   │   ├── Toolbar.jsx (Controls)
│   │   ├── IndicatorsPanel.jsx (Indicator toggles)
│   │   ├── OscillatorsPanel.jsx (Multi-pane RSI/MACD)
│   │   ├── DrawingTools.jsx (Drawing tools)
│   │   ├── Sidebar.jsx (Watchlist)
│   │
│   ├── utils/
│   │   ├── chartCalculations.js (All indicator math)
│   │   ├── binanceWebSocket.js (Real-time data)
│   │   ├── drawingUtils.js (Drawing manager)
│   │
│   ├── chartTypes/
│   │   └── chartTypeConfigs.js (Chart type configs)
│   │
│   └── styles/
│       ├── Toolbar.css
│       ├── IndicatorsPanel.css
│       ├── OscillatorsPanel.css
│       ├── ChartContainer.css
│       ├── DrawingTools.css
│       └── Sidebar.css
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 16
- npm >= 8

### Installation

1. **Clone & Enter Directory**
```bash
git clone https://github.com/YOUR-USERNAME/crypto-chart-dashboard.git
cd crypto-chart-dashboard
```

2. **Install Dependencies**
```bash
npm install
```

3. **Start Development Server**
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📦 Available Scripts

```bash
# Development (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Start production server
npm start
```

---

## 🎮 Usage Guide

### Symbol & Timeframe
1. Click **symbol button** (top-left) to switch between BTC, ETH, BNB, etc.
2. Click **timeframe buttons** (1m, 5m, 15m, 1h, 4h, 1d, 1w, 1M)

### Indicators
1. Open **Indicators Panel** (right sidebar, ⚙️ Settings)
2. **Toggle** indicators on/off
3. **Expand** any indicator to adjust:
   - Period (SMA: 20, 50, 200)
   - Std Deviation (Bollinger Bands: 2.0)
   - Overbought/Oversold levels (RSI: 70/30)
4. **Add/Remove** multiple periods (click **+ Add**)

### Chart Types
*(Click dropdown in toolbar)*
- Candlestick
- Heikin-Ashi
- Hollow Candles
- Bar, Line, Area

### Drawing Tools
1. Click **drawing tool** (toolbar: 📏, ▭, —, |)
2. **Click & drag** on chart to draw
3. Adjust **color** and **width** in Drawing Tools panel
4. **Remove** individual drawings or **Clear All**

### Oscillators
Multi-pane panel shows:
- **RSI** (with 70/30 levels)
- **MACD** (line, signal, histogram)
- **Stochastic RSI** (K/D lines with 80/20 levels)

### Watchlist
Left sidebar shows:
- BTC, ETH, BNB, XRP, ADA
- **Current price** + **24h change** (green/red)
- **Click** to switch chart symbol

### Theme
Click **☀️/🌙** to toggle Dark/Light mode.

---

## 📊 Indicator Formulas

### Moving Averages
```
SMA = Sum(Close, N) / N
EMA = (Close - EMA_prev) × Multiplier + EMA_prev
     where Multiplier = 2 / (N + 1)
```

### RSI
```
RSI = 100 - (100 / (1 + RS))
where RS = Avg Gain / Avg Loss over N periods
```

### MACD
```
MACD = EMA12 - EMA26
Signal = EMA9(MACD)
Histogram = MACD - Signal
```

### Bollinger Bands
```
Middle = SMA(N)
Upper = Middle + (StdDev × 2)
Lower = Middle - (StdDev × 2)
```

### SuperTrend
```
ATR = Average True Range
Upper Band = (High + Low) / 2 + ATR × Multiplier
Lower Band = (High + Low) / 2 - ATR × Multiplier
Trend = (Close > Upper) ? Upper : Lower
```

---

## 🔌 API Integration

### Binance WebSocket
```javascript
import { connectBinanceWebSocket } from './utils/binanceWebSocket';

connectBinanceWebSocket('BTCUSDT', '1m', (candle) => {
  console.log(candle);
  // { time, open, high, low, close, volume, isClosed }
});
```

### Fetch Historical Data
```javascript
import { fetchHistoricalData } from './utils/binanceWebSocket';

const candles = await fetchHistoricalData('BTCUSDT', '1m', 500);
```

---

## 🛣️ Roadmap

### Phase 1 (Current) ✅
- ✅ Core chart rendering
- ✅ Real-time WebSocket
- ✅ SMA, EMA, RSI, MACD, Bollinger, ATR, SuperTrend
- ✅ Multi-pane oscillators
- ✅ Drawing tools (basic)
- ✅ Dark/Light theme

### Phase 2 (Next)
- 🔲 Stochastic, Williams %R, CCI, ADX
- 🔲 Fibonacci (all variants)
- 🔲 Pitchforks, Gann tools
- 🔲 Advanced drawing (annotations, patterns)
- 🔲 Ichimoku Cloud
- 🔲 Volume Profile

### Phase 3 (Future)
- 🔲 Save/Load chart layouts
- 🔲 Alerts system
- 🔲 Pine Script-style indicators
- 🔲 Multi-chart sync
- 🔲 Backtesting framework
- 🔲 API for custom indicators

---

## 🐛 Troubleshooting

### npm install fails
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Chart not rendering
- Check browser console for errors
- Ensure `chart-container` div exists
- Verify Binance API is accessible (check network tab)

### WebSocket connection fails
- Check if `wss://stream.binance.com:9443/ws/` is accessible
- Verify symbol format (e.g., BTCUSDT)
- Check browser console for CORS issues

### Indicators not updating
- Ensure `candleData` is populated (check Store)
- Verify indicator settings in IndicatorsPanel
- Check DevTools Performance tab for lag

---

## 📝 Configuration

Edit `src/store/chartStore.js` to customize defaults:

```javascript
indicators: {
  sma: { enabled: true, periods: [20, 50, 200], colors: [...] },
  rsi: { enabled: true, period: 14, overbought: 70, oversold: 30 },
  macd: { enabled: false, fast: 12, slow: 26, signal: 9 },
  // ...
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 💡 Credits

Built with:
- **React 18** - UI framework
- **Vite** - Build tool
- **TradingView Lightweight Charts** - Charting library
- **Zustand** - State management
- **Binance API** - Data source

---

## 📧 Support

Have questions? Open an issue on GitHub or contact via email.

---

**Happy Trading! 📈**