import https from 'https';

https.get('https://www.albumaty.com/singer/123.html', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(data.substring(data.indexOf('الاغاني'), data.indexOf('الاغاني') + 2000));
  });
});
