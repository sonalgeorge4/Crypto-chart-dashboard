# ✅ Complete Installation Checklist

Follow this **step-by-step** to set up the entire project from scratch.

---

## 📋 Prerequisites Checklist

- [ ] Node.js 16+ installed (`node -v`)
- [ ] npm 8+ installed (`npm -v`)
- [ ] Git installed (`git -v`)
- [ ] GitHub account (optional, for version control)
- [ ] Code editor (VS Code recommended)

---

## 📁 Project Setup

### Step 1: Create Project Directory

```bash
mkdir crypto-chart-dashboard
cd crypto-chart-dashboard
```

- [ ] Directory created
- [ ] Terminal in correct directory

### Step 2: Initialize Git (Optional but Recommended)

```bash
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

- [ ] Git initialized
- [ ] User configured

### Step 3: Create Base Files

#### `package.json`
```json
{
  "name": "crypto-chart-dashboard",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "start": "vite preview --port 5173"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.4.1",
    "lightweight-charts": "^4.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  },
  "engines": {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  }
}
```

- [ ] `package.json` created in root

#### `vite.config.js`
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
```

- [ ] `vite.config.js` created in root

#### `index.html`
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Crypto Chart Dashboard</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] `index.html` created in root

#### `.gitignore`
```
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
```

- [ ] `.gitignore` created in root

### Step 4: Install Dependencies

```bash
npm install
```

Wait for installation to complete...

- [ ] All packages installed
- [ ] `node_modules/` folder created
- [ ] `package-lock.json` created

---

## 📂 Create Folder Structure

```bash
mkdir -p src/store
mkdir -p src/components
mkdir -p src/utils
mkdir -p src/chartTypes
mkdir -p src/styles
mkdir -p public
```

- [ ] `src/` directory created
- [ ] All subdirectories created
- [ ] `public/` folder created

---

## 📝 Create Source Files

### Core Files

#### `src/main.jsx`
*(Copy from artifact: Step 13)*

- [ ] `main.jsx` created

#### `src/App.jsx`
*(Copy from artifact: Step 8, updated version)*

- [ ] `App.jsx` created

#### `src/App.css`
*(Copy from artifact: Step 7)*

- [ ] `App.css` created

#### `src/index.css`
*(Copy from artifact: Step 14)*

- [ ] `index.css` created

### Store (State Management)

#### `src/store/chartStore.js`
*(Copy from artifact: Step 1)*

- [ ] `chartStore.js` created

### Components

#### `src/components/ChartContainer.jsx`
*(Copy from artifact: Step 4)*

- [ ] `ChartContainer.jsx` created

#### `src/components/Toolbar.jsx`
*(Copy from artifact: Step 5)*

- [ ] `Toolbar.jsx` created

#### `src/components/IndicatorsPanel.jsx`
*(Copy from artifact: Step 6)*

- [ ] `IndicatorsPanel.jsx` created

#### `src/components/OscillatorsPanel.jsx`
*(Copy from artifact: Multi-pane Oscillators)*

- [ ] `OscillatorsPanel.jsx` created

#### `src/components/DrawingTools.jsx`
*(Copy from artifact: DrawingTools Component)*

- [ ] `DrawingTools.jsx` created

#### `src/components/Sidebar.jsx`
*(Copy from artifact: Step 9)*

- [ ] `Sidebar.jsx` created

### Utilities

#### `src/utils/chartCalculations.js`
*(Copy from artifact: Step 3 + StochRSI)*

- [ ] `chartCalculations.js` created

#### `src/utils/binanceWebSocket.js`
*(Copy from artifact: Step 2)*

- [ ] `binanceWebSocket.js` created

#### `src/utils/drawingUtils.js`
*(Copy from artifact: DrawingUtils)*

- [ ] `drawingUtils.js` created

### Chart Types

#### `src/chartTypes/chartTypeConfigs.js`
*(Copy from artifact: Chart Type Configs)*

- [ ] `chartTypeConfigs.js` created

### Styles (CSS Files)

#### `src/styles/Toolbar.css`
*(Copy from artifact: Toolbar.css)*

- [ ] `Toolbar.css` created

#### `src/styles/IndicatorsPanel.css`
*(Copy from artifact: IndicatorsPanel.css)*

- [ ] `IndicatorsPanel.css` created

#### `src/styles/OscillatorsPanel.css`
*(Copy from artifact: OscillatorsPanel.css)*

- [ ] `OscillatorsPanel.css` created

#### `src/styles/ChartContainer.css`
*(Copy from artifact: ChartContainer.css)*

- [ ] `ChartContainer.css` created

#### `src/styles/DrawingTools.css`
*(Copy from artifact: DrawingTools.css)*

- [ ] `DrawingTools.css` created

#### `src/styles/Sidebar.css`
*(Copy from artifact: Step 10)*

- [ ] `Sidebar.css` created

---

## 🧪 Test Local Development

### Start Dev Server

```bash
npm run dev
```

Expected output:
```
VITE v5.0.0  ready in xxx ms

➜  Local:   http://localhost:5173/
```

- [ ] Dev server started without errors
- [ ] Open `http://localhost:5173/` in browser
- [ ] Chart app loads (may show loading state)

### Verify Components

In browser DevTools Console, check for:

- [ ] No red errors (only warnings are OK)
- [ ] `useChartStore` available
- [ ] WebSocket connecting to Binance
- [ ] Chart rendering with candlesticks
- [ ] Toolbar visible (symbol, timeframes)
- [ ] Indicators panel opens/closes

---

## 🚀 Build for Production

### Create Production Build

```bash
npm run build
```

Expected output:
```
✓ 123 modules transformed.

dist/index.html  10.50 kB
dist/index-XXX.js  325.60 kB
dist/index-XXX.css  45.30 kB
```

- [ ] Build completes without errors
- [ ] `dist/` folder created
- [ ] `dist/index.html` exists
- [ ] No TypeScript errors

### Test Production Build

```bash
npm run preview
```

Open `http://localhost:5173/` and verify:

- [ ] App loads correctly
- [ ] All features work
- [ ] No console errors
- [ ] Performance acceptable

---

## 📤 Push to GitHub (Optional)

### Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Create repo: `crypto-chart-dashboard`
3. **Don't** initialize with README (we'll push existing)
4. Click **"Create repository"**

- [ ] GitHub repo created

### Push Code

```bash
git add .
git commit -m "Initial commit: Crypto chart dashboard foundation"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/crypto-chart-dashboard.git
git push -u origin main
```

- [ ] All files committed
- [ ] Code pushed to GitHub
- [ ] Remote configured

### Verify on GitHub

1. Go to your repo on GitHub.com
2. Verify all files are there
3. Check file structure

- [ ] All files visible on GitHub
- [ ] Folder structure correct

---

## 🌐 Deploy to Production (Choose One)

### Option A: Render (Easiest)

1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. Click **"New+"** → **"Web Service"**
4. Connect repo
5. Build command: `npm install && npm run build`
6. Publish directory: `dist`
7. Click **"Deploy"**

Wait 2-5 minutes...

- [ ] Render deployment started
- [ ] App deployed successfully
- [ ] Live URL received

### Option B: Vercel

```bash
npm install -g vercel
vercel
```

Follow prompts (default settings work):

- [ ] Vercel CLI installed
- [ ] App deployed to Vercel
- [ ] Live URL received

### Option C: Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click **"New site from Git"**
3. Connect GitHub repo
4. Build settings auto-detected
5. Click **"Deploy"**

- [ ] Netlify deployment started
- [ ] App deployed successfully
- [ ] Live URL received

---

## ✅ Final Verification

### Local Testing (http://localhost:5173)

- [ ] Symbol selector works
- [ ] Timeframe buttons switch chart
- [ ] Indicators toggle on/off
- [ ] Oscillators panel displays RSI/MACD
- [ ] Dark/Light theme toggle works
- [ ] Watchlist sidebar shows prices
- [ ] No console errors

### Production Testing (Live URL)

- [ ] App loads in <3 seconds
- [ ] Chart renders with real data
- [ ] WebSocket connects
- [ ] All indicators calculate
- [ ] No broken images/CSS
- [ ] Mobile responsive
- [ ] No errors in DevTools Console

---

## 📚 Documentation Files (Create These Too)

Create these files in root directory:

#### `README.md`
*(Copy from artifact: README.md)*

- [ ] `README.md` created

#### `DEPLOYMENT.md`
*(Copy from artifact: DEPLOYMENT.md)*

- [ ] `DEPLOYMENT.md` created

#### `INSTALLATION_CHECKLIST.md`
*(This file)*

- [ ] `INSTALLATION_CHECKLIST.md` created

---

## 🎯 Next Steps

Once everything is verified, you can:

1. **Add More Indicators**
   - Stochastic
   - Williams %R
   - CCI
   - ADX

2. **Improve Drawing Tools**
   - Fibonacci retracement
   - Pitchforks
   - Gann tools

3. **Add Features**
   - Alert system
   - Save/load layouts
   - Multi-symbol sync
   - Backtesting

4. **Performance**
   - Analyze bundle size
   - Optimize re-renders
   - Cache calculations

---

## 🐛 Troubleshooting

### npm install fails
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Port 5173 already in use
```bash
# Kill process on port 5173
# macOS/Linux:
lsof -ti:5173 | xargs kill -9

# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Missing dependencies
```bash
npm install react react-dom zustand lightweight-charts
```

### Chart not rendering
1. Open DevTools (F12)
2. Check Console for errors
3. Check Network tab (Binance API accessible?)
4. Verify candleData in Store (React DevTools)

### WebSocket connection fails
1. Check if `wss://stream.binance.com:9443/ws/` accessible
2. Try different symbol (BTCUSDT, ETHUSDT)
3. Check network tab for CORS errors

---

## ✨ You're Done! 🎉

Your **Crypto Chart Dashboard** is now:

- ✅ Fully installed locally
- ✅ Running in development mode
- ✅ Built for production
- ✅ Deployed live
- ✅ Documented

**Start trading with professional charts!** 📈

---

**Next**: Ready to add more indicators? Let me know! 🚀