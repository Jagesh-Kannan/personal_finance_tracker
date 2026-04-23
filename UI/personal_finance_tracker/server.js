import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4200;
const distFolder = path.join(__dirname, 'dist/personalinance-trcker-ui/browser');

console.log('Serving static files from:', distFolder);

// Serve static files from dist folder
app.use(express.static(distFolder, {
  maxAge: '1y',
  etag: false,
  index: 'index.html'
}));

// SPA fallback - serve index.html for all routes that don't match static files
app.use((req, res) => {
  res.sendFile(path.join(distFolder, 'index.html'), (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Could not load the application');
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  console.log(`✓ Angular app listening on http://localhost:${port}`);
});
