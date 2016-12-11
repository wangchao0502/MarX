'use strict';

const gulp = require('gulp');
const chalk = require('chalk');
const nodemon = require('gulp-nodemon');

const ENV = 'development';

gulp.task('default', ['dev']);

gulp.task('dev', ['nodemon']);

gulp.task('nodemon', function(cb) {
  let started = false;

  return nodemon({
    nodeArgs: ['--harmony'],
    watch: ['server/'],
    ignore: ['client/', 'static/'],
    script: 'server/babel.app.js',
    env: { NODE_ENV: ENV },
  }).on('start', function() {
    if (!started) {
      started = true;
    }
  });
});
