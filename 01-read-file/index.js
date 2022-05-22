const fs = require('fs');
const path = require('path');

const INPUT_FILE = 'text.txt';
const filePath = path.join(__dirname, INPUT_FILE);
const stream = fs.createReadStream(filePath, { encoding: 'utf8'});
let allData = '';

stream.on('data', (chunk) => {
  allData += chunk;
});

stream.on('end', () => {
  console.log(allData);
});

stream.on('error', function(err) {
  console.error(err);
});
