# 🚀 Deployment Guide

Deploy **Crypto Chart Dashboard** to production on **Render**, **Vercel**, or **Netlify**.

---

## 🚀 Deploy to Render

### Step 1: Build the Project

```bash
npm run build
```

This creates a `dist/` folder with optimized production files.

### Step 2: Create `render.yaml` (Infrastructure as Code)

Create file: **`render.yaml`** in project root

```yaml
services:
  - type: web
    name: crypto-chart-dashboard
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    envVars:
      - key: NODE_ENV
        value: production
      - key: NPM_VERSION
        value: 9.6.7
```

### Step 3: Push to GitHub

```bash
git add .
git commit -m "feat: Add deployment config"
git push origin main
```

### Step 4: Deploy on Render

1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repo
5. Choose **Render YAML** as build method
6. Click **"Deploy"**

Your app will be live at: `https://crypto-chart-dashboard.onrender.com`

---

## 🚀 Deploy to Vercel

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Deploy

```bash
vercel
```

Follow the prompts:
- Link to existing Vercel project? **N**
- Set project name: **crypto-chart-dashboard**
- Detected framework: **Vite** (auto-detected)
- Build command: **npm run build** (default)
- Output directory: **dist** (default)

Your app will be live at: `https://crypto-chart-dashboard.vercel.app`

### Step 3 (Optional): Connect GitHub for Auto-Deploy

1. Go to [vercel.com](https://vercel.com)
2. Click **"Import Project"**
3. Paste GitHub repo URL
4. Click **"Import"**
5. Vercel auto-deploys on every `git push`

---

## 🚀 Deploy to Netlify

### Step 1: Create `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"

[dev]
  command = "npm run dev"
  port = 3000

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 2: Deploy via Git

1. Push to GitHub:
```bash
git add .
git commit -m "feat: Add Netlify config"
git push
```

2. Go to [netlify.com](https://netlify.com)
3. Click **"New site from Git"**
4. Connect GitHub repo
5. Netlify auto-detects build settings
6. Click **"Deploy"**

Your app will be live at: `https://crypto-chart-dashboard.netlify.app`

---

## 🔧 Environment Variables

If you need env vars (e.g., API keys), create `.env` file:

```env
VITE_BINANCE_API_URL=https://api.binance.com
VITE_WS_URL=wss://stream.binance.com:9443
VITE_APP_NAME=Crypto Chart Dashboard
```

### Access in Code

```javascript
const apiUrl = import.meta.env.VITE_BINANCE_API_URL;
```

### Set on Render/Vercel/Netlify

**Render:**
1. Go to Service Settings
2. Click **"Environment"**
3. Add variables

**Vercel:**
1. Go to Project Settings
2. Click **"Environment Variables"**
3. Add variables

**Netlify:**
1. Go to Site Settings
2. Click **"Build & Deploy"** → **"Environment"**
3. Add variables

---

## 📊 Monitoring & Logs

### Render
- View logs: Service Dashboard → **"Logs"**
- Monitor performance: **"Metrics"**

### Vercel
- View logs: Project → **"Deployments"** → Click deployment
- Performance: **"Analytics"** tab

### Netlify
- View logs: Site → **"Deploys"** → Click deploy
- Performance: **"Analytics"** tab

---

## 🔒 Security Best Practices

1. **Never commit secrets**
   ```bash
   # Add to .gitignore
   echo ".env.local" >> .gitignore
   echo "node_modules/" >> .gitignore
   ```

2. **Use environment variables** for API keys

3. **Enable HTTPS** (automatic on Render/Vercel/Netlify)

4. **Set Content Security Policy** (CSP) headers:

   **For Render**, add to `render.yaml`:
   ```yaml
   headers:
     - path: "/*"
       headers:
         - key: "Content-Security-Policy"
           value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
   ```

5. **Rate limit API calls** to prevent abuse

---

## 🚀 Custom Domain

### Render
1. Go to Service Settings
2. Click **"Custom Domain"**
3. Enter domain (e.g., `chart.example.com`)
4. Point DNS to Render

### Vercel
1. Go to Project Settings
2. Click **"Domains"**
3. Add domain
4. Follow DNS setup instructions

### Netlify
1. Go to Site Settings
2. Click **"Domain Management"**
3. Add custom domain
4. Update DNS records

---

## 📈 Performance Optimization

### Pre-build Optimization
```bash
# Analyze bundle size
npm install --save-dev vite-plugin-visualizer
```

### Update `vite.config.js`
```javascript
import { visualizer } from 'vite-plugin-visualizer';

export default {
  plugins: [react(), visualizer()],
};
```

### Minification & Compression
Vite automatically minifies production builds. Enable gzip on your host:

**Render** (automatic)  
**Vercel** (automatic)  
**Netlify** (automatic)

---

## 🐛 Troubleshooting Deployment

### Build fails with "npm ERR!"

**Solution:**
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

### Blank page after deploy

**Check:**
1. Open DevTools → Console (any errors?)
2. Check **Network** tab (missing files?)
3. Verify `dist/` folder has files
4. Check if build command correct in config

**Solution:**
```bash
npm run build
# Verify dist/ has index.html
ls dist/
```

### WebSocket connection fails in production

**Check:**
1. Verify `wss://stream.binance.com:9443` is accessible
2. Check for CORS/CSP issues in DevTools
3. Ensure Binance API not rate-limited

**Solution:**
Add CORS headers if needed (contact support)

### "404 Not Found" on page refresh

**Solution:** Add SPA redirect rule

**Render:** (in `render.yaml`)
```yaml
routes:
  - path: "/*"
    redirect: "/index.html"
```

**Vercel:** (automatic for Next.js-like setups, add vercel.json)
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Netlify:** (automatic with `netlify.toml`)

---

## 🔄 Continuous Deployment (CI/CD)

### GitHub Actions Example

Create: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Render

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy
        run: |
          curl https://api.render.com/deploy/srv-YOUR_SERVICE_ID?key=YOUR_DEPLOY_KEY \
          -X POST
```

Replace `YOUR_SERVICE_ID` and `YOUR_DEPLOY_KEY` from Render dashboard.

---

## 📊 Monitoring Checklist

- [ ] App loads without errors
- [ ] Chart renders with data
- [ ] WebSocket connects (check DevTools Network)
- [ ] Indicators calculate correctly
- [ ] Theme toggle works
- [ ] Mobile responsive (test on phone)
- [ ] Performance acceptable (<3s load time)
- [ ] No console errors

---

## 💾 Backup & Restore

Keep your code backed up:

```bash
# Create GitHub repository
git remote add origin https://github.com/YOUR-USERNAME/crypto-chart-dashboard.git
git push -u origin main

# Tag releases
git tag v1.0.0
git push origin v1.0.0
```

---

**Happy deploying! 🚀**