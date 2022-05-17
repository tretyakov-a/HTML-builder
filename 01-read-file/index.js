const fs = require('fs');
const path = require('path');

const INPUT_FILE = 'text.txt';
const filePath = path.join(__dirname, INPUT_FILE);
const stream = fs.createReadStream(filePath);

stream.on('data', function (data) {
  console.log(data.toString());
});

stream.on('error', function(err) {
  console.error(err);
});
