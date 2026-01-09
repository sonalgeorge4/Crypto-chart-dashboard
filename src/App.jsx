import React, { useState, useRef } from 'react';
import { useChartStore } from './store/chartStore';
import ChartContainer from './components/ChartContainer';
import Toolbar from './components/Toolbar';
import IndicatorsPanel from './components/IndicatorsPanel';
import OscillatorsPanel from './components/OscillatorsPanel';
import DrawingTools from './components/DrawingTools';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  const { theme } = useChartStore();
  const [indicatorsPanelOpen, setIndicatorsPanelOpen] = useState(true);
  const [chartContainerRef, setChartContainerRef] = useState(null);
  const { candleData } = useChartStore();

  return (
    <div className={`app ${theme}`}>
      <Toolbar onOpenIndicators={() => setIndicatorsPanelOpen(true)} />
      
      <div className="chart-wrapper">
        {/* Sidebar (watchlist) */}
        <Sidebar />

        {/* Main Chart Area */}
        <div className="main-chart-area">
          {/* Main Chart */}
          <div ref={setChartContainerRef} className="chart-section">
            <ChartContainer chartRef={chartContainerRef} />
            
            {chartContainerRef && <DrawingTools chartContainerRef={chartContainerRef} />}
          </div>

          {/* Multi-pane Oscillators */}
          <OscillatorsPanel candleData={candleData} />
        </div>

        {/* Indicators Panel (Right Sidebar) */}
        {indicatorsPanelOpen && (
          <IndicatorsPanel
            isOpen={indicatorsPanelOpen}
            onClose={() => setIndicatorsPanelOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;