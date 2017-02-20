'use strict';

const log    = console.log;
const cwd    = process.cwd();
const path   = require('path');
const chalk  = require('chalk');
const Models = require(path.resolve(cwd, 'server/model/index')).Models;

const info   = text => log(chalk.green(`${text}`));

Object.keys(Models).forEach((key) => {
  info(`Create Table ${key}`);

  Models[key].sync(() => {
    console.log('test')
  });
});

// process.exit(0);
