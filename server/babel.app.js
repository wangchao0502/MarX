'use strict';

const fs = require('fs');
const path = require('path');
const bunyan = require('bunyan');

const Logger = bunyan.createLogger({ name: 'babel.app' });

const babelrc = fs.readFileSync(path.join(__dirname, '../.babelrc'));
let config = {};

try {
  config = JSON.parse(babelrc);
} catch (err) {
  Logger.error('==> ERROR: Error parsing your .babelrc.');
  Logger.error(err);
}

require('babel-register')(config);
require('babel-polyfill');
require('./app');
