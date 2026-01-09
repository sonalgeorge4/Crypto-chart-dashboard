import { create } from 'zustand';

export const useChartStore = create((set, get) => ({
  // Chart data
  candleData: [],
  symbol: 'BTCUSDT',
  timeframe: '1m',
  
  // Indicator states
  indicators: {
    sma: { enabled: true, periods: [20, 50, 200], colors: ['#ff6b6b', '#4ecdc4', '#45b7d1'] },
    ema: { enabled: false, periods: [12, 26], colors: ['#f39c12', '#e74c3c'] },
    rsi: { enabled: true, period: 14, overbought: 70, oversold: 30 },
    macd: { enabled: false, fast: 12, slow: 26, signal: 9 },
    bollinger: { enabled: false, period: 20, stdDev: 2 },
    atr: { enabled: false, period: 14 },
    volume: { enabled: true },
    obv: { enabled: false },
    stochRsi: { enabled: false, period: 14, kPeriod: 3, dPeriod: 3 },
  },
  
  // Drawing tools
  drawingTools: {
    trendline: false,
    rectangle: false,
    fibonacci: false,
    horizontalLine: false,
    verticalLine: false,
  },
  
  // UI states
  theme: 'dark', // 'dark' or 'light'
  activePane: 'price', // 'price', 'rsi', 'macd', etc.
  selectedIndicator: null,
  showSettings: false,
  
  // Real-time data
  latestCandle: null,
  lastUpdateTime: null,
  
  // Actions
  setCandleData: (data) => set({ candleData: data }),
  addCandle: (candle) => set((state) => ({
    candleData: [...state.candleData, candle].slice(-500), // Keep last 500 candles
    latestCandle: candle,
    lastUpdateTime: Date.now(),
  })),
  
  updateLatestCandle: (candle) => set({
    latestCandle: candle,
    lastUpdateTime: Date.now(),
  }),
  
  setSymbol: (symbol) => set({ symbol }),
  setTimeframe: (timeframe) => set({ timeframe }),
  
  toggleIndicator: (indicatorName) => set((state) => ({
    indicators: {
      ...state.indicators,
      [indicatorName]: {
        ...state.indicators[indicatorName],
        enabled: !state.indicators[indicatorName].enabled,
      },
    },
  })),
  
  updateIndicatorParams: (indicatorName, params) => set((state) => ({
    indicators: {
      ...state.indicators,
      [indicatorName]: {
        ...state.indicators[indicatorName],
        ...params,
      },
    },
  })),
  
  toggleDrawingTool: (toolName) => set((state) => ({
    drawingTools: {
      ...state.drawingTools,
      [toolName]: !state.drawingTools[toolName],
    },
  })),
  
  setTheme: (theme) => set({ theme }),
  setActivePane: (pane) => set({ activePane: pane }),
  setSelectedIndicator: (indicator) => set({ selectedIndicator: indicator }),
  setShowSettings: (show) => set({ showSettings: show }),
}));