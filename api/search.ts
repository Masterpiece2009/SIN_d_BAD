import https from 'https';

export default function handler(req: any, res: any) {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  https.get(`https://www.albumaty.com/search.php?q=${encodeURIComponent(query)}`, (response) => {
    let data = '';
    response.on('data', chunk => data += chunk);
    response.on('end', () => {
      const results: { id: string, name: string, url: string }[] = [];
      const regex = /<a href="https:\/\/www\.albumaty\.com\/song\/(\d+)\.html">([^<]+)<\/a>/g;
      let match;
      while ((match = regex.exec(data)) !== null) {
        results.push({
          id: match[1],
          name: match[2].trim(),
          url: `https://www.albumaty.com/song/${match[1]}.html`
        });
      }
      res.status(200).json({ results });
    });
  }).on('error', (err) => {
    res.status(500).json({ error: err.message });
  });
}
