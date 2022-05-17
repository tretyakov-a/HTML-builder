const copyDirectory = require('./utils');
const path = require('path');

const DIRECTORY_NAME = 'files';
const directoryPath = path.join(__dirname, DIRECTORY_NAME);
const copyDirectoryPath = path.join(__dirname, `${DIRECTORY_NAME}-copy`);

copyDirectory(directoryPath, copyDirectoryPath);
