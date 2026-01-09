/**
 * Drawing Tools Utilities
 * Functions to handle trendlines, rectangles, fibonacci, etc.
 */

export class DrawingManager {
  constructor() {
    this.drawings = [];
    this.activeDrawing = null;
    this.isDrawing = false;
  }

  // Trendline: draws a line between two points
  addTrendline(point1, point2, color = '#0ea5e9', width = 2) {
    const trendline = {
      id: Date.now(),
      type: 'trendline',
      points: [point1, point2],
      color,
      width,
      createdAt: new Date(),
    };
    this.drawings.push(trendline);
    return trendline.id;
  }

  // Rectangle: draws a rectangle between two corners
  addRectangle(topLeft, bottomRight, color = '#0ea5e9', fillOpacity = 0.1) {
    const rectangle = {
      id: Date.now(),
      type: 'rectangle',
      topLeft,
      bottomRight,
      color,
      fillOpacity,
      createdAt: new Date(),
    };
    this.drawings.push(rectangle);
    return rectangle.id;
  }

  // Horizontal Line: horizontal line at specific price level
  addHorizontalLine(price, color = '#0ea5e9', width = 1, label = '') {
    const horizontalLine = {
      id: Date.now(),
      type: 'horizontalLine',
      price,
      color,
      width,
      label,
      createdAt: new Date(),
    };
    this.drawings.push(horizontalLine);
    return horizontalLine.id;
  }

  // Vertical Line: vertical line at specific time
  addVerticalLine(time, color = '#0ea5e9', width = 1, label = '') {
    const verticalLine = {
      id: Date.now(),
      type: 'verticalLine',
      time,
      color,
      width,
      label,
      createdAt: new Date(),
    };
    this.drawings.push(verticalLine);
    return verticalLine.id;
  }

  // Fibonacci Retracement
  addFibonacciRetracement(highPrice, lowPrice, color = '#ff6b6b') {
    const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1.0];
    const fib = {
      id: Date.now(),
      type: 'fibonacciRetracement',
      highPrice,
      lowPrice,
      levels: levels.map((level) => ({
        level,
        price: lowPrice + (highPrice - lowPrice) * level,
      })),
      color,
      createdAt: new Date(),
    };
    this.drawings.push(fib);
    return fib.id;
  }

  // Text Annotation
  addText(position, text, color = '#ffffff', fontSize = 12) {
    const textAnnotation = {
      id: Date.now(),
      type: 'text',
      position,
      text,
      color,
      fontSize,
      createdAt: new Date(),
    };
    this.drawings.push(textAnnotation);
    return textAnnotation.id;
  }

  // Arrow
  addArrow(fromPoint, toPoint, color = '#0ea5e9', width = 2) {
    const arrow = {
      id: Date.now(),
      type: 'arrow',
      fromPoint,
      toPoint,
      color,
      width,
      createdAt: new Date(),
    };
    this.drawings.push(arrow);
    return arrow.id;
  }

  // Get all drawings
  getDrawings() {
    return this.drawings;
  }

  // Get drawings by type
  getDrawingsByType(type) {
    return this.drawings.filter((d) => d.type === type);
  }

  // Remove drawing
  removeDrawing(id) {
    this.drawings = this.drawings.filter((d) => d.id !== id);
  }

  // Clear all drawings
  clearAll() {
    this.drawings = [];
  }

  // Update drawing
  updateDrawing(id, updates) {
    const index = this.drawings.findIndex((d) => d.id === id);
    if (index !== -1) {
      this.drawings[index] = { ...this.drawings[index], ...updates };
    }
  }

  // Export drawings
  exportDrawings() {
    return JSON.stringify(this.drawings);
  }

  // Import drawings
  importDrawings(json) {
    try {
      this.drawings = JSON.parse(json);
    } catch (error) {
      console.error('Error importing drawings:', error);
    }
  }
}

/**
 * Calculate distance between two points
 */
export const calculateDistance = (p1, p2) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

/**
 * Calculate angle between two points
 */
export const calculateAngle = (p1, p2) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return (Math.atan2(dy, dx) * 180) / Math.PI;
};

/**
 * Check if point is inside rectangle
 */
export const isPointInRectangle = (point, topLeft, bottomRight) => {
  return (
    point.x >= topLeft.x &&
    point.x <= bottomRight.x &&
    point.y >= topLeft.y &&
    point.y <= bottomRight.y
  );
};

export default DrawingManager;