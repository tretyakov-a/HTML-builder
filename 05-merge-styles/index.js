const fs = require('fs/promises');
const path = require('path');

const EXT = '.css';
const BUNDLE_NAME = 'bundle.css';
const DIST_DIRECTORY = 'project-dist';
const STYLES_DIRECTORY = 'styles';

const bundleFilePath = path.resolve(__dirname, DIST_DIRECTORY, BUNDLE_NAME);
const stylesDirPath = path.resolve(__dirname, STYLES_DIRECTORY);

async function getStyleFilePaths(dirPath) {
  const data = [];

  const readDir = async (dir) => {
    const files = await fs.readdir(dir, { withFileTypes: true });
    await Promise.all(files.map(async (file) => {
      const filePath = path.join(dir, file.name);
      if (file.isDirectory()) {
        await readDir(filePath);
      } else if (path.extname(file.name) === EXT) {
        data.push(filePath);
      }
    }));
  };
  await readDir(dirPath);

  return data;
}

async function makeStyleBundle() {
  try {
    const cssFilePaths = await getStyleFilePaths(stylesDirPath);
    const outputFileHandle = await fs.open(bundleFilePath, 'w');

    await Promise.all(cssFilePaths.map(async (filePath) => {
      const inputFileHandle = await fs.open(filePath, 'r');
      const data = await inputFileHandle.readFile();
      await outputFileHandle.writeFile(data);
      return inputFileHandle.close();
    }));

    await outputFileHandle.close();
  } catch (err) {
    console.error(err);
  }
}

makeStyleBundle();
