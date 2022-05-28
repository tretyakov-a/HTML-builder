const fs = require('fs');
const path = require('path');

const INPUT_FILE = 'text.txt';
const filePath = path.join(__dirname, INPUT_FILE);
const stream = fs.createReadStream(filePath, { encoding: 'utf8', highWaterMark: 16 });

stream.on('data', (chunk) => {
  process.stdout.write(chunk);
});

stream.on('error', function(err) {
  console.error(err);
});
