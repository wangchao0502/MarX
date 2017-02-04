#!/usr/bin/env node
'use strict';

const fs      = require('fs');
const path    = require('path');
const spawn   = require('child_process').spawn;
const chalk   = require('chalk');
const program = require('commander');
const pkgJson = require('../package.json');

const log     = console.log;
const curPath = process.cwd();

const routerConfigPath = path.resolve(curPath, 'server/router/router.config');

program.version(pkgJson.version);

// marx create
program
  .command('create [name]')
  .description('create marx app')
  .action((name) => {
    log('create new app named', name || 'marx-demo');
    // TODO: build project
  });

// marx dev
program
  .command('dev')
  .description('run dev server')
  .action(() => {
    const gulp = spawn('gulp',   ['--color']);
    const blog = spawn('bunyan', ['--color', '--time', 'local', '-o', 'short']);

    blog.stdout.setEncoding('utf8');
    gulp.stdout.on('data', data => blog.stdin.write(data));
    blog.stdout.on('data', data => {
      const lines = data.toString().split('\n');
      for (let i = 0; i < lines.length - 1; i++) {
        log(lines[i]);
      }
    });
  });

// marx route
program
  .command('route [url]')
  .option('-l, --list')
  .option('-f, --find')
  .option('-m, --method <method>')
  .option('-c, --controller <controller>')
  .alias('r')
  .action((url, options) => {
    fs.readFile(routerConfigPath, 'utf8', (err, data) => {
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
          log(chalk.green(
            routerList.map((r, index) => `${index}: ${r}`).join('\n')
          ));
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
