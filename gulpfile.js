'use strict';

const gulp = require('gulp');
const chalk = require('chalk');
const nodemon = require('gulp-nodemon');

const isInteractive = process.stdout.isTTY;

if (isInteractive) {
  console.log(chalk.yellow('Dev server is running...'));
}

gulp.task('dev', () => {
  nodemon({
    nodeArgs: ['--harmony'],
    watch: ['server/'],
    ignore: ['client/', 'static/'],
    script: 'server/babel.app.js',
  });
});
