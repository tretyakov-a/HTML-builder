const path = require('path');
const fs = require('fs/promises');

const DIRECTORY_NAME = 'files';
const directoryPath = path.join(__dirname, DIRECTORY_NAME);
const copyDirectoryPath = path.join(__dirname, `${DIRECTORY_NAME}-copy`);

async function copy(src, dest) {
  await fs.mkdir(dest);
  const files = await fs.readdir(src, { withFileTypes: true });
  await Promise.all(files.map(async (file) => {
    const srcFilePath = path.join(src, file.name);
    const destFilePath = path.join(dest, file.name);
    return file.isDirectory()
      ? copy(srcFilePath, destFilePath)
      : fs.copyFile(srcFilePath, destFilePath);
  }));
}

async function copyDirectory(source, destination) {
  try {
    await fs.rm(destination, { recursive: true, force: true });
    await copy(source, destination);
  } catch (error) {
    console.error(error);
  }
}

copyDirectory(directoryPath, copyDirectoryPath);

module.exports = copyDirectory;
