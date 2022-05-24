const fs = require('fs/promises');
const path = require('path');
const copyDirectory = require('../04-copy-directory');
const { getFilePaths, makeStyleBundle } = require('../05-merge-styles');

const HTML_EXT = '.html';
const STYLES_BUNDLE_NAME = 'style.css';
const STYLES_DIRECTORY = 'styles';
const HTML_TEMPLATE_NAME = 'template.html';
const HTML_INDEX_NAME = 'index.html';
const COMPONENTS_DIRECTORY = 'components';
const DIST_DIRECTORY = 'project-dist';
const ASSETS_DIRECTORY = 'assets';

const distPath = path.join(__dirname, DIST_DIRECTORY);
const assetsSrcPath = path.join(__dirname, ASSETS_DIRECTORY);
const assetsDestPath = path.join(distPath, ASSETS_DIRECTORY);
const stylesSrcPath = path.join(__dirname, STYLES_DIRECTORY);
const stylesBundlePath = path.join(distPath, STYLES_BUNDLE_NAME);

const htmlTemplatePath = path.join(__dirname, HTML_TEMPLATE_NAME);
const htmlComponentsDirPath = path.join(__dirname, COMPONENTS_DIRECTORY);
const htmlIndexPath = path.join(distPath, HTML_INDEX_NAME);

function loadFiles(filePaths) {
  return Promise.all(
    filePaths.map(async (filePath) => fs.readFile(filePath, { encoding: 'utf8' }))
  );
}

async function loadComponents() {
  const componentFilePaths = await getFilePaths(htmlComponentsDirPath, HTML_EXT);
  return (await loadFiles(componentFilePaths))
    .reduce((acc, data, i) => {
      const { name } = path.parse(componentFilePaths[i]);
      return { ...acc, [name]: data };
    }, {});
}

async function buildHtml() {
  const components = await loadComponents();
  let templateData = await fs.readFile(htmlTemplatePath, { encoding: 'utf8' });
  Object.keys(components).forEach((componentName) => {
    const templateString = `{{${componentName}}}`;
    templateData = templateData.replace(templateString, components[componentName]);
  });
  
  await fs.writeFile(htmlIndexPath, templateData);
}

async function buildPage() {
  try {
    await fs.rm(distPath, { recursive: true, force: true });
    await fs.mkdir(distPath);
    await Promise.all([
      copyDirectory(assetsSrcPath, assetsDestPath),
      makeStyleBundle(stylesSrcPath, stylesBundlePath),
      buildHtml(),
    ]);
  } catch (err) {
    console.error(err);
  }
}

buildPage();
