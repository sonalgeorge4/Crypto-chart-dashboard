import React, { useState } from 'react';
import { useChartStore } from '../store/chartStore';
import '../styles/IndicatorsPanel.css';

const IndicatorsPanel = ({ isOpen, onClose }) => {
  const { indicators, toggleIndicator, updateIndicatorParams, theme } = useChartStore();
  const [expandedIndicator, setExpandedIndicator] = useState(null);

  const indicatorConfigs = {
    sma: {
      label: 'Simple Moving Average (SMA)',
      params: {
        periods: { label: 'Periods', type: 'multi-number', min: 1, max: 500 },
        colors: { label: 'Colors', type: 'color-array' },
      },
    },
    ema: {
      label: 'Exponential Moving Average (EMA)',
      params: {
        periods: { label: 'Periods', type: 'multi-number', min: 1, max: 500 },
        colors: { label: 'Colors', type: 'color-array' },
      },
    },
    rsi: {
      label: 'Relative Strength Index (RSI)',
      params: {
        period: { label: 'Period', type: 'number', min: 1, max: 500, step: 1 },
        overbought: { label: 'Overbought Level', type: 'number', min: 50, max: 100, step: 1 },
        oversold: { label: 'Oversold Level', type: 'number', min: 0, max: 50, step: 1 },
      },
    },
    macd: {
      label: 'MACD',
      params: {
        fast: { label: 'Fast Period', type: 'number', min: 1, max: 100, step: 1 },
        slow: { label: 'Slow Period', type: 'number', min: 1, max: 100, step: 1 },
        signal: { label: 'Signal Period', type: 'number', min: 1, max: 100, step: 1 },
      },
    },
    bollinger: {
      label: 'Bollinger Bands',
      params: {
        period: { label: 'Period', type: 'number', min: 1, max: 200, step: 1 },
        stdDev: { label: 'Std Deviation', type: 'number', min: 0.5, max: 5, step: 0.1 },
      },
    },
    atr: {
      label: 'Average True Range (ATR)',
      params: {
        period: { label: 'Period', type: 'number', min: 1, max: 100, step: 1 },
      },
    },
    volume: {
      label: 'Volume',
      params: {},
    },
    obv: {
      label: 'On-Balance Volume (OBV)',
      params: {},
    },
    stochRsi: {
      label: 'Stochastic RSI',
      params: {
        period: { label: 'RSI Period', type: 'number', min: 1, max: 200, step: 1 },
        kPeriod: { label: 'K Period', type: 'number', min: 1, max: 50, step: 1 },
        dPeriod: { label: 'D Period', type: 'number', min: 1, max: 50, step: 1 },
      },
    },
  };

  const handleToggle = (indicatorName) => {
    toggleIndicator(indicatorName);
  };

  const handleParamChange = (indicatorName, paramName, value) => {
    const params = { [paramName]: value };
    updateIndicatorParams(indicatorName, params);
  };

  const handleColorChange = (indicatorName, colorArray, index, newColor) => {
    const updatedColors = [...colorArray];
    updatedColors[index] = newColor;
    updateIndicatorParams(indicatorName, { colors: updatedColors });
  };

  const handlePeriodAdd = (indicatorName, periods) => {
    const newPeriod = periods[periods.length - 1] + 10;
    updateIndicatorParams(indicatorName, { periods: [...periods, newPeriod] });
  };

  const handlePeriodRemove = (indicatorName, periods, index) => {
    if (periods.length > 1) {
      updateIndicatorParams(indicatorName, {
        periods: periods.filter((_, i) => i !== index),
        colors: indicators[indicatorName].colors.filter((_, i) => i !== index),
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`indicators-panel ${theme}`}>
      <div className="panel-header">
        <h2>Indicators</h2>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="indicators-list">
        {Object.entries(indicatorConfigs).map(([key, config]) => {
          const indicatorData = indicators[key];
          const isExpanded = expandedIndicator === key;

          return (
            <div key={key} className="indicator-item">
              <div className="indicator-header">
                <input
                  type="checkbox"
                  checked={indicatorData.enabled}
                  onChange={() => handleToggle(key)}
                  className="indicator-checkbox"
                />
                <label className="indicator-label">{config.label}</label>
                <button
                  className="expand-btn"
                  onClick={() => setExpandedIndicator(isExpanded ? null : key)}
                >
                  {isExpanded ? '▼' : '▶'}
                </button>
              </div>

              {isExpanded && indicatorData.enabled && (
                <div className="indicator-params">
                  {Object.entries(config.params).map(([paramName, paramConfig]) => {
                    const value = indicatorData[paramName];

                    if (paramConfig.type === 'number') {
                      return (
                        <div key={paramName} className="param-row">
                          <label>{paramConfig.label}</label>
                          <input
                            type="number"
                            min={paramConfig.min}
                            max={paramConfig.max}
                            step={paramConfig.step || 1}
                            value={value}
                            onChange={(e) =>
                              handleParamChange(
                                key,
                                paramName,
                                parseInt(e.target.value)
                              )
                            }
                          />
                        </div>
                      );
                    }

                    if (paramConfig.type === 'multi-number') {
                      return (
                        <div key={paramName} className="param-row">
                          <label>{paramConfig.label}</label>
                          <div className="multi-number-group">
                            {value.map((v, idx) => (
                              <div key={idx} className="multi-input">
                                <input
                                  type="number"
                                  min={paramConfig.min}
                                  max={paramConfig.max}
                                  value={v}
                                  onChange={(e) => {
                                    const updated = [...value];
                                    updated[idx] = parseInt(e.target.value);
                                    handleParamChange(key, paramName, updated);
                                  }}
                                />
                                <button
                                  className="remove-btn"
                                  onClick={() => handlePeriodRemove(key, value, idx)}
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                            <button
                              className="add-btn"
                              onClick={() => handlePeriodAdd(key, value)}
                            >
                              + Add
                            </button>
                          </div>
                        </div>
                      );
                    }

                    if (paramConfig.type === 'color-array') {
                      return (
                        <div key={paramName} className="param-row">
                          <label>{paramConfig.label}</label>
                          <div className="color-group">
                            {value.map((color, idx) => (
                              <input
                                key={idx}
                                type="color"
                                value={color}
                                onChange={(e) =>
                                  handleColorChange(key, value, idx, e.target.value)
                                }
                                title={`Color for period ${indicatorData.periods[idx]}`}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IndicatorsPanel;