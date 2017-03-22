'use strict';

const path   = require('path');
const bunyan = require('bunyan');

const cwd    = process.cwd();
const Logger = bunyan.createLogger({ name: 'babel.app' });

let config = {};

try {
  config = {
    "presets": [
      [
        require.resolve("babel-preset-env"),
        {
          "targets": {
            "node": 6.9
          }
        }
      ]
    ],
    "plugins": [
      "babel-plugin-transform-runtime",
      "babel-plugin-transform-decorators-legacy",
      "babel-plugin-transform-object-rest-spread"
    ].map(require.resolve)
  };
} catch (err) {
  Logger.error(err);
}

// loading runtime
require('babel-register')(config);

// transfrom to es5 code, if use higher version node, it is not necessory
const versions = process.versions.node.split('.');
if (!(+versions[0] >= 6 && +versions[1] >= 9)) {
  require('babel-polyfill');
}

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
