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

async function loadFiles(filePaths) {
  return await Promise.all(filePaths.map(async (filePath) => {
    const data = await fs.readFile(filePath);
    return data;
  }));
}

async function makeStyleBundle(dir, bundle) {
  try {
    const cssFilePaths = await getFilePaths(dir, CSS_EXT);
    const filesData = await loadFiles(cssFilePaths);
    await fs.writeFile(bundle, filesData.join(''));
  } catch(err) {
    console.error(err);
  }
}

module.exports = {
  getFilePaths,
  loadFiles,
  makeStyleBundle,
};
