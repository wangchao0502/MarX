#!/usr/bin/env node
'use strict';

const fs      = require('fs');
const vfs     = require('vinyl-fs');
const tpl     = require('./util/tpl');
const path    = require('path');
const spawn   = require('child_process').spawn;
const chalk   = require('chalk');
const string  = require('./util/string');
const through = require('through2');
const program = require('commander');
const padding = require('./util/padding');
const pkgJson = require('../package.json');

const log     = console.log;
const noop    = () => {};
const showErr = err => err && log(chalk.red(err));
const curPath = process.cwd();

const routerConfigPath = path.resolve(curPath,   'server/router/router.config');
const ctrlIxTargetPath = path.resolve(curPath,   'server/controller/index.js');
const modeIxTargetPath = path.resolve(curPath,   'server/model/index.js');
const ctrlTemplatePath = path.resolve(__dirname, './template/controller.js.template');
const ctrxTemplatePath = path.resolve(__dirname, './template/controller.index.js.template');
const servTemplatePath = path.resolve(__dirname, './template/service.js.template');
const modeTemplatePath = path.resolve(__dirname, './template/model.js.template');
const modxTemplatePath = path.resolve(__dirname, './template/model.index.js.template');

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
    };

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
    switch (type) {
      case 'module':
        // TODO: uppercase check
        const ctrlTemplate = fs.readFileSync(ctrlTemplatePath, 'utf8');
        const ctrxTemplate = fs.readFileSync(ctrxTemplatePath, 'utf8');
        const servTemplate = fs.readFileSync(servTemplatePath, 'utf8');
        const modeTemplate = fs.readFileSync(modeTemplatePath, 'utf8');
        const modxTemplate = fs.readFileSync(modxTemplatePath, 'utf8');

        // old index file data
        const ctrxFileData = fs.readFileSync(ctrlIxTargetPath, 'utf8');
        const modxFileData = fs.readFileSync(modeIxTargetPath, 'utf8');

        const params = {
          ModelName: name,
          ModelNameLowerCase: string.camelToSplitName(name)
        };
        console.log(string.camelToSplitName(name));
        // write file
        const ctrlTargetPath = path.resolve(curPath, `server/controller/${name}Controller.js`);
        const servTargetPath = path.resolve(curPath, `server/service/${name}Service.js`);
        const modeTargetPath = path.resolve(curPath, `server/model/${name}.js`);

        log(chalk.green(`create ${ctrlTargetPath.replace(curPath + '/', '')}`));
        log(chalk.green(`create ${servTargetPath.replace(curPath + '/', '')}`));
        log(chalk.green(`create ${modeTargetPath.replace(curPath + '/', '')}`));

        fs.writeFile(ctrlTargetPath, tpl(ctrlTemplate, params));
        fs.writeFile(servTargetPath, tpl(servTemplate, params));
        fs.writeFile(modeTargetPath, tpl(modeTemplate, params));

        // update index
        const reappend = (fileData, data) => fileData.indexOf(data) === -1 ? fileData + data : fileData;

        fs.writeFile(ctrlIxTargetPath, reappend(ctrxFileData, tpl(ctrxTemplate, params)), showErr);
        fs.writeFile(modeIxTargetPath, reappend(modxFileData, tpl(modxTemplate, params)), showErr);

        break;
      case 'test':
        break;
      default:
        log(chalk.red(`"${type}" is not valid type, only support module and test.`));
    }
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
            routerList.map((r, index) => `${padding(index + 1, 3, '0', 'left')}: ${r}`).join('\n')
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
