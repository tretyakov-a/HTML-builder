const { makeStyleBundle } = require('./utils');
const path = require('path');

const BUNDLE_NAME = 'bundle.css';
const DIST_DIRECTORY = 'project-dist';
const STYLES_DIRECTORY = 'styles';

const bundleFilePath = path.join(__dirname, DIST_DIRECTORY, BUNDLE_NAME);
const stylesDirPath = path.join(__dirname, STYLES_DIRECTORY);

makeStyleBundle(stylesDirPath, bundleFilePath);
