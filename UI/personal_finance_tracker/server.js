import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4200;
const distFolder = path.join(__dirname, 'dist/personalinance-trcker-ui/browser');

// Serve static files from dist folder
app.use(express.static(distFolder, {
  maxAge: '1y',
  etag: false
}));

// SPA fallback - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distFolder, 'index.html'));
});

app.listen(port, () => {
  console.log(`Angular app listening on port ${port}`);
});
