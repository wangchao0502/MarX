#!/usr/bin/env node
'use strict';

const path    = require('path');
const program = require('commander');
const pkgJson = require('../package.json');

program.version(pkgJson.version);

// marx create
program
  .command('create [name]')
  .description('create marx app')
  .option('-s, --silence')
  .alias('c')
  .action((name, options) => require('./marx-create')(name, options));

// marx generate
program
  .command('generate [type] [name]')
  .description('generate model/service/controller')
  .alias('g')
  .action((type, name) => require('./marx-generate')(type, name));

// marx dashboard
program
  .command('dashboard')
  .alias('d')
  .description('show running status in a dashboard')
  .action(() => require('./marx-dashboard'));

// marx route
program
  .command('route [url]')
  .option('-l, --list')
  .option('-f, --find')
  .option('-m, --method <method>')
  .option('-c, --controller <controller>')
  .alias('r')
  .action((url, options) => require('./marx-route')(url, options));

// marx babel
program
  .command('babel [file]')
  .option('-c, --cluster')
  .alias('b')
  .action((file, options) => require('./marx-babel')(file, options));

// marx sync
program
  .command('sync')
  .alias('s')
  .action(() => require('./marx-babel')(path.resolve(__dirname, './marx-sync')));

// marx publish
program
  .command('publish')
  .alias('p')
  .action(() => require('./marx-publish'));

// marx watch
program
  .command('watch')
  .alias('w')
  .action(() => require('./marx-watch'));

program.parse(process.argv);
