const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = 'output.txt';
const filePath = path.join(__dirname ,OUTPUT_FILE);

module.exports = new Promise((resolve, reject) => {
  const writeStream = fs.createWriteStream(filePath, { encoding: 'utf8' });
  writeStream.on('error', (err) => {
    reject(err);
  });
  writeStream.on('ready', () => {
    resolve(writeStream);
  });
});
