import React, { useState, useEffect } from 'react';
import { useChartStore } from '../store/chartStore';
import { DrawingManager } from '../utils/drawingUtils';
import '../styles/DrawingTools.css';

const DrawingTools = ({ chartContainerRef }) => {
  const { drawingTools, toggleDrawingTool, theme } = useChartStore();
  const [drawingManager] = useState(new DrawingManager());
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [activeTool, setActiveTool] = useState(null);
  const [drawingColor, setDrawingColor] = useState('#0ea5e9');
  const [drawingWidth, setDrawingWidth] = useState(2);
  const [drawings, setDrawings] = useState([]);

  // Canvas setup for drawing
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'drawing-canvas';
    canvas.style.position = 'absolute';
    canvas.style.cursor = 'crosshair';
    canvas.style.zIndex = '10';
    chartContainerRef.current.appendChild(canvas);

    const resizeCanvas = () => {
      const rect = chartContainerRef.current.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const ctx = canvas.getContext('2d');

    const handleMouseDown = (e) => {
      if (!activeTool) return;

      const rect = canvas.getBoundingClientRect();
      const point = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        price: null, // Would need chart context to calculate
        time: null,
      };

      setIsDrawing(true);
      setStartPoint(point);
    };

    const handleMouseMove = (e) => {
      if (!isDrawing || !startPoint || !activeTool) return;

      const rect = canvas.getBoundingClientRect();
      const currentPoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      // Redraw canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      redrawDrawings(ctx, drawings);

      // Draw preview
      drawPreview(ctx, activeTool, startPoint, currentPoint);
    };

    const handleMouseUp = (e) => {
      if (!isDrawing || !startPoint || !activeTool) return;

      const rect = canvas.getBoundingClientRect();
      const endPoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      // Add drawing based on tool
      addDrawing(activeTool, startPoint, endPoint);

      setIsDrawing(false);
      setStartPoint(null);
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', resizeCanvas);
      canvas.remove();
    };
  }, [chartContainerRef, activeTool, isDrawing, startPoint, drawings]);

  const drawPreview = (ctx, tool, start, end) => {
    ctx.strokeStyle = drawingColor;
    ctx.lineWidth = drawingWidth;
    ctx.setLineDash([5, 5]);

    switch (tool) {
      case 'trendline':
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        break;

      case 'rectangle':
        ctx.strokeRect(
          start.x,
          start.y,
          end.x - start.x,
          end.y - start.y
        );
        ctx.fillStyle = `${drawingColor}20`;
        ctx.fillRect(
          start.x,
          start.y,
          end.x - start.x,
          end.y - start.y
        );
        break;

      case 'horizontalLine':
        ctx.beginPath();
        ctx.moveTo(0, start.y);
        ctx.lineTo(ctx.canvas.width, start.y);
        ctx.stroke();
        break;

      case 'verticalLine':
        ctx.beginPath();
        ctx.moveTo(start.x, 0);
        ctx.lineTo(start.x, ctx.canvas.height);
        ctx.stroke();
        break;

      default:
        break;
    }

    ctx.setLineDash([]);
  };

  const redrawDrawings = (ctx, drawingsList) => {
    drawingsList.forEach((drawing) => {
      ctx.strokeStyle = drawing.color;
      ctx.lineWidth = drawing.width || 2;

      switch (drawing.type) {
        case 'trendline':
          ctx.beginPath();
          ctx.moveTo(drawing.points[0].x, drawing.points[0].y);
          ctx.lineTo(drawing.points[1].x, drawing.points[1].y);
          ctx.stroke();
          break;

        case 'rectangle':
          ctx.strokeRect(
            drawing.topLeft.x,
            drawing.topLeft.y,
            drawing.bottomRight.x - drawing.topLeft.x,
            drawing.bottomRight.y - drawing.topLeft.y
          );
          break;

        case 'horizontalLine':
          ctx.beginPath();
          ctx.moveTo(0, drawing.y);
          ctx.lineTo(ctx.canvas.width, drawing.y);
          ctx.stroke();
          break;

        case 'verticalLine':
          ctx.beginPath();
          ctx.moveTo(drawing.x, 0);
          ctx.lineTo(drawing.x, ctx.canvas.height);
          ctx.stroke();
          break;

        default:
          break;
      }
    });
  };

  const addDrawing = (tool, start, end) => {
    let newDrawing;

    switch (tool) {
      case 'trendline':
        newDrawing = drawingManager.addTrendline(start, end, drawingColor, drawingWidth);
        break;

      case 'rectangle':
        newDrawing = drawingManager.addRectangle(start, end, drawingColor);
        break;

      case 'horizontalLine':
        newDrawing = drawingManager.addHorizontalLine(start.y, drawingColor, drawingWidth);
        break;

      case 'verticalLine':
        newDrawing = drawingManager.addVerticalLine(start.x, drawingColor, drawingWidth);
        break;

      default:
        return;
    }

    setDrawings(drawingManager.getDrawings());
  };

  const handleToolToggle = (tool) => {
    if (activeTool === tool) {
      setActiveTool(null);
      toggleDrawingTool(tool);
    } else {
      setActiveTool(tool);
      toggleDrawingTool(tool);
    }
  };

  const clearAllDrawings = () => {
    if (confirm('Clear all drawings?')) {
      drawingManager.clearAll();
      setDrawings([]);
    }
  };

  return (
    <div className={`drawing-tools ${theme}`}>
      <div className="drawing-tools-header">
        <h4>Drawing Tools</h4>
        <button className="clear-btn" onClick={clearAllDrawings} title="Clear all">
          🗑️
        </button>
      </div>

      <div className="drawing-tools-grid">
        {[
          { tool: 'trendline', label: 'Trend Line', icon: '📏' },
          { tool: 'rectangle', label: 'Rectangle', icon: '▭' },
          { tool: 'horizontalLine', label: 'Horizontal', icon: '—' },
          { tool: 'verticalLine', label: 'Vertical', icon: '|' },
        ].map(({ tool, label, icon }) => (
          <button
            key={tool}
            className={`drawing-tool-btn ${activeTool === tool ? 'active' : ''}`}
            onClick={() => handleToolToggle(tool)}
            title={label}
          >
            {icon}
          </button>
        ))}
      </div>

      <div className="drawing-options">
        <div className="option-row">
          <label>Color:</label>
          <input
            type="color"
            value={drawingColor}
            onChange={(e) => setDrawingColor(e.target.value)}
          />
        </div>

        <div className="option-row">
          <label>Width:</label>
          <input
            type="range"
            min="1"
            max="5"
            value={drawingWidth}
            onChange={(e) => setDrawingWidth(parseInt(e.target.value))}
          />
          <span>{drawingWidth}px</span>
        </div>
      </div>

      <div className="drawings-list">
        <h5>Drawings ({drawings.length})</h5>
        {drawings.length === 0 ? (
          <p className="empty-text">No drawings yet</p>
        ) : (
          drawings.map((drawing) => (
            <div key={drawing.id} className="drawing-item">
              <span className="drawing-type">{drawing.type}</span>
              <button
                className="remove-drawing"
                onClick={() => {
                  drawingManager.removeDrawing(drawing.id);
                  setDrawings(drawingManager.getDrawings());
                }}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DrawingTools;