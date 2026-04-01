import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import https from "https";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes
  app.get("/api/env", (req, res) => {
    res.json({
      gemini: !!process.env.GEMINI_API_KEY,
      length: process.env.GEMINI_API_KEY?.length,
      val: process.env.GEMINI_API_KEY?.substring(0, 5)
    });
  });

  app.get("/api/places", async (req, res) => {
    const query = req.query.q as string;
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    try {
      console.log("API Key length inside server:", process.env.GEMINI_API_KEY?.length);
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Find ${query} nearby.`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: lat || 30.0444, // Default to Cairo if not provided
                longitude: lng || 31.2357
              }
            }
          }
        }
      });

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const places = [];
      if (chunks) {
        for (const chunk of chunks) {
          if (chunk.maps) {
            places.push({
              uri: chunk.maps.uri,
              title: chunk.maps.title,
            });
          }
        }
      }
      
      res.json({ text: response.text, places });
    } catch (error: any) {
      console.error("Places API Error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch places" });
    }
  });

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
