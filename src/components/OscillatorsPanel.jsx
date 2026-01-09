import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import { useChartStore } from '../store/chartStore';
import {
  calculateRSI,
  calculateMACD,
  calculateOBV,
  calculateStochRSI,
} from '../utils/chartCalculations';
import '../styles/OscillatorsPanel.css';

const OscillatorsPanel = ({ candleData = [] }) => {
  const rsiChartRef = useRef(null);
  const macdChartRef = useRef(null);
  const stochChartRef = useRef(null);

  const { indicators, theme } = useChartStore();

  // RSI Chart
  useEffect(() => {
    if (!rsiChartRef.current || !candleData.length || !indicators.rsi.enabled) return;

    const chart = createChart(rsiChartRef.current, {
      layout: {
        textColor: theme === 'dark' ? '#d1d5db' : '#1f2937',
        background: { color: theme === 'dark' ? '#0f0f1e' : '#ffffff' },
      },
      width: rsiChartRef.current.clientWidth,
      height: 150,
      timeScale: { timeVisible: false },
    });

    const rsiSeries = chart.addLineSeries({
      color: '#0ea5e9',
      lineWidth: 2,
      title: 'RSI',
    });

    const rsiValues = calculateRSI(candleData, indicators.rsi.period);
    const rsiData = rsiValues
      .map((val, i) => ({ time: candleData[i].time, value: val }))
      .filter((d) => d.value !== null);

    rsiSeries.setData(rsiData);

    // Overbought/Oversold levels
    const overboughtSeries = chart.addLineSeries({
      color: '#ef4444',
      lineWidth: 1,
      lineStyle: 3,
    });

    const oversoldSeries = chart.addLineSeries({
      color: '#10b981',
      lineWidth: 1,
      lineStyle: 3,
    });

    const overboughtData = candleData.map((c) => ({
      time: c.time,
      value: indicators.rsi.overbought,
    }));

    const oversoldData = candleData.map((c) => ({
      time: c.time,
      value: indicators.rsi.oversold,
    }));

    overboughtSeries.setData(overboughtData);
    oversoldSeries.setData(oversoldData);

    chart.priceScale('right').applyOptions({
      scaleMargins: { top: 0.1, bottom: 0.1 },
      min: 0,
      max: 100,
    });

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (rsiChartRef.current) {
        chart.applyOptions({ width: rsiChartRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [candleData, indicators.rsi, theme]);

  // MACD Chart
  useEffect(() => {
    if (!macdChartRef.current || !candleData.length || !indicators.macd.enabled) return;

    const chart = createChart(macdChartRef.current, {
      layout: {
        textColor: theme === 'dark' ? '#d1d5db' : '#1f2937',
        background: { color: theme === 'dark' ? '#0f0f1e' : '#ffffff' },
      },
      width: macdChartRef.current.clientWidth,
      height: 150,
      timeScale: { timeVisible: false },
    });

    const { macd, signal, histogram } = calculateMACD(
      candleData,
      indicators.macd.fast,
      indicators.macd.slow,
      indicators.macd.signal
    );

    // MACD line
    const macdSeries = chart.addLineSeries({
      color: '#0ea5e9',
      lineWidth: 2,
      title: 'MACD',
    });

    const macdData = macd
      .map((val, i) => ({ time: candleData[i].time, value: val }))
      .filter((d) => d.value !== null);

    macdSeries.setData(macdData);

    // Signal line
    const signalSeries = chart.addLineSeries({
      color: '#f59e0b',
      lineWidth: 2,
      title: 'Signal',
    });

    const signalData = signal
      .map((val, i) => ({ time: candleData[i].time, value: val }))
      .filter((d) => d.value !== null);

    signalSeries.setData(signalData);

    // Histogram
    const histogramSeries = chart.addHistogramSeries({
      color: '#6366f1',
      priceFormat: { type: 'price', precision: 4 },
    });

    const histogramData = histogram
      .map((val, i) => ({
        time: candleData[i].time,
        value: val,
        color: val >= 0 ? '#10b981' : '#ef4444',
      }))
      .filter((d) => d.value !== null);

    histogramSeries.setData(histogramData);

    chart.priceScale('right').applyOptions({
      scaleMargins: { top: 0.2, bottom: 0.2 },
    });

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (macdChartRef.current) {
        chart.applyOptions({ width: macdChartRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [candleData, indicators.macd, theme]);

  // Stochastic RSI Chart
  useEffect(() => {
    if (!stochChartRef.current || !candleData.length || !indicators.stochRsi.enabled)
      return;

    const chart = createChart(stochChartRef.current, {
      layout: {
        textColor: theme === 'dark' ? '#d1d5db' : '#1f2937',
        background: { color: theme === 'dark' ? '#0f0f1e' : '#ffffff' },
      },
      width: stochChartRef.current.clientWidth,
      height: 150,
      timeScale: { timeVisible: false },
    });

    const { kLine, dLine } = calculateStochRSI(
      candleData,
      indicators.stochRsi.period,
      indicators.stochRsi.kPeriod,
      indicators.stochRsi.dPeriod
    );

    // K Line
    const kSeries = chart.addLineSeries({
      color: '#0ea5e9',
      lineWidth: 2,
      title: '%K',
    });

    const kData = kLine
      .map((val, i) => ({ time: candleData[i].time, value: val }))
      .filter((d) => d.value !== null);

    kSeries.setData(kData);

    // D Line
    const dSeries = chart.addLineSeries({
      color: '#f59e0b',
      lineWidth: 2,
      title: '%D',
    });

    const dData = dLine
      .map((val, i) => ({ time: candleData[i].time, value: val }))
      .filter((d) => d.value !== null);

    dSeries.setData(dData);

    // Overbought/Oversold
    const overboughtSeries = chart.addLineSeries({
      color: '#ef4444',
      lineWidth: 1,
      lineStyle: 3,
    });

    const oversoldSeries = chart.addLineSeries({
      color: '#10b981',
      lineWidth: 1,
      lineStyle: 3,
    });

    const overboughtData = candleData.map((c) => ({ time: c.time, value: 80 }));
    const oversoldData = candleData.map((c) => ({ time: c.time, value: 20 }));

    overboughtSeries.setData(overboughtData);
    oversoldSeries.setData(oversoldData);

    chart.priceScale('right').applyOptions({
      scaleMargins: { top: 0.1, bottom: 0.1 },
      min: 0,
      max: 100,
    });

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (stochChartRef.current) {
        chart.applyOptions({ width: stochChartRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [candleData, indicators.stochRsi, theme]);

  return (
    <div className={`oscillators-panel ${theme}`}>
      {indicators.rsi.enabled && (
        <div className="oscillator-pane">
          <div className="pane-title">RSI ({indicators.rsi.period})</div>
          <div ref={rsiChartRef} className="oscillator-chart" />
        </div>
      )}

      {indicators.macd.enabled && (
        <div className="oscillator-pane">
          <div className="pane-title">
            MACD ({indicators.macd.fast}, {indicators.macd.slow}, {indicators.macd.signal})
          </div>
          <div ref={macdChartRef} className="oscillator-chart" />
        </div>
      )}

      {indicators.stochRsi.enabled && (
        <div className="oscillator-pane">
          <div className="pane-title">
            Stoch RSI ({indicators.stochRsi.period}, {indicators.stochRsi.kPeriod},{' '}
            {indicators.stochRsi.dPeriod})
          </div>
          <div ref={stochChartRef} className="oscillator-chart" />
        </div>
      )}
    </div>
  );
};

export default OscillatorsPanel;