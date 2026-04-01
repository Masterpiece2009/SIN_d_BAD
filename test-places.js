import http from 'http';

http.get('http://localhost:3000/api/places?q=pizza&lat=30.0444&lng=31.2357', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(data);
  });
});
