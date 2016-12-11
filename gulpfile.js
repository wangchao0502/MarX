'use strict';

const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync').create();
const appConfig = require('./server/config/app.json');

const ENV = 'development';

gulp.task('default', ['dev']);

gulp.task('dev', ['nodemon']);

gulp.task('nodemon', function(cb) {
  let started = false;

  return nodemon({
    watch: ['server/'],
    script: 'server/babel.app.js',
    env: {
      NODE_ENV: ENV,
    },
  }).on('start', function() {
    if (!started) {
      setTimeout(() => {
        browserSync.init({
          proxy: 'http://' + appConfig[ENV].host + ':' + appConfig[ENV].port + '/login',
          files: ['static/**/*.*', 'server/view/**/*.html'],
          browser: 'google chrome',
          port: 54188,
          online: false,
          notify: false,
          scrollProportionally: false,
        });
      }, 8000);
      started = true;
    }
  });
});
