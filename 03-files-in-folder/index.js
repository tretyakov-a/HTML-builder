const fs = require('fs/promises');
const path = require('path');

const DIRECTORY_NAME = 'secret-folder';
const directoryPath = path.join(__dirname, DIRECTORY_NAME);

function logFileInfo(fileName, stats) {
  let { name, ext } = path.parse(fileName);
  ext = ext.length !== 0 ? ext.slice(1) : '[no ext]';
  const fileSize = stats.size;
  const fileSizeInKb = (fileSize / 1024).toFixed(3);
  console.log(`${name} - ${ext} - ${fileSizeInKb}kb`);
}

async function processFile(filePath) {
  const fileStats = await fs.stat(filePath);
  if (fileStats.isDirectory()) {
    await readDirectory(filePath);
  } else {
    logFileInfo(filePath, fileStats);
  }
}

async function readDirectory(dirPath) {
  try {
    const files = await fs.readdir(dirPath);
    await Promise.all(files.map(async (file) => {
      const filePath = path.join(dirPath, file);
      await processFile(filePath);
    }));
  } catch (err) {
    console.error(err);
  }
}

readDirectory(directoryPath);
