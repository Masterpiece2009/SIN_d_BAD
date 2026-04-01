import https from 'https';

export default function handler(req: any, res: any) {
  const id = req.query.id;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  https.get(`https://www.albumaty.com/song/${id}.html`, (response) => {
    let data = '';
    response.on('data', chunk => data += chunk);
    response.on('end', () => {
      const match = data.match(/https:\/\/[^"]+\.mp3/i);
      if (match) {
        res.status(200).json({ url: match[0] });
      } else {
        res.status(404).json({ error: "MP3 not found" });
      }
    });
  }).on('error', (err) => {
    res.status(500).json({ error: err.message });
  });
}
