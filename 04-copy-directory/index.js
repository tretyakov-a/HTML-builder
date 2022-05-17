const fs = require('fs/promises');
const path = require('path');

const DIRECTORY_NAME = 'files';
const directoryPath = path.join(__dirname, DIRECTORY_NAME);
const copyDirectoryPath = path.join(__dirname, `${DIRECTORY_NAME}-copy`);

async function copyDirectory(source, destination) {
  try {
    await fs.mkdir(destination, { recursive: true });
    const files = await fs.readdir(source, { withFileTypes: true });
    await Promise.all(files.map(async (file) => {
      const srcFilePath = path.join(source, file.name);
      const destFilePath = path.join(destination, file.name);
      if (file.isDirectory()) {
        await copyDirectory(srcFilePath, destFilePath);
      } else {
        await fs.copyFile(srcFilePath, destFilePath);
      }
    }));
  } catch (error) {
    console.error(error);
  }
}

copyDirectory(directoryPath, copyDirectoryPath);

module.exports = copyDirectory;
