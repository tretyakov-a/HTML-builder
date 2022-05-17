const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = 'output.txt';

function write(data, cb) {
  if (!outputFile.write(data)) {
    outputFile.once('drain', cb);
  } else {
    process.nextTick(cb);
  }
}

function writeLine(data) {
  write(data + '\n', () => {});
}

const filePath = path.join(__dirname, OUTPUT_FILE);
const outputFile = fs.createWriteStream(filePath);
outputFile.on('error', (err) => {
  console.error(err);
});

module.exports = {
  writeLine
};
