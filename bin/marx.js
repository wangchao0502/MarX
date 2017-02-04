#!/usr/bin/env node
'use strict';

const fs      = require('fs');
const vfs     = require('vinyl-fs');
const path    = require('path');
const spawn   = require('child_process').spawn;
const chalk   = require('chalk');
const through = require('through2');
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
  .option('-s, --silence')
  .alias('c')
  .action((name, options) => {
    name = name || 'marx-demo';

    const boil = path.join(__dirname, '../boilerplate');
    const dest = path.join(process.cwd(), name);
    const template = function(dest, boil) {
      return through.obj(function(file, enc, cb) {
        if (!file.stat.isFile()) {
          return cb();
        }

        log(chalk.green(`create ${file.path.replace(boil + '/', '')}`));
        this.push(file);
        cb();
      });
    }
    const printSuccess = () => {
      log(chalk.blue(`
Success! Created ${name} at ${dest}.

Inside that directory, you can run several commands:
  * npm start: Starts the development server.
  * npm run build: Bundles the app into dist for production.
  * npm test: Run test.
  
We suggest that you begin by typing:
  cd ${dest}
  npm start
  
Open a new command session and typing:
  npm run build
  
Happy hacking!`));
    }

    log(chalk.red(`Creating a new MarX app in ${name}...\n`));

    vfs.src('**/*', { cwd: boil, cwdbase: true, dot: true })
      .pipe(template(dest, boil))
      .pipe(vfs.dest(dest))
      .on('end', function() {
        if (options.silence) {
          printSuccess();
        } else {
          log(chalk.red('\nRunning ynpm install...\n'));

          process.chdir(name);

          // fast install node-sass
          const env = Object.create(process.env);
          env.SASS_BINARY_SITE = 'https://npm.taobao.org/mirrors/node-sass/';
          spawn('npm', ['install', 'node-sass'], { stdio: 'inherit', env: env })
            .on('close', () => {
              // use ynpm install
              spawn('npm', ['install', '--registry=http://registry.npm.qima-inc.com'], { stdio: 'inherit' })
                .on('close', () => {
                  printSuccess();
                });
            });
        }
      })
      .resume();
  });

// marx generate
program
  .command('generate [type] [name]')
  .description('generate model/service/controller')
  .alias('g')
  .action((type, name) => {
    log(`generate ${type} ${name}`);
    switch (type) {
      case 'module':
        break;
      case 'test':
        break;
      default:
        log(chalk.red(`"${type}" is not valid type, only support module and test.`));
    }

    // TODO: generate code
  });

// marx dev
program
  .command('dev')
  .description('run dev server')
  .alias('d')
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
