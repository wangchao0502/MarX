#!/usr/bin/env node
'use strict';

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

// marx dev
program
  .command('dev')
  .description('run dev server')
  .alias('d')
  .action(() => require('./marx-run')());

// marx dashboard
program
  .command('dashboard')
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

program.parse(process.argv);
