import https from 'https';

https.get('https://www.albumaty.com/singer/123.html', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const songRegex = /<a href="https:\/\/www\.albumaty\.com\/song\/(\d+)\.html">([^<]+)<\/a>/g;
    let match;
    let count = 0;
    while ((match = songRegex.exec(data)) !== null && count < 10) {
      console.log(match[1], match[2]);
      count++;
    }
  });
});
