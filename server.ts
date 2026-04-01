import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import https from "https";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes
  app.get("/api/search", (req, res) => {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    https.get(`https://www.albumaty.com/search.php?q=${encodeURIComponent(query)}`, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        const results: { id: string, name: string, url: string }[] = [];
        // Regex to match song links
        const regex = /<a href="https:\/\/www\.albumaty\.com\/song\/(\d+)\.html">([^<]+)<\/a>/g;
        let match;
        while ((match = regex.exec(data)) !== null) {
          results.push({
            id: match[1],
            name: match[2].trim(),
            url: `https://www.albumaty.com/song/${match[1]}.html`
          });
        }
        res.json({ results });
      });
    }).on('error', (err) => {
      res.status(500).json({ error: err.message });
    });
  });

  app.get("/api/song", (req, res) => {
    const id = req.query.id as string;
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }
    https.get(`https://www.albumaty.com/song/${id}.html`, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        const match = data.match(/https:\/\/[^"]+\.mp3/i);
        if (match) {
          res.json({ url: match[0] });
        } else {
          res.status(404).json({ error: "MP3 not found" });
        }
      });
    }).on('error', (err) => {
      res.status(500).json({ error: err.message });
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
