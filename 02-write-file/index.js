const output = require('./output');

const MESSAGES = {
  WELCOME: 'Hello! Write something. Use [Ctrl + C] or [exit] command for exit.',
  FAREWELL: 'Good bye!',
};
const COMMAND_EXIT = 'exit';

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
