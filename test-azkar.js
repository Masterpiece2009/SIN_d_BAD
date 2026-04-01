import https from 'https';
import fs from 'fs';

https.get('https://raw.githubusercontent.com/nawafalqari/azkar-api/56df51279ab6eb86dc2f6202c7de26c8948331c1/azkar.json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const azkar = JSON.parse(data);
    
    // Extract morning and evening azkar
    const morning = azkar['أذكار الصباح'].flat().map(item => ({
      text: item.content,
      count: parseInt(item.count) || 1,
      description: item.description || ''
    }));
    
    const evening = azkar['أذكار المساء'].flat().map(item => ({
      text: item.content,
      count: parseInt(item.count) || 1,
      description: item.description || ''
    }));
    
    fs.writeFileSync('src/azkarData.ts', `
export const morningAdhkar = ${JSON.stringify(morning, null, 2)};

export const eveningAdhkar = ${JSON.stringify(evening, null, 2)};
    `);
    
    console.log('Done writing azkar to src/azkarData.ts');
  });
});
