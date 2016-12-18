'use strict';

const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync').create();
const appConfig = require('./server/config/app.json');

const ENV = 'development';
const BROWSER_SYNC_RELOAD_DELAY = 10000;

gulp.task('default', ['nodemon', 'browser-sync']);

gulp.task('dev:no-browser-sync', ['nodemon']);

gulp.task('cluster', ['nodemon:cluster', 'browser-sync']);

gulp.task('browser-sync', function() {
  setTimeout(function() {
    browserSync.init({
      proxy: 'http://' + appConfig[ENV].host + ':' + appConfig[ENV].port + '/login',
      files: ['static/**/*.*', 'server/view/**/*.html'],
      watchOptions: {
        ignored: 'static/css/common/**/*.*',
      },
      browser: 'google chrome',
      port: 54188,
      online: false,
      notify: false,
      scrollProportionally: false,
    });
  }, BROWSER_SYNC_RELOAD_DELAY);

});

gulp.task('nodemon', function(cb) {
  return nodemon({
    watch: ['server/**/*.js', 'server/**/*.json'],
    script: 'server/babel.app.js',
    env: {
      NODE_ENV: ENV,
    },
  });
});

gulp.task('nodemon:cluster', function(cb) {
  return nodemon({
    watch: ['server/**/*.js', 'server/**/*.json'],
    script: 'server/babel.app.js',
    env: {
      NODE_ENV: ENV,
      NODE_CLUSTER: true
    },
  });
});
