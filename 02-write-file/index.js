const fs = require('fs');
const path = require('path');
const readline = require('readline');

const MESSAGES = {
  WELCOME: 'Hello! Write something. Use [Ctrl + C] or [exit] command for exit.',
  FAREWELL: 'Good bye!',
};
const COMMAND_EXIT = 'exit';
const OUTPUT_FILE = 'output.txt';
const filePath = path.join(__dirname ,OUTPUT_FILE);

const writeStream = fs.createWriteStream(filePath);
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(MESSAGES.WELCOME);

rl.on('line', (line) => {
  if (line.trim() === COMMAND_EXIT) {
    return rl.close();
  }
  writeStream.write(`${line}\n`);
});

rl.on('SIGINT', () => rl.close());

rl.on('close', () => {
  console.log(MESSAGES.FAREWELL);
  process.exitCode = 0;
});
