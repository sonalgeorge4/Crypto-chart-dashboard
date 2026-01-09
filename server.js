import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5173;

// Ensure dist exists
const distPath = join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.error(`❌ ERROR: dist folder not found at ${distPath}`);
  console.error('Make sure to run: npm run build');
  process.exit(1);
}

console.log(`📁 Serving files from: ${distPath}`);

// Serve static files from dist folder
app.use(express.static(distPath));

// SPA fallback: serve index.html for all routes
app.get('*', (req, res) => {
  const indexPath = join(distPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    return res.status(404).send('index.html not found');
  }
  res.sendFile(indexPath);
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Server error');
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📊 Crypto Chart Dashboard deployed!`);
  console.log(`🌐 Serving from: ${distPath}`);
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});