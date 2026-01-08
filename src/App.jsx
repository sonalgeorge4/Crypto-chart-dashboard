import React, { useEffect, useRef, useState } from 'react'
import './App.css'
import ChartContainer from './components/ChartContainer'
import Toolbar from './components/Toolbar'
import Sidebar from './components/Sidebar'
import IndicatorsPanel from './components/IndicatorsPanel'
import { useChartStore } from './store/chartStore'

function App() {
  const { theme, setTheme, timeFrame, setTimeFrame } = useChartStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize theme
    const savedTheme = localStorage.getItem('chart-theme') || 'dark'
    setTheme(savedTheme)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-tv-bg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-tv-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-tv-text">Loading Professional Charting Platform...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'dark' : 'light'}`}>
      {/* Top Toolbar */}
      <Toolbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />
        
        {/* Main Chart Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChartContainer />
          <IndicatorsPanel />
        </div>
      </div>
    </div>
  )
}

export default App