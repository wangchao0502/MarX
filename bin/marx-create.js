'use strict';

const tpl     = require('./util/tpl');
const vfs     = require('vinyl-fs');
const path    = require('path');
const spawn   = require('child_process').spawn;
const chalk   = require('chalk');
const through = require('through2');
const pkgJson = require('../package.json');

const cwd     = process.cwd();
const log     = console.log;
const version = pkgJson.version;
const info    = text => log(chalk.green(`\n${text}\n`));
const remind  = text => log(chalk.red(`\n${text}\n`));
const success = text => log(chalk.blue(`\n${text}\n`));

const successLog = (name, dest) => {
  success(`
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
  
Happy hacking!`);
};

const createLog = name => remind(`Creating a new MarX app in ${name}...`);

const tplMiddleware = function(dest, boil) {
  return through.obj(function(file, enc, cb) {
    if (!file.stat.isFile()) {
      return cb();
    }

    log(chalk.green(`create ${file.path.replace(boil + '/', '')}`));

    this.push(file);
    cb();
  });
};

const copyFiles = (dirName, dest, cb) => {
  remind('Running copy boilerplates...');

  vfs.src('**/*', { cwd: dirName, cwdbase: true, dot: true })
    .pipe(tplMiddleware(dest, dirName))
    .pipe(vfs.dest(dest))
    .on('end', () => cb && cb());
};

const nodeSassInstall = (cb) => {
  remind('Running node-sass fast install...');

  const env = Object.create(process.env);
  env.SASS_BINARY_SITE = 'https://npm.taobao.org/mirrors/node-sass/';

  spawn('npm', ['install', 'node-sass'], { stdio: 'inherit', env: env })
    .on('close', () => {
      cb && cb();
    });
};

const ynpmInstall = (name, dest, cb) => {
  remind('Running ynpm install...');

  spawn('npm', ['install', '--registry=http://registry.npm.qima-inc.com'], { stdio: 'inherit' })
    .on('close', () => {
      successLog(name, dest);
      cb && cb();
    });
};

const create = (name, options) => {
  name = name || 'marx-demo';

  const boilPath = path.join(__dirname, '../boilerplate');
  const destPath = path.join(cwd, name);

  createLog(name);

  copyFiles(boilPath, destPath, () => {
    tpl.createTemplate(cwd, {
      './template/package.json.template': `${name}/package.json`,
      './template/superman.json.template': `${name}/superman.json`
    }, { name, version });

    if (options.silence) {
      successLog(name, destPath);
    } else {
      process.chdir(name);
      nodeSassInstall(() => ynpmInstall(name, destPath));
    }
  });
};

module.exports = create;
