// Simple Moving Average (SMA)
export const calculateSMA = (data, period) => {
  if (data.length < period) return []
  
  const smaData = []
  
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close
    }
    
    smaData.push({
      time: data[i].time,
      value: sum / period
    })
  }
  
  return smaData
}

// Exponential Moving Average (EMA)
export const calculateEMA = (data, period) => {
  if (data.length < period) return []
  
  const emaData = []
  const multiplier = 2 / (period + 1)
  
  // Calculate SMA for first EMA value
  let sum = 0
  for (let i = 0; i < period; i++) {
    sum += data[i].close
  }
  let ema = sum / period
  
  emaData.push({
    time: data[period - 1].time,
    value: ema
  })
  
  // Calculate EMA for remaining data
  for (let i = period; i < data.length; i++) {
    ema = (data[i].close - ema) * multiplier + ema
    emaData.push({
      time: data[i].time,
      value: ema
    })
  }
  
  return emaData
}

// Weighted Moving Average (WMA)
export const calculateWMA = (data, period) => {
  if (data.length < period) return []
  
  const wmaData = []
  
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0
    let weightSum = 0
    
    for (let j = 0; j < period; j++) {
      const weight = period - j
      sum += data[i - j].close * weight
      weightSum += weight
    }
    
    wmaData.push({
      time: data[i].time,
      value: sum / weightSum
    })
  }
  
  return wmaData
}

// Hull Moving Average (HMA)
export const calculateHMA = (data, period) => {
  if (data.length < period) return []
  
  // Calculate WMA for half period
  const halfPeriod = Math.floor(period / 2)
  const wmaHalf = calculateWMA(data, halfPeriod)
  
  // Calculate WMA for full period
  const wmaFull = calculateWMA(data, period)
  
  if (wmaHalf.length === 0 || wmaFull.length === 0) return []
  
  // Calculate raw HMA
  const rawHMA = []
  const offset = data.length - wmaHalf.length
  
  for (let i = 0; i < wmaHalf.length; i++) {
    const wmaHalfValue = wmaHalf[i].value
    const wmaFullValue = wmaFull[i + (wmaFull.length - wmaHalf.length)]?.value
    
    if (wmaFullValue !== undefined) {
      rawHMA.push({
        time: wmaHalf[i].time,
        value: 2 * wmaHalfValue - wmaFullValue
      })
    }
  }
  
  // Calculate final HMA with sqrt(period) period
const sqrtPeriod = Math.floor(Math.sqrt(period))
return calculateWMA(  // ← CHANGE TO calculateWMA!
  rawHMA.map(d => ({ time: d.time, close: d.value })),  // Map correctly
  sqrtPeriod
)