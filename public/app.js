// Initialize Chart
const chartContainer = document.getElementById('chart');

// Check if element exists
if (!chartContainer) {
    console.error('Chart container not found!');
    // Create one as fallback
    const fallbackDiv = document.createElement('div');
    fallbackDiv.id = 'chart';
    fallbackDiv.style.width = '100%';
    fallbackDiv.style.height = '500px';
    document.body.appendChild(fallbackDiv);
}

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

// Sample data (temporary until Binance API loads)
const sampleData = [
    { time: '2023-10-01', open: 45000, high: 46000, low: 44500, close: 45500 },
    { time: '2023-10-02', open: 45500, high: 47000, low: 45300, close: 46500 },
    { time: '2023-10-03', open: 46500, high: 47500, low: 46000, close: 47000 },
    { time: '2023-10-04', open: 47000, high: 48000, low: 46800, close: 47500 },
    { time: '2023-10-05', open: 47500, high: 48500, low: 47000, close: 48000 },
    { time: '2023-10-06', open: 48000, high: 49000, low: 47500, close: 48500 },
    { time: '2023-10-07', open: 48500, high: 49500, low: 48000, close: 49000 },
    { time: '2023-10-08', open: 49000, high: 50000, low: 48500, close: 49500 },
    { time: '2023-10-09', open: 49500, high: 50500, low: 49000, close: 50000 },
    { time: '2023-10-10', open: 50000, high: 51000, low: 49500, close: 50500 },
];

candleSeries.setData(sampleData);

// Add a simple line series for moving average
const lineSeries = chart.addLineSeries({
    color: '#3a7bd5',
    lineWidth: 2,
    lineStyle: 0, // 0 = solid, 1 = dotted, 2 = dashed
});

const maData = sampleData.map((candle, index) => {
    const avg = sampleData
        .slice(Math.max(0, index - 2), index + 1)
        .reduce((sum, c) => sum + c.close, 0) / Math.min(3, index + 1);
    
    return {
        time: candle.time,
        value: avg
    };
});

lineSeries.setData(maData);

// Handle window resize
window.addEventListener('resize', () => {
    chart.applyOptions({
        width: chartContainer.clientWidth,
    });
});

// Add loading message
console.log('Chart initialized successfully!');
