/**
 * Core calculations for all technical indicators
 * All functions take candles array and return result array matching candle count
 */

// ============================================
// MOVING AVERAGES
// ============================================

export const calculateSMA = (candles, period) => {
  if (!candles || candles.length < period) return [];

  return candles.map((_, idx) => {
    if (idx < period - 1) return null;
    const slice = candles.slice(idx - period + 1, idx + 1);
    const sum = slice.reduce((acc, c) => acc + c.close, 0);
    return sum / period;
  });
};

export const calculateEMA = (candles, period) => {
  if (!candles || candles.length < period) return [];

  const multiplier = 2 / (period + 1);
  const result = [];
  let ema = null;

  for (let i = 0; i < candles.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else if (i === period - 1) {
      const smaSum = candles.slice(0, period).reduce((acc, c) => acc + c.close, 0);
      ema = smaSum / period;
      result.push(ema);
    } else {
      ema = (candles[i].close - ema) * multiplier + ema;
      result.push(ema);
    }
  }

  return result;
};

export const calculateWMA = (candles, period) => {
  if (!candles || candles.length < period) return [];

  return candles.map((_, idx) => {
    if (idx < period - 1) return null;
    const slice = candles.slice(idx - period + 1, idx + 1);
    const weights = Array.from({ length: period }, (_, i) => i + 1);
    const weightedSum = slice.reduce((acc, c, i) => acc + c.close * weights[i], 0);
    const weightSum = weights.reduce((a, b) => a + b, 0);
    return weightedSum / weightSum;
  });
};

// ============================================
// MOMENTUM & OSCILLATORS
// ============================================

export const calculateRSI = (candles, period = 14) => {
  if (!candles || candles.length < period + 1) return [];

  const result = [];
  let avgGain = 0;
  let avgLoss = 0;

  for (let i = 0; i < candles.length; i++) {
    if (i === 0) {
      result.push(null);
      continue;
    }

    const change = candles[i].close - candles[i - 1].close;
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? -change : 0;

    if (i < period) {
      avgGain += gain;
      avgLoss += loss;
      result.push(null);
    } else if (i === period) {
      avgGain /= period;
      avgLoss /= period;
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      const rsi = 100 - 100 / (1 + rs);
      result.push(rsi);
    } else {
      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      const rsi = 100 - 100 / (1 + rs);
      result.push(rsi);
    }
  }

  return result;
};

export const calculateMACD = (candles, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
  if (!candles || candles.length < slowPeriod) return { macd: [], signal: [], histogram: [] };

  const ema12 = calculateEMA(candles, fastPeriod);
  const ema26 = calculateEMA(candles, slowPeriod);

  const macd = ema12.map((val12, idx) => {
    const val26 = ema26[idx];
    return val12 !== null && val26 !== null ? val12 - val26 : null;
  });

  // EMA of MACD line
  const macdValues = macd.filter(v => v !== null);
  const signal = [];
  let signalEMA = null;
  let nonNullCount = 0;

  macd.forEach((val, idx) => {
    if (val === null) {
      signal.push(null);
    } else {
      nonNullCount++;
      const multiplier = 2 / (signalPeriod + 1);

      if (nonNullCount < signalPeriod) {
        signal.push(null);
      } else if (nonNullCount === signalPeriod) {
        signalEMA = macdValues.slice(0, signalPeriod).reduce((a, b) => a + b, 0) / signalPeriod;
        signal.push(signalEMA);
      } else {
        signalEMA = (val - signalEMA) * multiplier + signalEMA;
        signal.push(signalEMA);
      }
    }
  });

  const histogram = macd.map((m, idx) => {
    return m !== null && signal[idx] !== null ? m - signal[idx] : null;
  });

  return { macd, signal, histogram };
};

// ============================================
// VOLATILITY
// ============================================

export const calculateBollingerBands = (candles, period = 20, stdDev = 2) => {
  if (!candles || candles.length < period) return { upper: [], middle: [], lower: [] };

  const sma = calculateSMA(candles, period);
  const upper = [];
  const middle = [];
  const lower = [];

  candles.forEach((_, idx) => {
    if (idx < period - 1) {
      upper.push(null);
      middle.push(null);
      lower.push(null);
      return;
    }

    const slice = candles.slice(idx - period + 1, idx + 1);
    const avg = slice.reduce((acc, c) => acc + c.close, 0) / period;
    const variance = slice.reduce((acc, c) => acc + Math.pow(c.close - avg, 2), 0) / period;
    const deviation = Math.sqrt(variance) * stdDev;

    middle.push(sma[idx]);
    upper.push(sma[idx] + deviation);
    lower.push(sma[idx] - deviation);
  });

  return { upper, middle, lower };
};

export const calculateATR = (candles, period = 14) => {
  if (!candles || candles.length < period) return [];

  const trueRanges = [];
  let atr = null;
  const result = [];

  for (let i = 0; i < candles.length; i++) {
    if (i === 0) {
      result.push(null);
      continue;
    }

    const high = candles[i].high;
    const low = candles[i].low;
    const prevClose = candles[i - 1].close;

    const tr = Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose));
    trueRanges.push(tr);

    if (i < period) {
      result.push(null);
    } else if (i === period) {
      atr = trueRanges.reduce((a, b) => a + b, 0) / period;
      result.push(atr);
    } else {
      atr = (atr * (period - 1) + tr) / period;
      result.push(atr);
    }
  }

  return result;
};

// ============================================
// VOLUME INDICATORS
// ============================================

export const calculateOBV = (candles) => {
  if (!candles || candles.length === 0) return [];

  const obv = [candles[0].volume];

  for (let i = 1; i < candles.length; i++) {
    let volume = candles[i].volume;

    if (candles[i].close > candles[i - 1].close) {
      obv.push(obv[i - 1] + volume);
    } else if (candles[i].close < candles[i - 1].close) {
      obv.push(obv[i - 1] - volume);
    } else {
      obv.push(obv[i - 1]);
    }
  }

  return obv;
};

export const calculateADL = (candles) => {
  if (!candles || candles.length === 0) return [];

  const adl = [];
  let cumulative = 0;

  candles.forEach((candle) => {
    const closeLocation = (candle.close - candle.low) / (candle.high - candle.low);
    const moneyFlowMultiplier = closeLocation * candle.volume;
    cumulative += moneyFlowMultiplier;
    adl.push(cumulative);
  });

  return adl;
};

export const calculateVWAP = (candles) => {
  if (!candles || candles.length === 0) return [];

  const vwap = [];
  let cumulativeTP_Volume = 0;
  let cumulativeVolume = 0;

  candles.forEach((candle) => {
    const typicalPrice = (candle.high + candle.low + candle.close) / 3;
    cumulativeTP_Volume += typicalPrice * candle.volume;
    cumulativeVolume += candle.volume;
    vwap.push(cumulativeVolume === 0 ? 0 : cumulativeTP_Volume / cumulativeVolume);
  });

  return vwap;
};

// ============================================
// TREND
// ============================================

export const calculateSuperTrend = (candles, period = 10, multiplier = 3) => {
  if (!candles || candles.length < period) {
    return { upperBand: [], lowerBand: [], trend: [] };
  }

  const atr = calculateATR(candles, period);
  const upperBand = [];
  const lowerBand = [];
  const trend = [];

  let basicUpperBand = null;
  let basicLowerBand = null;
  let finalUpperBand = null;
  let finalLowerBand = null;
  let superTrend = null;

  for (let i = period; i < candles.length; i++) {
    const hl2 = (candles[i].high + candles[i].low) / 2;
    basicUpperBand = hl2 + multiplier * atr[i];
    basicLowerBand = hl2 - multiplier * atr[i];

    if (basicUpperBand < finalUpperBand || candles[i - 1].close > finalUpperBand) {
      finalUpperBand = basicUpperBand;
    } else {
      finalUpperBand = finalUpperBand || basicUpperBand;
    }

    if (basicLowerBand > finalLowerBand || candles[i - 1].close < finalLowerBand) {
      finalLowerBand = basicLowerBand;
    } else {
      finalLowerBand = finalLowerBand || basicLowerBand;
    }

    if (superTrend === null) {
      superTrend = candles[i].close <= finalUpperBand ? finalUpperBand : finalLowerBand;
    } else {
      if (superTrend === finalUpperBand) {
        superTrend = candles[i].close >= finalLowerBand ? finalLowerBand : finalUpperBand;
      } else {
        superTrend = candles[i].close <= finalUpperBand ? finalUpperBand : finalLowerBand;
      }
    }

    for (let j = 0; j < i; j++) {
      if (upperBand[j] === undefined) upperBand[j] = null;
      if (lowerBand[j] === undefined) lowerBand[j] = null;
      if (trend[j] === undefined) trend[j] = null;
    }

    upperBand[i] = finalUpperBand;
    lowerBand[i] = finalLowerBand;
    trend[i] = superTrend;
  }

  return { upperBand, lowerBand, trend };
};

// ============================================
// UTILITIES
// ============================================

export const formatNumber = (num, decimals = 2) => {
  if (num === null || num === undefined) return 'N/A';
  return parseFloat(num.toFixed(decimals));
};

export const calculateChange = (current, previous) => {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};