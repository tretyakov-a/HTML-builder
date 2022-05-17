const { writeLine } = require('./output');
const readline = require('readline');

const MESSAGES = {
  WELCOME: 'Hello! Write something. Use [Ctrl + C] or [exit] command for exit.',
  FAREWELL: 'Good bye!',
};
const rl = readline.createInterface({ input: process.stdin });

const COMMAND_EXIT = 'exit';
const exitCommandRegexp = new RegExp(`^${COMMAND_EXIT}$`);
const handleExit = () => {
  console.log(MESSAGES.FAREWELL);
  rl.close();
  process.exit();
};

rl.on('line', (input) => {
  if (input.toString().match(exitCommandRegexp)) {
    return handleExit();
  }
  writeLine(input);
});

console.log(MESSAGES.WELCOME);
process.on('SIGINT', handleExit);
