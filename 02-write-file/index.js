const fs = require('fs');
const path = require('path');

const MESSAGES = {
  WELCOME: 'Hello! Write something. Use [Ctrl + C] or [exit] command for exit.',
  FAREWELL: 'Good bye!',
};
const COMMAND_EXIT = 'exit';
const OUTPUT_FILE = 'output.txt';
const filePath = path.join(__dirname ,OUTPUT_FILE);

const output = new Promise((resolve, reject) => {
  const writeStream = fs.createWriteStream(filePath, { encoding: 'utf8' });
  writeStream.on('error', (err) => {
    reject(err);
  });
  writeStream.on('ready', () => {
    resolve(writeStream);
  });
});

async function init() {
  try {
    const writeStream = await output; 

    const handleExit = () => {
      console.log(MESSAGES.FAREWELL);
      writeStream.close();
      process.exit(0);
    };
    
    process.stdin.on('data', (chunk) => {
      const line = chunk.toString();
      if (line.trim() === COMMAND_EXIT) {
        return handleExit();
      }
      writeStream.write(line);
    });
    
    console.log(MESSAGES.WELCOME);
    process.on('SIGINT', handleExit);
  } catch (err) {
    console.log(err);
  }
}

init();
