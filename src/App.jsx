import React, { useState } from 'react';
import { useChartStore } from './store/chartStore';
import ChartContainer from './components/ChartContainer';
import Toolbar from './components/Toolbar';
import IndicatorsPanel from './components/IndicatorsPanel';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  const { theme, showSettings } = useChartStore();
  const [indicatorsPanelOpen, setIndicatorsPanelOpen] = useState(true);

  return (
    <div className={`app ${theme}`}>
      <Toolbar onOpenIndicators={() => setIndicatorsPanelOpen(true)} />
      
      <div className="chart-wrapper">
        {/* Sidebar (future: watchlist, screener) */}
        <Sidebar />

        {/* Main Chart */}
        <ChartContainer />

        {/* Indicators Panel */}
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