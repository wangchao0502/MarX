const tpl     = require('./util/tpl');
const vfs     = require('vinyl-fs');
const path    = require('path');
const chalk   = require('chalk');
const spawn   = require('child_process').spawn;
const through = require('through2');

const log    = console.log;
const cwd    = process.cwd();
const info   = text => log(chalk.green(`\n${text}`));
const remind = text => log(chalk.red(`\n${text}`));

const superman = require.resolve('@youzan/superman');
const babelCli = require.resolve('babel-cli/bin/babel.js');

const createDir = (cb) => {
  tpl.createDir(cwd, ['publish']);
  cb && cb();
};


const preBuild = (cb) => {
  info('Compile Client-side Js Files');

  spawn(superman, ['prd'], { stdio: 'inherit' })
    .on('close', () => {
      info('Compile Client-side Js Files Finish');

      cb && cb();
    });
};

const hash = (cb) => {
  info('Generate Client-side Js Files Hash Code');

  spawn(superman, ['hash'], { stdio: 'inherit' })
    .on('close', () => {
      info('Generate Client-side Js Files Hash Code Finish');

      cb && cb();
    });
};

const cdn = (cb) => {
  info('Upload Client-side Js Files to CDN');

  spawn(superman, ['cdn'], { stdio: 'inherit' })
    .on('close', () => {
      info('Upload Client-side Js Files to CDN Finish');

      cb && cb();
    });
};

const tplMiddleware = function(dest) {
  return through.obj(function(file, enc, cb) {
    if (!file.stat.isFile()) {
      return cb();
    }

    log(chalk.green(`copy ${file.path.replace('server/', 'publish/server/')}`));

    this.push(file);
    cb();
  });
};

const copyExtraFiles = (cb) => {
  const dest = path.resolve(cwd, 'publish');
  info('Copy Extra !.js Files...');

  vfs.src(['./server/**/*.*', './package.json', '!./server/**/*.js'], { cwd, cwdbase: true, dot: true })
    .pipe(tplMiddleware(dest))
    .pipe(vfs.dest(dest))
    .on('end', () => cb && cb());
};

const babel = (cb) => {
  info('Compile Server-side Js File');

  spawn(babelCli, [
      'server', '--out-dir', 'publish/server',
      '-x', '.js'
    ], { stdio: 'inherit' })
    .on('close', () => {
      info('Compile Server-side Js File Completed!');
      cb && cb();
    });
};

const run = (...tasks) => {
  const program = [() => {}];

  while (tasks.length) {
    const task = tasks.pop();
    const pos  = program.length - 1;

    program.push(() => task(program[pos]));
  }

  program[program.length - 1]();
};

run(createDir, preBuild, hash, cdn, babel, copyExtraFiles);
