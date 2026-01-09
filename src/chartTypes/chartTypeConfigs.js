/**
 * Chart Type Configurations
 * Supports: Candlestick, Bar, Line, Area, Heikin Ashi, Hollow Candles
 */

export const CHART_TYPES = {
  CANDLESTICK: 'candlestick',
  BAR: 'bar',
  LINE: 'line',
  AREA: 'area',
  HEIKIN_ASHI: 'heikinAshi',
  HOLLOW_CANDLES: 'hollowCandles',
};

export const getChartTypeConfig = (type, theme = 'dark') => {
  const darkColors = {
    upColor: '#26a69a',
    downColor: '#ef5350',
    wickUpColor: '#26a69a',
    wickDownColor: '#ef5350',
    borderUpColor: '#26a69a',
    borderDownColor: '#ef5350',
  };

  const lightColors = {
    upColor: '#16a34a',
    downColor: '#dc2626',
    wickUpColor: '#16a34a',
    wickDownColor: '#dc2626',
    borderUpColor: '#16a34a',
    borderDownColor: '#dc2626',
  };

  const colors = theme === 'dark' ? darkColors : lightColors;

  const configs = {
    [CHART_TYPES.CANDLESTICK]: {
      type: 'candlestick',
      options: {
        ...colors,
        borderVisible: false,
      },
    },
    [CHART_TYPES.BAR]: {
      type: 'bar',
      options: {
        upColor: colors.upColor,
        downColor: colors.downColor,
      },
    },
    [CHART_TYPES.LINE]: {
      type: 'line',
      options: {
        color: colors.upColor,
        lineWidth: 2,
      },
    },
    [CHART_TYPES.AREA]: {
      type: 'area',
      options: {
        lineColor: colors.upColor,
        topColor: `${colors.upColor}40`,
        bottomColor: `${colors.upColor}05`,
        lineWidth: 2,
      },
    },
    [CHART_TYPES.HEIKIN_ASHI]: {
      type: 'candlestick',
      options: {
        ...colors,
        borderVisible: false,
      },
      transform: true, // Apply Heikin-Ashi transformation
    },
    [CHART_TYPES.HOLLOW_CANDLES]: {
      type: 'candlestick',
      options: {
        ...colors,
        borderVisible: true,
        wickVisible: true,
      },
    },
  };

  return configs[type] || configs[CHART_TYPES.CANDLESTICK];
};

/**
 * Heikin-Ashi Transformation
 * Smooths price action by averaging OHLC
 */
export const transformHeikinAshi = (candles) => {
  if (!candles || candles.length === 0) return [];

  return candles.map((candle, idx) => {
    const close = (candle.open + candle.high + candle.low + candle.close) / 4;

    let open;
    if (idx === 0) {
      open = (candle.open + candle.close) / 2;
    } else {
      const prevCandle = candles[idx - 1];
      open = (prevCandle.open + prevCandle.close) / 2;
    }

    const high = Math.max(candle.high, open, close);
    const low = Math.min(candle.low, open, close);

    return {
      ...candle,
      open,
      high,
      low,
      close,
    };
  });
};

export default {
  CHART_TYPES,
  getChartTypeConfig,
  transformHeikinAshi,
};