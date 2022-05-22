const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const CSS_EXT = '.css';

async function getFilePaths(dirPath, ext) {
  const readDir = async (dir) => {
    const files = await fsPromises.readdir(dir, { withFileTypes: true });
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

async function makeStyleBundle(dir, bundle) {
  try {
    const cssFilePaths = await getFilePaths(dir, CSS_EXT);
    const writer = fs.createWriteStream(bundle);
    for (const path of cssFilePaths) {
      const reader = fs.createReadStream(path);
      await new Promise((resolve, reject) => {
        reader.pipe(writer, { end: false }).on('error', (err) => reject(err));
        reader.on('end', resolve);
      });
    }
    writer.close();
  } catch(err) {
    console.error(err);
  }
}

module.exports = {
  getFilePaths,
  makeStyleBundle,
};
