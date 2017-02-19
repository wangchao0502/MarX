// superman build pre && superman hash && superman cdn
// mkdir publish || true
// babel boilerplate/server --out-dir boilerplate/publish -x .js
const tpl   = require('./util/tpl');
const path  = require('path');
const chalk = require('chalk');
const spawn = require('child_process').spawn;

const log  = console.log;
const cwd  = process.cwd();
const info = text => log(chalk.green(`\n${text}\n`));

tpl.createDir(cwd, ['publish']);

const preBuild = (cb) => {
  info('Compile Client-side Js Files');

  spawn('superman', ['build', 'pre'], { stdio: 'inherit' })
    .on('close', () => {
      info('Compile Client-side Js Files Finish');

      cb && cb();
    });
};

const hash = (cb) => {
  info('Generate Client-side Js Files Hash Code');

  spawn('superman', ['hash'], { stdio: 'inherit' })
    .on('close', () => {
      info('Generate Client-side Js Files Hash Code Finish');

      cb && cb();
    });
};

const cdn = (cb) => {
  info('Upload Client-side Js Files to CDN');

  spawn('superman', ['cdn'], { stdio: 'inherit' })
    .on('close', () => {
      info('Upload Client-side Js Files to CDN Finish');

      cb && cb();
    });
};

const babel = (cb) => {
  info('Compile Server-side Js File');

  spawn('babel', [
      '--no-babelrc', 'server',
      '--out-dir', 'publish',
      '-x', '.js',
      '--presets', 'es2015,stage-0',
      '--plugins', 'transform-runtime,add-module-exports,transform-decorators-legacy'
    ], { stdio: 'inherit' })
    .on('close', () => {
      info('Compile Server-side Js File Completed!');
      cb && cb();
    });
};

preBuild(() => hash(() => cdn(() => babel())));
