// Initialize Chart
const chartContainer = document.getElementById('chart');
const chart = LightweightCharts.createChart(chartContainer, {
    width: chartContainer.clientWidth,
    height: 500,
    layout: {
        backgroundColor: '#0f2027',
        textColor: '#d1d4dc',
    }
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

// Sample data (temporary)
const sampleData = [
    { time: '2023-10-01', open: 45000, high: 46000, low: 44500, close: 45500 },
    { time: '2023-10-02', open: 45500, high: 47000, low: 45300, close: 46500 },
    { time: '2023-10-03', open: 46500, high: 47500, low: 46000, close: 47000 },
    { time: '2023-10-04', open: 47000, high: 48000, low: 46800, close: 47500 },
    { time: '2023-10-05', open: 47500, high: 48500, low: 47000, close: 48000 },
];

candleSeries.setData(sampleData);
