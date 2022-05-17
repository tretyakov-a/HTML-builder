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
const assestSrcPath = path.join(__dirname, ASSETS_DIRECTORY);
const assetsDestPath = path.join(distPath, ASSETS_DIRECTORY);
const stylesSrcPath = path.join(__dirname, STYLES_DIRECTORY);
const stylesBundlePath = path.join(distPath, STYLES_BUNDLE_NAME);

const htmlTemplatePath = path.join(__dirname, HTML_TEMPLATE_NAME);
const htmlComponentsDirPath = path.join(__dirname, COMPONENTS_DIRECTORY);
const htmlIndexPath = path.join(distPath, HTML_INDEX_NAME);

async function loadComponents() {
  const componentFilePaths = await getFilePaths(htmlComponentsDirPath, HTML_EXT);
  const componentsData = await Promise.all(componentFilePaths.map(async (filePath) => {
    const inputFileHandle = await fs.open(filePath, 'r');
    const data = await inputFileHandle.readFile();
    await inputFileHandle.close();
    return data;
  }));
  return componentsData.reduce((acc, data, i) => {
    const { name } = path.parse(componentFilePaths[i]);
    return { ...acc, [name]: data };
  }, {});
}

async function buildHtml() {
  const components = await loadComponents();
  const templateFileHandle = await fs.open(htmlTemplatePath, 'r');
  let templateData = (await templateFileHandle.readFile()).toString();
  Object.keys(components).forEach((componentName) => {
    const templateString = `{{${componentName}}}`;
    templateData = templateData.replace(templateString, components[componentName].toString());
  });
  
  const htmlIndexFileHandle = await fs.open(htmlIndexPath, 'w');
  htmlIndexFileHandle.writeFile(templateData);

  await htmlIndexFileHandle.close();
  await templateFileHandle.close();
}

async function buildPage() {
  try {
    await fs.mkdir(distPath, { recursive: true });
    await copyDirectory(assestSrcPath, assetsDestPath);
    await makeStyleBundle(stylesSrcPath, stylesBundlePath);
    await buildHtml();
  } catch (err) {
    console.error(err);
  }
}

buildPage();
