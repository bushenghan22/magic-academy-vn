const https = require('https');
const fs = require('fs');
const path = require('path');

const testPrompt = 'masterpiece, best quality, anime girl, pink long hair, blue eyes, school uniform, smiling, white background, full body';
const url = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(testPrompt)}&image_size=portrait_4_3`;
const outPath = path.join(__dirname, 'test-generated.jpg');

console.log('Testing image generation...');
console.log('URL:', url);

https.get(url, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers['content-type'], res.headers['content-length']);
  
  if (res.statusCode === 200) {
    const stream = fs.createWriteStream(outPath);
    res.pipe(stream);
    stream.on('finish', () => {
      stream.close();
      const stats = fs.statSync(outPath);
      console.log(`✓ Saved test image: ${(stats.size/1024).toFixed(1)} KB`);
    });
  } else {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log('Response:', data));
  }
}).on('error', err => {
  console.error('Error:', err);
});
