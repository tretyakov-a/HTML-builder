const fs = require('fs/promises');
const path = require('path');

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

module.exports = copyDirectory;
