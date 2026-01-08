// Binance API Functions (FREE - no API key needed for public data)

// Get historical candlestick data
async function loadHistoricalData() {
    try {
        connectionStatusEl.textContent = 'Loading data...';
        connectionStatusEl.className = 'loading';
        
        const symbol = currentSymbol;
        const interval = currentInterval;
        
        // Binance public API endpoint
        const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        // Format data for Lightweight Charts
        const candles = data.map(item => ({
            time: (item[0] / 1000), // Convert to seconds
            open: parseFloat(item[1]),
            high: parseFloat(item[2]),
            low: parseFloat(item[3]),
            close: parseFloat(item[4]),
        }));
        
        const volume = data.map(item => ({
            time: (item[0] / 1000),
            value: parseFloat(item[5]),
            color: parseFloat(item[4]) >= parseFloat(item[1]) ? '#00ff9d' : '#ff3b6b',
        }));
        
        // Update chart
        updateChart({ candles, volume });
        
        // Start WebSocket for real-time updates
        startWebSocket(symbol, interval);
        
        connectionStatusEl.textContent = 'Connected';
        connectionStatusEl.className = 'connected';
        
    } catch (error) {
        console.error('Error loading data:', error);
        connectionStatusEl.textContent = 'Connection failed';
        connectionStatusEl.className = 'disconnected';
        
        // Fallback to sample data if API fails
        loadSampleData();
    }
}

// WebSocket for real-time updates
function startWebSocket(symbol, interval) {
    // Close existing connection if any
    if (window.ws) {
        window.ws.close();
    }
    
    // Binance WebSocket (free, no API key)
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`);
    
    ws.onopen = () => {
        console.log('WebSocket connected');
        connectionStatusEl.textContent = 'Live updating';
    };
    
    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        const kline = message.k;
        
        if (kline.x) { // Candle is closed
            const newCandle = {
                time: (kline.t / 1000),
                open: parseFloat(kline.o),
                high: parseFloat(kline.h),
                low: parseFloat(kline.l),
                close: parseFloat(kline.c),
            };
            
            // Update the last candle
            const currentData = candleSeries.data();
            if (currentData.length > 0) {
                const lastCandle = currentData[currentData.length - 1];
                if (lastCandle.time === newCandle.time) {
                    // Update existing candle
                    candleSeries.update(newCandle);
                } else {
                    // Add new candle
                    candleSeries.update(newCandle);
                }
            }
            
            // Update current price
            currentPriceEl.textContent = `$${parseFloat(kline.c).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8
            })}`;
        }
    };
    
    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        connectionStatusEl.textContent = 'WebSocket error';
        connectionStatusEl.className = 'disconnected';
    };
    
    ws.onclose = () => {
        console.log('WebSocket disconnected');
        connectionStatusEl.textContent = 'Disconnected';
        connectionStatusEl.className = 'disconnected';
    };
    
    window.ws = ws;
}

// Sample data fallback (if API fails)
function loadSampleData() {
    const now = Math.floor(Date.now() / 1000);
    const candles = [];
    const volume = [];
    
    for (let i = 100; i >= 0; i--) {
        const basePrice = 50000;
        const change = (Math.random() - 0.5) * 1000;
        const open = basePrice + change;
        const close = open + (Math.random() - 0.5) * 500;
        const high = Math.max(open, close) + Math.random() * 300;
        const low = Math.min(open, close) - Math.random() * 300;
        
        candles.push({
            time: now - (i * 3600),
            open: open,
            high: high,
            low: low,
            close: close,
        });
        
        volume.push({
            time: now - (i * 3600),
            value: Math.random() * 100,
            color: close >= open ? '#00ff9d' : '#ff3b6b',
        });
    }
    
    updateChart({ candles, volume });
    currentPriceEl.textContent = `$${candles[candles.length - 1].close.toFixed(2)}`;
    priceChangeEl.innerHTML = `24h Change: <span class="positive">+2.34%</span>`;
    
    connectionStatusEl.textContent = 'Using sample data';
    connectionStatusEl.className = 'warning';
}

// Add CSS for price changes
const style = document.createElement('style');
style.textContent = `
    .positive { color: #00ff9d; }
    .negative { color: #ff3b6b; }
    .loading { color: #ffcc00; }
    .disconnected { color: #ff3b6b; }
    .warning { color: #ffcc00; }
`;
document.head.appendChild(style);