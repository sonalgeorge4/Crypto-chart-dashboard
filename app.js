// Initialize Chart
const chartContainer = document.getElementById('chart');
const chart = LightweightCharts.createChart(chartContainer, {
    width: chartContainer.clientWidth,
    height: 500,
    layout: {
        backgroundColor: '#0f2027',
        textColor: '#d1d4dc',
    },
    grid: {
        vertLines: {
            color: 'rgba(255, 255, 255, 0.1)',
        },
        horzLines: {
            color: 'rgba(255, 255, 255, 0.1)',
        },
    },
    crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal,
    },
    rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        timeVisible: true,
    },
});

// Add candlestick series
const candleSeries = chart.addCandlestickSeries({
    upColor: '#00ff9d',
    downColor: '#ff3b6b',
    borderDownColor: '#ff3b6b',
    borderUpColor: '#00ff9d',
    wickDownColor: '#ff3b6b',
    wickUpColor: '#00ff9d',
});

// Add volume series (optional)
const volumeSeries = chart.addHistogramSeries({
    color: '#3a7bd5',
    priceFormat: {
        type: 'volume',
    },
    priceScaleId: '',
    scaleMargins: {
        top: 0.8,
        bottom: 0,
    },
});

// Initial data (empty)
let currentData = [];

// UI Elements
const symbolSelect = document.getElementById('symbol');
const updateButton = document.getElementById('updateChart');
const intervalButtons = document.querySelectorAll('.interval-buttons button');
const currentPriceEl = document.getElementById('currentPrice');
const priceChangeEl = document.getElementById('priceChange');
const connectionStatusEl = document.getElementById('connectionStatus');

// Current symbol and interval
let currentSymbol = 'BTCUSDT';
let currentInterval = '1h';

// Set active interval button
function setActiveInterval(interval) {
    intervalButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.interval === interval) {
            btn.classList.add('active');
        }
    });
}

// Update chart with new data
function updateChart(data) {
    candleSeries.setData(data.candles);
    if (data.volume) {
        volumeSeries.setData(data.volume);
    }
    
    // Update price display
    if (data.candles.length > 0) {
        const latestCandle = data.candles[data.candles.length - 1];
        const price = latestCandle.close;
        currentPriceEl.textContent = `$${parseFloat(price).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 8
        })}`;
        
        // Calculate 24h change (simplified)
        if (data.candles.length > 24) {
            const prevCandle = data.candles[data.candles.length - 25];
            const change = ((latestCandle.close - prevCandle.close) / prevCandle.close * 100).toFixed(2);
            const changeClass = change >= 0 ? 'positive' : 'negative';
            priceChangeEl.innerHTML = `24h Change: <span class="${changeClass}">${change}%</span>`;
        }
    }
}

// Handle symbol change
symbolSelect.addEventListener('change', () => {
    currentSymbol = symbolSelect.value;
    loadHistoricalData();
});

// Handle interval change
intervalButtons.forEach(button => {
    button.addEventListener('click', () => {
        currentInterval = button.dataset.interval;
        setActiveInterval(currentInterval);
        loadHistoricalData();
    });
});

// Update button
updateButton.addEventListener('click', loadHistoricalData);

// Initial setup
setActiveInterval('1h');
loadHistoricalData();

// Handle window resize
window.addEventListener('resize', () => {
    chart.applyOptions({
        width: chartContainer.clientWidth,
    });
});