import React, { useEffect, useRef, useState } from 'react'
import { createChart } from 'lightweight-charts'
import { useChartStore } from '../store/chartStore'
import { subscribeToBinanceWebSocket, fetchHistoricalData } from '../utils/binanceWebSocket'
import { calculateSMA, calculateEMA } from '../indicators/movingAverages'

const ChartContainer = () => {
  const chartContainerRef = useRef(null)
  const chartRef = useRef(null)
  const candleSeriesRef = useRef(null)
  const volumeSeriesRef = useRef(null)
  
  const {
    chartInstance,
    setChartInstance,
    addSeriesInstance,
    theme,
    timeFrame,
    chartType,
    symbol,
    activeIndicators,
    candles,
    updateCandles
  } = useChartStore()

  useEffect(() => {
    // Initialize chart
    if (!chartContainerRef.current || chartRef.current) return

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { type: 'solid', color: theme === 'dark' ? '#131722' : '#ffffff' },
        textColor: theme === 'dark' ? '#d1d4dc' : '#333333',
        fontSize: 12,
      },
      grid: {
        vertLines: { 
          color: theme === 'dark' ? '#2a2e39' : '#e0e3eb',
          style: 1 
        },
        horzLines: { 
          color: theme === 'dark' ? '#2a2e39' : '#e0e3eb',
          style: 1 
        },
      },
      crosshair: {
        mode: 1, // Normal mode
        vertLine: {
          width: 1,
          color: theme === 'dark' ? 'rgba(224, 227, 235, 0.1)' : 'rgba(224, 227, 235, 0.8)',
          style: 3, // Dashed
        },
        horzLine: {
          color: theme === 'dark' ? 'rgba(224, 227, 235, 0.1)' : 'rgba(224, 227, 235, 0.8)',
        },
      },
      rightPriceScale: {
        borderColor: theme === 'dark' ? '#2a2e39' : '#e0e3eb',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      timeScale: {
        borderColor: theme === 'dark' ? '#2a2e39' : '#e0e3eb',
        timeVisible: true,
        secondsVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      watermark: {
        color: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        visible: true,
        text: 'TRADINGVIEW CLONE',
        fontSize: 72,
        fontFamily: 'Inter',
      },
    })

    chartRef.current = chart
    setChartInstance(chart)

    // Create candlestick series
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderDownColor: '#ef5350',
      borderUpColor: '#26a69a',
      wickDownColor: '#ef5350',
      wickUpColor: '#26a69a',
    })
    candleSeriesRef.current = candleSeries
    addSeriesInstance('candles', candleSeries)

    // Create volume series
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
    })
    volumeSeriesRef.current = volumeSeries
    addSeriesInstance('volume', volumeSeries)

    // Load initial data
    loadInitialData()

    // Handle resize
    const handleResize = () => {
      if (chart && chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (chartRef.current) {
        chartRef.current.remove()
        chartRef.current = null
      }
    }
  }, [theme])

  useEffect(() => {
    // Update chart theme
    if (chartRef.current) {
      chartRef.current.applyOptions({
        layout: {
          background: { type: 'solid', color: theme === 'dark' ? '#131722' : '#ffffff' },
          textColor: theme === 'dark' ? '#d1d4dc' : '#333333',
        },
        grid: {
          vertLines: { color: theme === 'dark' ? '#2a2e39' : '#e0e3eb' },
          horzLines: { color: theme === 'dark' ? '#2a2e39' : '#e0e3eb' },
        },
      })
    }
  }, [theme])

  const loadInitialData = async () => {
    try {
      const data = await fetchHistoricalData(symbol, timeFrame, 500)
      const formattedCandles = data.map(c => ({
        time: c.time / 1000,
        open: parseFloat(c.open),
        high: parseFloat(c.high),
        low: parseFloat(c.low),
        close: parseFloat(c.close),
      }))
      
      const formattedVolume = data.map(c => ({
        time: c.time / 1000,
        value: parseFloat(c.volume),
        color: parseFloat(c.close) >= parseFloat(c.open) ? '#26a69a' : '#ef5350',
      }))

      updateCandles(formattedCandles)
      candleSeriesRef.current.setData(formattedCandles)
      volumeSeriesRef.current.setData(formattedVolume)

      // Calculate and add indicators
      updateIndicators(formattedCandles)

      // Subscribe to real-time updates
      subscribeToBinanceWebSocket(symbol, timeFrame, handleNewCandle)

    } catch (error) {
      console.error('Error loading data:', error)
      // Fallback to sample data
      loadSampleData()
    }
  }

  const loadSampleData = () => {
    const sampleCandles = []
    const sampleVolume = []
    let price = 43000
    const now = Math.floor(Date.now() / 1000)
    
    for (let i = 500; i >= 0; i--) {
      const change = (Math.random() - 0.5) * 1000
      const open = price
      const close = open + change
      const high = Math.max(open, close) + Math.random() * 500
      const low = Math.min(open, close) - Math.random() * 500
      
      sampleCandles.push({
        time: now - (i * 3600),
        open,
        high,
        low,
        close,
      })
      
      sampleVolume.push({
        time: now - (i * 3600),
        value: Math.random() * 1000 + 500,
        color: close >= open ? '#26a69a' : '#ef5350',
      })
      
      price = close
    }
    
    updateCandles(sampleCandles)
    candleSeriesRef.current.setData(sampleCandles)
    volumeSeriesRef.current.setData(sampleVolume)
    updateIndicators(sampleCandles)
  }

  const handleNewCandle = (newCandle) => {
    const formattedCandle = {
      time: newCandle.t / 1000,
      open: parseFloat(newCandle.o),
      high: parseFloat(newCandle.h),
      low: parseFloat(newCandle.l),
      close: parseFloat(newCandle.c),
    }
    
    const formattedVolume = {
      time: newCandle.t / 1000,
      value: parseFloat(newCandle.v),
      color: parseFloat(newCandle.c) >= parseFloat(newCandle.o) ? '#26a69a' : '#ef5350',
    }
    
    // Update series
    candleSeriesRef.current.update(formattedCandle)
    volumeSeriesRef.current.update(formattedVolume)
    
    // Update store
    const updatedCandles = [...candles.slice(0, -1), formattedCandle]
    updateCandles(updatedCandles)
    
    // Update indicators
    updateIndicators(updatedCandles)
  }

  const updateIndicators = (candleData) => {
    activeIndicators.forEach(indicator => {
      if (!indicator.visible) return
      
      switch (indicator.type) {
        case 'sma':
          const smaData = calculateSMA(candleData, indicator.period)
          updateIndicatorSeries(`sma_${indicator.period}`, smaData, {
            color: indicator.color || '#ff9800',
            lineWidth: 2,
          })
          break
          
        case 'ema':
          const emaData = calculateEMA(candleData, indicator.period)
          updateIndicatorSeries(`ema_${indicator.period}`, emaData, {
            color: indicator.color || '#2962ff',
            lineWidth: 2,
          })
          break
          
        // Add more indicators here
      }
    })
  }

  const updateIndicatorSeries = (id, data, options) => {
    if (!chartRef.current) return
    
    let series = useChartStore.getState().seriesInstances[id]
    
    if (!series) {
      series = chartRef.current.addLineSeries(options)
      addSeriesInstance(id, series)
    }
    
    series.setData(data)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-tv-border">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-tv-text">{symbol.replace('USDT', '/USDT')}</h2>
          <div className="text-tv-green text-lg font-bold">
            {candles.length > 0 ? `$${candles[candles.length - 1].close.toLocaleString()}` : 'Loading...'}
          </div>
          <div className="text-sm text-tv-text-secondary">
            {timeFrame.toUpperCase()} • {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
      
      <div ref={chartContainerRef} className="flex-1 relative">
        {/* Chart will be rendered here by Lightweight Charts */}
      </div>
    </div>
  )
}

export default ChartContainer