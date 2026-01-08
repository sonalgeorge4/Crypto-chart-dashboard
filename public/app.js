// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, initializing chart...');
    
    // Check if LightweightCharts is loaded
    if (typeof LightweightCharts === 'undefined') {
        console.error('LightweightCharts library not loaded!');
        document.body.innerHTML += '<p style="color:red;text-align:center;">Error: Chart library failed to load. Check CDN URL.</p>';
        return;
    }
    
    console.log('LightweightCharts loaded:', LightweightCharts);
    
    // Get chart container
    const chartContainer = document.getElementById('chart');
    if (!chartContainer) {
        console.error('Chart container not found!');
        return;
    }
    
    // Create chart
    const chart = LightweightCharts.createChart(chartContainer, {
        width: chartContainer.clientWidth,
        height: 400,
        layout: {
            backgroundColor: '#0f2027',
            textColor: '#d1d4dc',
        }
    });
    
    console.log('Chart created successfully');
    
    // Add candlestick series
    const candleSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
    });
    
    console.log('Candlestick series added');
    
    // Add sample data
    const sampleData = [
        { time: '2023-01-01', open: 100, high: 110, low: 95, close: 105 },
        { time: '2023-01-02', open: 105, high: 115, low: 100, close: 110 },
        { time: '2023-01-03', open: 110, high: 120, low: 105, close: 115 },
        { time: '2023-01-04', open: 115, high: 125, low: 110, close: 120 },
        { time: '2023-01-05', open: 120, high: 130, low: 115, close: 125 },
        { time: '2023-01-06', open: 125, high: 135, low: 120, close: 130 },
        { time: '2023-01-07', open: 130, high: 140, low: 125, close: 135 },
        { time: '2023-01-08', open: 135, high: 145, low: 130, close: 140 },
        { time: '2023-01-09', open: 140, high: 150, low: 135, close: 145 },
        { time: '2023-01-10', open: 145, high: 155, low: 140, close: 150 },
    ];
    
    candleSeries.setData(sampleData);
    console.log('Sample data loaded');
    
    // Add a simple line
    const lineSeries = chart.addLineSeries({
        color: '#2962FF',
        lineWidth: 2,
    });
    
    const lineData = sampleData.map(item => ({
        time: item.time,
        value: (item.open + item.close) / 2
    }));
    
    lineSeries.setData(lineData);
    
    // Success message
    document.querySelector('p').textContent = 'Chart loaded successfully!';
});
