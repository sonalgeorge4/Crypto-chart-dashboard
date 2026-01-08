// Professional Crypto Chart Dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 ProChart Initializing...');
    
    // Check library
    if (typeof LightweightCharts === 'undefined') {
        document.getElementById('loading').innerHTML = 
            '<div style="color:#ef5350;text-align:center;padding:40px;">' +
            '<i class="fas fa-exclamation-triangle" style="font-size:48px;margin-bottom:20px;"></i>' +
            '<h3>Chart Library Error</h3>' +
            '<p>Please check your internet connection and refresh.</p>' +
            '</div>';
        return;
    }
    
    // Initialize
    const chartContainer = document.getElementById('chart');
    const loadingElement = document.getElementById('loading');
    
    // Hide loading after 1 second
    setTimeout(() => {
        loadingElement.style.display = 'none';
    }, 1000);
    
    // Create professional chart
    const chart = LightweightCharts.createChart(chartContainer, {
        layout: {
            background: { type: 'solid', color: '#131722' },
            textColor: '#d1d4dc',
            fontSize: 12,
        },
        grid: {
            vertLines: { color: '#2a2e39' },
            horzLines: { color: '#2a2e39' },
        },
        crosshair: {
            mode: LightweightCharts.CrosshairMode.Normal,
            vertLine: {
                width: 1,
                color: 'rgba(224, 227, 235, 0.1)',
                style: 0,
            },
            horzLine: {
                color: 'rgba(224, 227, 235, 0.1)',
            },
        },
        rightPriceScale: {
            borderColor: '#2a2e39',
            scaleMargins: {
                top: 0.1,
                bottom: 0.1,
            },
        },
        timeScale: {
            borderColor: '#2a2e39',
            timeVisible: true,
            secondsVisible: false,
            fixLeftEdge: true,
            fixRightEdge: true,
        },
        watermark: {
            color: 'rgba(255, 255, 255, 0.05)',
            visible: true,
            text: 'PROCHART',
            fontSize: 72,
        },
    });
    
    // Candlestick Series
    const candleSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderDownColor: '#ef5350',
        borderUpColor: '#26a69a',
        wickDownColor: '#ef5350',
        wickUpColor: '#26a69a',
    });
    
    // Volume Series (at bottom)
    const volumeSeries = chart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
            type: 'volume',
        },
        priceScaleId: '',
        scaleMargins: {
            top: 0.85,
            bottom: 0,
        },
    });
    
    // Moving Average Series
    const maSeries = chart.addLineSeries({
        color: '#ff9800',
        lineWidth: 2,
        lineStyle: 0,
    });
    
    // Generate professional-looking sample data
    function generateCryptoData() {
        const basePrice = 43000;
        const data = [];
        const volumeData = [];
        const maData = [];
        
        let currentPrice = basePrice;
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        
        for (let i = 100; i >= 0; i--) {
            const time = new Date(now - (i * oneDay));
            const dateStr = time.toISOString().split('T')[0];
            
            // Realistic price movement
            const volatility = 0.02; // 2% daily volatility
            const change = (Math.random() - 0.5) * 2 * volatility * currentPrice;
            const open = currentPrice;
            const close = open + change;
            const high = Math.max(open, close) + Math.random() * volatility * currentPrice;
            const low = Math.min(open, close) - Math.random() * volatility * currentPrice;
            const volume = 500 + Math.random() * 1500;
            
            data.push({
                time: dateStr,
                open: open,
                high: high,
                low: low,
                close: close,
            });
            
            volumeData.push({
                time: dateStr,
                value: volume,
                color: close >= open ? '#26a69a' : '#ef5350',
            });
            
            // Calculate 20-day moving average
            if (i <= 80) {
                let sum = 0;
                for (let j = 0; j < 20; j++) {
                    sum += data[data.length - 1 - j].close;
                }
                const ma = sum / 20;
                maData.push({
                    time: dateStr,
                    value: ma,
                });
            }
            
            currentPrice = close;
        }
        
        return { candles: data, volume: volumeData, ma: maData };
    }
    
    // Load data
    const chartData = generateCryptoData();
    
    candleSeries.setData(chartData.candles);
    volumeSeries.setData(chartData.volume);
    maSeries.setData(chartData.ma);
    
    // Update time display
    function updateTime() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString();
        document.getElementById('currentTime').textContent = timeStr;
        
        // Update price with slight random movement
        const lastCandle = chartData.candles[chartData.candles.length - 1];
        const change = (Math.random() - 0.5) * 50;
        const newPrice = lastCandle.close + change;
        
        const priceElement = document.querySelector('.price');
        const changeElement = document.querySelector('.price-change');
        
        if (priceElement) {
            priceElement.innerHTML = `$${newPrice.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
            
            const changePercent = ((change / lastCandle.close) * 100).toFixed(2);
            const isPositive = change >= 0;
            
            priceElement.className = isPositive ? 'price positive' : 'price negative';
            changeElement.className = isPositive ? 'price-change positive' : 'price-change negative';
            changeElement.textContent = `${isPositive ? '+' : ''}${changePercent}%`;
        }
    }
    
    // Update time every second
    setInterval(updateTime, 1000);
    updateTime();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        chart.applyOptions({
            width: chartContainer.clientWidth,
            height: chartContainer.clientHeight,
        });
    });
    
    // Add drawing tools (basic)
    let crosshairPosition = null;
    
    chart.subscribeCrosshairMove(param => {
        if (param.time) {
            crosshairPosition = param;
            const price = param.seriesPrices.get(candleSeries);
            if (price) {
                // Could show price tooltip here
            }
        }
    });
    
    // Interval button functionality
    document.querySelectorAll('.interval-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.interval-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // In real app, this would fetch new data for the interval
            console.log('Interval changed to:', this.textContent);
        });
    });
    
    // Refresh button
    window.loadRealData = function() {
        loadingElement.style.display = 'flex';
        setTimeout(() => {
            const newData = generateCryptoData();
            candleSeries.setData(newData.candles);
            volumeSeries.setData(newData.volume);
            maSeries.setData(newData.ma);
            loadingElement.style.display = 'none';
            console.log('📊 Chart data refreshed');
        }, 500);
    };
    
    console.log('✅ ProChart initialized successfully');
});
