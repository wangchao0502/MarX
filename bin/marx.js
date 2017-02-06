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

const routerConfigPath = path.resolve(curPath, 'server/router/router.config');
const marxReConfigPath = path.resolve(curPath, 'marx.json');
const ctrlIxTargetPath = path.resolve(curPath, 'server/controller/index.js');
const modeIxTargetPath = path.resolve(curPath, 'server/model/index.js');
const ctrxTemplatePath = path.resolve(__dirname, './template/controller.index.js.template');
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
        if (string.isCamelStyle(name)) {
          log(chalk.red('Module name should be camel style.'));
          return;
        }

        const splitName = string.camelToSplitName(name);
        const params = {
          ModelName: name,
          ModelNameLowerCase: splitName
        };

        const newDirectory = [
          `client/js/src/${splitName}`,
          `client/js/src/${splitName}/components`,
          `client/js/src/${splitName}/style`,
        ];

        const templateToPath = {
          './template/controller.js.template': `server/controller/${name}Controller.js`,
          './template/service.js.template'   : `server/service/${name}Service.js`,
          './template/model.js.template'     : `server/model/${name}.js`,
          './template/view.html.template'    : `server/view/${name}.html`,
          './template/main.js.template'      : `client/js/src/${splitName}/main.js`,
          './template/View.jsx.template'     : `client/js/src/${splitName}/components/View.jsx`,
          './template/base.scss.template'    : `client/js/src/${splitName}/style/${splitName}.scss`,
        };

        // create client folder
        for (let dir of newDirectory) {
          try {
            fs.mkdirSync(path.resolve(curPath, dir));
          } catch (e) {
            log(chalk.red(`Client side folder ${dir} has existed.`));
          }
        }

        // write file
        for (let templatePath in templateToPath) {
          const template   = fs.readFileSync(path.resolve(__dirname, templatePath), 'utf8');
          const targetPath = path.resolve(curPath, templateToPath[templatePath]);

          log(chalk.green(`create ${targetPath.replace(curPath + '/', '')}`));
          fs.writeFile(targetPath, tpl(template, params));
        }

        // old index file data
        const ctrxFileData = fs.readFileSync(ctrlIxTargetPath, 'utf8');
        const modxFileData = fs.readFileSync(modeIxTargetPath, 'utf8');
        const marxFileData = fs.readFileSync(marxReConfigPath, 'utf8');

        const ctrxTemplate = fs.readFileSync(ctrxTemplatePath, 'utf8');
        const modxTemplate = fs.readFileSync(modxTemplatePath, 'utf8');

        // update controller index file
        const append = (fileData, data) => fileData.indexOf(data) === -1 ? fileData + data : fileData;
        fs.writeFile(ctrlIxTargetPath, append(ctrxFileData, tpl(ctrxTemplate, params)), showErr);

        // update marx.json models property
        const marxJsonFirstLine = '/* DO NOT EDIT THIS FILE!!! */\n';
        const marxJson = JSON.parse(marxFileData.replace(marxJsonFirstLine, ''));

        marxJson.models = marxJson.models || [];
        if (marxJson.models.indexOf(name) < 0) {
          marxJson.models.push(name);
        }

        fs.writeFile(marxReConfigPath, append(marxJsonFirstLine, JSON.stringify(marxJson, null, '  ')), showErr);

        // update model index file
        const modelIndexPosition = '\n\nconst Models = {};\n\n';
        const modelIndexTail     = '\nexport { sequelize, redis, Models };\n';

        let importModelString  = '';
        for (let model of marxJson.models) {
          importModelString += tpl(modxTemplate, { ModelName: model });
        }

        const newModxFileData =
          modxFileData.substring(0, modxFileData.indexOf(modelIndexPosition) - 1) +
          modelIndexPosition +
          importModelString +
          modelIndexTail;
        fs.writeFile(modeIxTargetPath, newModxFileData, showErr);

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
