const fs = require('fs/promises');
const path = require('path');

const CSS_EXT = '.css';

async function getFilePaths(dirPath, ext) {
  const readDir = async (dir) => {
    const files = await fs.readdir(dir, { withFileTypes: true });
    const paths = await Promise.all(files.map(async (file) => {
      const filePath = path.join(dir, file.name);
      return file.isDirectory()
        ? readDir(filePath)
        : (path.extname(file.name) === ext) ? [ filePath ] : [];
    }));
    return paths.reduce((acc, path) => [...acc, ...path], []);
  };
  return await readDir(dirPath);
}

async function loadFiles(filePaths) {
  return await Promise.all(
    filePaths.map(async (filePath) => fs.readFile(filePath))
  );
}

async function makeStyleBundle(dir, bundle) {
  try {
    const cssFilePaths = await getFilePaths(dir, CSS_EXT);
    const filesData = await loadFiles(cssFilePaths);
    await fs.writeFile(bundle, Buffer.concat(filesData));
  } catch(err) {
    console.error(err);
  }
}

module.exports = {
  getFilePaths,
  loadFiles,
  makeStyleBundle,
};
