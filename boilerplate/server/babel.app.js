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

// loading runtime
require('babel-register')(config);
require('babel-polyfill');

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster && process.env.NODE_CLUSTER) {
  console.log('master start...');

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('listening', function(worker, address) {
    console.log('worker [PID:' + worker.process.pid + '] listening');
  });

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker [PID:' + worker.process.pid + '] died');
  });
} else {
  require('./app');
}
