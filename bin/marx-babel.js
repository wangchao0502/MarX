'use strict';

const path   = require('path');
const bunyan = require('bunyan');

const cwd    = process.cwd();
const Logger = bunyan.createLogger({ name: 'babel.app' });

let config = {};

try {
  config = {
    presets: [
      'babel-preset-es2015',
      'babel-preset-stage-0'
    ].map(require.resolve),
    plugins: [
      'babel-plugin-add-module-exports',
      'babel-plugin-transform-decorators-legacy'
    ].map(require.resolve)
  };
} catch (err) {
  Logger.error('==> ERROR: Error parsing your .babelrc.');
  Logger.error(err);
}

// loading runtime
require('babel-register')(config);
require('babel-polyfill');

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const babelStarter = (file, config) => {
  const cluster = require('cluster');
  const numCPUs = require('os').cpus().length;

  if (config && config.cluster && cluster.isMaster) {
    Logger.info('master start...');

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('listening', function(worker, address) {
      Logger.info('worker [PID:' + worker.process.pid + '] listening');
    });

    cluster.on('exit', function(worker, code, signal) {
      Logger.info('worker [PID:' + worker.process.pid + '] died');
    });
  } else if (file[0] === '/') {
    // absolute path
    require(file);
  } else {
    require(path.resolve(cwd, file));
  }
};

module.exports = babelStarter;
