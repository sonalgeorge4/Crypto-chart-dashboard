// WebSocket connection to Binance for real-time kline data
let ws = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

export const connectBinanceWebSocket = (symbol = 'BTCUSDT', timeframe = '1m', callback) => {
  const timeframeMap = {
    '1s': '1s',
    '1m': '1m',
    '3m': '3m',
    '5m': '5m',
    '15m': '15m',
    '30m': '30m',
    '1h': '1h',
    '2h': '2h',
    '4h': '4h',
    '6h': '6h',
    '8h': '8h',
    '12h': '12h',
    '1d': '1d',
    '3d': '3d',
    '1w': '1w',
    '1M': '1M',
  };

  const interval = timeframeMap[timeframe] || '1m';
  const streamUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`;

  return new Promise((resolve, reject) => {
    try {
      ws = new WebSocket(streamUrl);

      ws.onopen = () => {
        console.log(`✅ Connected to Binance: ${symbol} ${timeframe}`);
        reconnectAttempts = 0;
        resolve(ws);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          const kline = message.k;

          const candle = {
            time: Math.floor(kline.t / 1000), // Convert to seconds
            open: parseFloat(kline.o),
            high: parseFloat(kline.h),
            low: parseFloat(kline.l),
            close: parseFloat(kline.c),
            volume: parseFloat(kline.v),
            quoteAssetVolume: parseFloat(kline.q),
            isClosed: kline.x,
            tradeCount: kline.n,
          };

          if (callback) callback(candle);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };

      ws.onclose = () => {
        console.log('WebSocket closed. Attempting to reconnect...');
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts++;
          setTimeout(() => {
            connectBinanceWebSocket(symbol, timeframe, callback);
          }, 2000 * reconnectAttempts);
        } else {
          console.error('Max reconnection attempts reached');
        }
      };
    } catch (error) {
      reject(error);
    }
  });
};

export const disconnectBinanceWebSocket = () => {
  if (ws) {
    ws.close();
    ws = null;
    reconnectAttempts = 0;
    console.log('WebSocket disconnected');
  }
};

// Fetch historical OHLC data from Binance REST API
export const fetchHistoricalData = async (symbol = 'BTCUSDT', timeframe = '1m', limit = 500) => {
  const timeframeMap = {
    '1s': '1s',
    '1m': '1m',
    '3m': '3m',
    '5m': '5m',
    '15m': '15m',
    '30m': '30m',
    '1h': '1h',
    '2h': '2h',
    '4h': '4h',
    '6h': '6h',
    '8h': '8h',
    '12h': '12h',
    '1d': '1d',
    '3d': '3d',
    '1w': '1w',
    '1M': '1M',
  };

  const interval = timeframeMap[timeframe] || '1m';

  try {
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid response format');
    }

    return data.map((kline) => ({
      time: Math.floor(kline[0] / 1000), // Open time (seconds)
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
      volume: parseFloat(kline[5]),
      closeTime: Math.floor(kline[6] / 1000),
      quoteAssetVolume: parseFloat(kline[7]),
      tradeCount: parseInt(kline[8]),
      takerBuyBaseAssetVolume: parseFloat(kline[9]),
      takerBuyQuoteAssetVolume: parseFloat(kline[10]),
    }));
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
};

// Get current ticker data
export const fetchTickerData = async (symbol = 'BTCUSDT') => {
  try {
    const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
    const data = await response.json();

    return {
      symbol: data.symbol,
      lastPrice: parseFloat(data.lastPrice),
      highPrice: parseFloat(data.highPrice),
      lowPrice: parseFloat(data.lowPrice),
      volume: parseFloat(data.volume),
      quoteVolume: parseFloat(data.quoteAssetVolume),
      change: parseFloat(data.priceChange),
      changePercent: parseFloat(data.priceChangePercent),
    };
  } catch (error) {
    console.error('Error fetching ticker data:', error);
    throw error;
  }
};

export default {
  connectBinanceWebSocket,
  disconnectBinanceWebSocket,
  fetchHistoricalData,
  fetchTickerData,
};