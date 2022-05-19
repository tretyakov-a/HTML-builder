const fs = require('fs/promises');
const fsCb = require('fs');
const path = require('path');
const CSS_EXT = '.css';

const createStream = async (src, type) => new Promise((resolve, reject) => {
  const stream = type === 'write'
    ? fsCb.createWriteStream(src)
    : fsCb.createReadStream(src);
  stream.on('error', (err) => reject(err));
  stream.on('ready', () => resolve(stream));
});

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

async function makeStyleBundle(dir, bundle) {
  try {
    const cssFilePaths = await getFilePaths(dir, CSS_EXT);
    const writer = await createStream(bundle, 'write');
    for (const path of cssFilePaths) {
      const reader = await createStream(path, 'read');
      reader.pipe(writer, { end: false });
      await new Promise((resolve) => reader.on('end', resolve));
    }
    writer.close();
  } catch(err) {
    console.error(err);
  }
}

module.exports = {
  createStream,
  getFilePaths,
  makeStyleBundle,
};
