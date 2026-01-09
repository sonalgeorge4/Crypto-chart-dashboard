import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
let __dirname = dirname(__filename);

// We're in src/, go up to project root
__dirname = dirname(__dirname);

const app = express();
const PORT = process.env.PORT || 10000;

// Get the correct dist path (project root)
const distPath = resolve(__dirname, 'dist');

console.log(`\n📁 Current directory: ${__dirname}`);
console.log(`📁 Looking for dist at: ${distPath}`);

// Check if dist exists
if (!fs.existsSync(distPath)) {
  console.error(`❌ ERROR: dist folder not found!`);
  console.error(`Expected at: ${distPath}`);
  
  // List what's actually there
  const files = fs.readdirSync(__dirname);
  console.error(`\nFiles in project root:`, files);
  
  process.exit(1);
}

console.log(`✅ Found dist folder at: ${distPath}\n`);

// Serve static files
app.use(express.static(distPath, {
  maxAge: '1d',
  etag: false
}));

// SPA: Route all requests to index.html
app.get('*', (req, res) => {
  const indexPath = join(distPath, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.error(`❌ index.html not found at ${indexPath}`);
    return res.status(404).send('index.html not found');
  }
  
  res.sendFile(indexPath);
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Internal server error');
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
  console.log(`📊 Crypto Chart Dashboard is live!`);
  console.log(`🌐 Serving files from: ${distPath}\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});