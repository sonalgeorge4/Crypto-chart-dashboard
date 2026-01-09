import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { useChartStore } from '../store/chartStore';
import {
  calculateSMA,
  calculateEMA,
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
  calculateATR,
  calculateOBV,
  calculateVWAP,
  calculateSuperTrend,
} from '../utils/chartCalculations';
import { connectBinanceWebSocket, fetchHistoricalData } from '../utils/binanceWebSocket';
import '../styles/ChartContainer.css';

const ChartContainer = () => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const indicatorSeriesRef = useRef({});
  const wsRef = useRef(null);

  const {
    candleData,
    symbol,
    timeframe,
    indicators,
    theme,
    setCandleData,
    addCandle,
    updateLatestCandle,
  } = useChartStore();

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        textColor: theme === 'dark' ? '#d1d5db' : '#1f2937',
        background: { color: theme === 'dark' ? '#1a1a2e' : '#ffffff' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 600,
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
    });

    chartRef.current = chart;

    // Candlestick series
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });
    candleSeriesRef.current = candleSeries;

    // Volume series
    const volumeSeries = chart.addHistogramSeries({
      color: '#1e88e5',
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
    });
    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });
    volumeSeriesRef.current = volumeSeries;

    chart.priceScale('left').applyOptions({
      scaleMargins: { top: 0.1, bottom: 0.25 },
    });

    return () => {
      chart.remove();
    };
  }, [theme]);

  // Load historical data & connect WebSocket
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log(`Loading ${symbol} ${timeframe}...`);
        const historicalData = await fetchHistoricalData(symbol, timeframe, 500);
        setCandleData(historicalData);

        // Set chart data
        const candleData = historicalData.map((c) => ({
          time: c.time,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        }));

        const volumeData = historicalData.map((c) => ({
          time: c.time,
          value: c.volume,
          color: c.close >= c.open ? '#26a69a' : '#ef5350',
        }));

        candleSeriesRef.current?.setData(candleData);
        volumeSeriesRef.current?.setData(volumeData);

        // Auto-scale
        chartRef.current?.timeScale().fitContent();
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [symbol, timeframe, setCandleData]);

  // Render indicators
  useEffect(() => {
    if (!chartRef.current || !candleSeriesRef.current || candleData.length === 0) return;

    // Remove old indicator series
    Object.values(indicatorSeriesRef.current).forEach((series) => {
      chartRef.current?.removeSeries(series);
    });
    indicatorSeriesRef.current = {};

    // SMA
    if (indicators.sma.enabled) {
      indicators.sma.periods.forEach((period, idx) => {
        const smaValues = calculateSMA(candleData, period);
        const smaData = smaValues
          .map((val, i) => ({ time: candleData[i].time, value: val }))
          .filter((d) => d.value !== null);

        const series = chartRef.current.addLineSeries({
          color: indicators.sma.colors[idx],
          lineWidth: 2,
          title: `SMA ${period}`,
        });
        series.setData(smaData);
        indicatorSeriesRef.current[`sma_${period}`] = series;
      });
    }

    // EMA
    if (indicators.ema.enabled) {
      indicators.ema.periods.forEach((period, idx) => {
        const emaValues = calculateEMA(candleData, period);
        const emaData = emaValues
          .map((val, i) => ({ time: candleData[i].time, value: val }))
          .filter((d) => d.value !== null);

        const series = chartRef.current.addLineSeries({
          color: indicators.ema.colors[idx],
          lineWidth: 2,
          lineStyle: 2,
          title: `EMA ${period}`,
        });
        series.setData(emaData);
        indicatorSeriesRef.current[`ema_${period}`] = series;
      });
    }

    // Bollinger Bands
    if (indicators.bollinger.enabled) {
      const bb = calculateBollingerBands(candleData, indicators.bollinger.period, indicators.bollinger.stdDev);
      
      const upperData = bb.upper
        .map((val, i) => ({ time: candleData[i].time, value: val }))
        .filter((d) => d.value !== null);
      const lowerData = bb.lower
        .map((val, i) => ({ time: candleData[i].time, value: val }))
        .filter((d) => d.value !== null);

      const upperSeries = chartRef.current.addLineSeries({
        color: '#ff6b6b',
        lineWidth: 1,
        lineStyle: 3,
        title: 'BB Upper',
      });
      upperSeries.setData(upperData);
      indicatorSeriesRef.current.bb_upper = upperSeries;

      const lowerSeries = chartRef.current.addLineSeries({
        color: '#ff6b6b',
        lineWidth: 1,
        lineStyle: 3,
        title: 'BB Lower',
      });
      lowerSeries.setData(lowerData);
      indicatorSeriesRef.current.bb_lower = lowerSeries;
    }

    // SuperTrend
    if (indicators.atr.enabled) {
      const st = calculateSuperTrend(candleData, 10, 3);
      const trendData = st.trend
        .map((val, i) => ({ time: candleData[i].time, value: val }))
        .filter((d) => d.value !== null);

      const series = chartRef.current.addLineSeries({
        color: '#fbbf24',
        lineWidth: 2,
        title: 'SuperTrend',
      });
      series.setData(trendData);
      indicatorSeriesRef.current.supertrend = series;
    }

    // VWAP
    if (indicators.volume.enabled && false) { // Hidden VWAP for now
      const vwapValues = calculateVWAP(candleData);
      const vwapData = vwapValues
        .map((val, i) => ({ time: candleData[i].time, value: val }))
        .filter((d) => d.value !== null);

      const series = chartRef.current.addLineSeries({
        color: '#a78bfa',
        lineWidth: 2,
        title: 'VWAP',
      });
      series.setData(vwapData);
      indicatorSeriesRef.current.vwap = series;
    }
  }, [candleData, indicators]);

  // Connect WebSocket for live updates
  useEffect(() => {
    const setupWebSocket = async () => {
      try {
        await connectBinanceWebSocket(symbol, timeframe, (candle) => {
          addCandle(candle);

          // Update chart
          const candleData = {
            time: candle.time,
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
          };

          const volumeData = {
            time: candle.time,
            value: candle.volume,
            color: candle.close >= candle.open ? '#26a69a' : '#ef5350',
          };

          candleSeriesRef.current?.update(candleData);
          volumeSeriesRef.current?.update(volumeData);
        });
      } catch (error) {
        console.error('WebSocket setup error:', error);
      }
    };

    setupWebSocket();

    return () => {
      // Disconnect is handled in the utility
    };
  }, [symbol, timeframe, addCandle]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <div ref={chartContainerRef} className="chart-container" />;
};

export default ChartContainer;