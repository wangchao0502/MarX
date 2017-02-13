'use strict';

process.env.NODE_ENV = 'development';

const log    = console.log;
const cwd    = process.cwd();
const path   = require('path');
const chalk  = require('chalk');
const Models = require(path.resolve(cwd, 'server/model/index')).Models;

Object.keys(Models).forEach((key) => {
  log(chalk.red(`Create Table ${key}`));
  Models[key].sync();
});

// process.exit(0);
