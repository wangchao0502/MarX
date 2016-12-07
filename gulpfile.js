'use strict';

const nodemon = require('gulp-nodemon');
const gulp = require('gulp');

gulp.task('dev', () => {
  nodemon({
    nodeArgs: ['--harmony'],
    watch: ['server/'],
    ignore: ['client/', 'static/'],
    script: 'server/babel.app.js',
  });
});
