const fs = require('fs/promises');
const path = require('path');

const CSS_EXT = '.css';

async function getFilePaths(dirPath, ext) {
  const data = [];

  const readDir = async (dir) => {
    const files = await fs.readdir(dir, { withFileTypes: true });
    await Promise.all(files.map(async (file) => {
      const filePath = path.join(dir, file.name);
      if (file.isDirectory()) {
        await readDir(filePath);
      } else if (path.extname(file.name) === ext) {
        data.push(filePath);
      }
    }));
  };
  await readDir(dirPath);

  return data;
}

async function makeStyleBundle(dir, bundle) {
  try {
    const cssFilePaths = await getFilePaths(dir, CSS_EXT);
    const outputFileHandle = await fs.open(bundle, 'w');

    const filesData = await Promise.all(cssFilePaths.map(async (filePath) => {
      const inputFileHandle = await fs.open(filePath, 'r');
      const data = await inputFileHandle.readFile();
      await inputFileHandle.close();
      return data;
    }));

    await outputFileHandle.writeFile(filesData.join(''));
    await outputFileHandle.close();
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  makeStyleBundle,
  getFilePaths,
};
