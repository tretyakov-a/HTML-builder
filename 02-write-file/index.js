const { writeLine } = require('./output');
const readline = require('readline');

const MESSAGES = {
  WELCOME: 'Hello! Write something. Use [Ctrl + C] or [exit] command for exit.',
  FAREWELL: 'Good bye!',
};
const rl = readline.createInterface({ input: process.stdin });

const COMMAND_EXIT = 'exit';
const handleExit = () => {
  console.log(MESSAGES.FAREWELL);
  rl.close();
  process.exit(0);
};

rl.on('line', (input) => {
  if (input.trim() === COMMAND_EXIT) {
    return handleExit();
  }
  writeLine(input);
});

console.log(MESSAGES.WELCOME);
process.on('SIGINT', handleExit);
