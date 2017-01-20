#!/usr/bin/env node
'use strict';

var fs      = require('fs');
var path    = require('path');
var chalk   = require('chalk');
var program = require('commander');
var pkgJson = require('../package.json');

const log     = console.log;
const curPath = process.cwd();

const routerConfigPath = path.resolve(curPath, 'server/router/router.config');

program.version(pkgJson.version);

// marx create
program
  .command('create [name]')
  .description('create marx app')
  .action(function(name) {
    console.log('create new app named', name || 'marx-demo');
    // TODO: build project
  });

// marx route
program
  .command('route [url]')
  .option('-l, --list')
  .option('-f, --find')
  .option('-m, --method <method>')
  .option('-c, --controller <controller>')
  .alias('r')
  .action(function(url, options) {

    fs.readFile(routerConfigPath, 'utf8', function(err, data) {
      if (err) {
        log(chalk.red('router.config file cannot find, please excute `npm run dev` to generate it.'));
      }
      else {
        const routerList = data.split('\n').slice(2),
              routers    = routerList.map(x => x.split(' ')),
              controller = options.controller,
              method     = options.method,
              list       = options.list,
              find       = options.find;
        let   router     = null,
              path       = null,
              ctl        = null,
              m          = null;

        const filters = [
          router => (path = router[1]) === '*' || path.indexOf(url) > -1,
          method ? router => (m = router[0]) === '[ALL]' || m === `[${method.toUpperCase()}]` : () => true,
          controller ? router => (ctl = router[3].split('.')[0].toUpperCase()).indexOf(controller.toUpperCase()) > -1 : () => true
        ];
        if (list) {
          log(chalk.red('\nRouter List:\n'));
          log(chalk.green(routerList.map((r, index) => `${index}: ${r}`).join('\n')));
        }
        if (find) {
          log(chalk.red('\nFind Result:\n'));
          log(chalk.green((
            router = routers.filter(x => filters.every(filter => filter(x)))).length ?
              router.map(x => x.join(' ')).join('\n') :
              'not find'
          ));
        }
      }
    });
  });

program.parse(process.argv);
