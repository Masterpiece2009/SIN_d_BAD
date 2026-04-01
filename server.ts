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
        const songs: { id: string, name: string, type: 'song' }[] = [];
        const artists: { id: string, name: string, type: 'artist' }[] = [];
        const seenSongIds = new Set<string>();
        const seenArtistIds = new Set<string>();
        
        // Regex to match song links
        const songRegex = /<a href="https:\/\/www\.albumaty\.com\/song\/(\d+)\.html">([^<]+)<\/a>/g;
        let match;
        while ((match = songRegex.exec(data)) !== null && songs.length < 30) {
          const id = match[1];
          if (!seenSongIds.has(id)) {
            seenSongIds.add(id);
            songs.push({
              id: id,
              name: match[2].trim(),
              type: 'song'
            });
          }
        }

        // Regex to match artist links
        const artistRegex = /<a href="https:\/\/www\.albumaty\.com\/singer\/(\d+)\.html">([^<]+)<\/a>/g;
        while ((match = artistRegex.exec(data)) !== null && artists.length < 10) {
          const id = match[1];
          if (!seenArtistIds.has(id)) {
            seenArtistIds.add(id);
            artists.push({
              id: id,
              name: match[2].trim(),
              type: 'artist'
            });
          }
        }

        res.json({ results: [...artists, ...songs] });
      });
    }).on('error', (err) => {
      res.status(500).json({ error: err.message });
    });
  });

  app.get("/api/artist", (req, res) => {
    const id = req.query.id as string;
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }
    https.get(`https://www.albumaty.com/singer/${id}.html`, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        const songs: { id: string, name: string, type: 'song' }[] = [];
        const seenIds = new Set<string>();
        const songRegex = /<a href="https:\/\/www\.albumaty\.com\/song\/(\d+)\.html">([^<]+)<\/a>/g;
        let match;
        while ((match = songRegex.exec(data)) !== null && songs.length < 50) {
          const id = match[1];
          if (!seenIds.has(id)) {
            seenIds.add(id);
            songs.push({
              id: id,
              name: match[2].trim(),
              type: 'song'
            });
          }
        }
        res.json({ results: songs });
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
