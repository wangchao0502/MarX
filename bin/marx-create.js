'use strict';

const fs      = require('fs');
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

const successLog = (name, dest) => {
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

const createLog = name => log(chalk.red(`Creating a new MarX app in ${name}...`));

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
  log(chalk.red('\nRunning copy boilerplates...\n'));

  vfs.src('**/*', { cwd: dirName, cwdbase: true, dot: true })
    .pipe(tplMiddleware(dest, dirName))
    .pipe(vfs.dest(dest))
    .on('end', () => cb && cb())
    .resume();
};


const nodeSassInstall = (cb) => {
  log(chalk.red('\nRunning node-sass fast install...\n'));

  const env = Object.create(process.env);
  env.SASS_BINARY_SITE = 'https://npm.taobao.org/mirrors/node-sass/';

  spawn('npm', ['install', 'node-sass'], { stdio: 'inherit', env: env })
    .on('close', () => {
      cb && cb();
    });
};

const ynpmInstall = (name, dest, cb) => {
  log(chalk.red('\nRunning ynpm install...\n'));

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
      './template/app.json.template': `${name}/server/config/app.json`
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
