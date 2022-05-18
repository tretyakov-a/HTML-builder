const fs = require('fs/promises');
const path = require('path');

async function copyDirectory(source, destination) {
  try {
    await fs.rm(destination, { recursive: true, force: true });
    await fs.mkdir(destination);
    const files = await fs.readdir(source, { withFileTypes: true });
    await Promise.all(files.map(async (file) => {
      const srcFilePath = path.join(source, file.name);
      const destFilePath = path.join(destination, file.name);
      return file.isDirectory()
        ? copyDirectory(srcFilePath, destFilePath)
        : fs.copyFile(srcFilePath, destFilePath);
    }));
  } catch (error) {
    console.error(error);
  }
}

module.exports = copyDirectory;
