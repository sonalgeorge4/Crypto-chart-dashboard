import { create } from 'zustand'

export const useChartStore = create((set, get) => ({
  // Chart State
  chartInstance: null,
  seriesInstances: {},
  indicatorPanels: [],
  
  // UI State
  theme: 'dark',
  timeFrame: '1h',
  chartType: 'candlestick',
  symbol: 'BTCUSDT',
  
  // Drawing State
  activeDrawingTool: null,
  drawings: [],
  
  // Indicators State
  activeIndicators: [
    { id: 'ma', type: 'sma', period: 20, color: '#ff9800', visible: true },
    { id: 'volume', type: 'volume', visible: true },
  ],
  
  // Actions
  setChartInstance: (instance) => set({ chartInstance: instance }),
  
  addSeriesInstance: (id, series) => set((state) => ({
    seriesInstances: { ...state.seriesInstances, [id]: series }
  })),
  
  removeSeriesInstance: (id) => set((state) => {
    const { [id]: removed, ...rest } = state.seriesInstances
    return { seriesInstances: rest }
  }),
  
  setTheme: (theme) => {
    localStorage.setItem('chart-theme', theme)
    set({ theme })
  },
  
  setTimeFrame: (timeFrame) => set({ timeFrame }),
  
  setChartType: (chartType) => set({ chartType }),
  
  setSymbol: (symbol) => set({ symbol }),
  
  setActiveDrawingTool: (tool) => set({ activeDrawingTool: tool }),
  
  addDrawing: (drawing) => set((state) => ({
    drawings: [...state.drawings, drawing]
  })),
  
  removeDrawing: (id) => set((state) => ({
    drawings: state.drawings.filter(d => d.id !== id)
  })),
  
  addIndicator: (indicator) => set((state) => ({
    activeIndicators: [...state.activeIndicators, indicator]
  })),
  
  removeIndicator: (id) => set((state) => ({
    activeIndicators: state.activeIndicators.filter(i => i.id !== id)
  })),
  
  updateIndicator: (id, updates) => set((state) => ({
    activeIndicators: state.activeIndicators.map(i =>
      i.id === id ? { ...i, ...updates } : i
    )
  })),
  
  toggleIndicatorVisibility: (id) => set((state) => ({
    activeIndicators: state.activeIndicators.map(i =>
      i.id === id ? { ...i, visible: !i.visible } : i
    )
  })),
  
  addIndicatorPanel: () => set((state) => ({
    indicatorPanels: [...state.indicatorPanels, { id: Date.now(), height: 200 }]
  })),
  
  removeIndicatorPanel: (id) => set((state) => ({
    indicatorPanels: state.indicatorPanels.filter(p => p.id !== id)
  })),
  
  // Data State
  candles: [],
  updateCandles: (newCandles) => set({ candles: newCandles }),
  
  addCandle: (candle) => set((state) => ({
    candles: [...state.candles.slice(0, -1), candle]
  })),
  
  // Watchlist
  watchlist: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'ADAUSDT', 'DOTUSDT'],
  addToWatchlist: (symbol) => set((state) => ({
    watchlist: [...state.watchlist, symbol]
  })),
  
  removeFromWatchlist: (symbol) => set((state) => ({
    watchlist: state.watchlist.filter(s => s !== symbol)
  })),
}))