'use strict';

const gulp        = require('gulp');
const nodemon     = require('gulp-nodemon');
const appConfig   = require('./server/config/app.json');
const browserSync = require('browser-sync').create();

const ENV = 'development';
const BROWSER_SYNC_RELOAD_DELAY = 5000;

gulp.task('default', ['nodemon', 'browser-sync']);

gulp.task('dev:no-browser-sync', ['nodemon']);

gulp.task('cluster', ['nodemon:cluster', 'browser-sync']);

gulp.task('browser-sync', function() {
  setTimeout(function() {
    browserSync.init({
      proxy: 'http://' + appConfig[ENV].host + ':' + appConfig[ENV].port + '/login',
      files: ['static/**/*.*', 'server/view/**/*.html'],
      watchOptions: {
        ignored: 'static/css/common/**/*.*'
      },
      browser: 'google chrome',
      port: 54188,
      online: false,
      notify: false,
      scrollProportionally: false
    });
  }, BROWSER_SYNC_RELOAD_DELAY);
});

gulp.task('nodemon', function(cb) {
  return nodemon({
    watch: ['server/**/*.js', 'server/**/*.json'],
    script: 'server/app.js',
    execMap: {
      js: 'marx babel'
    },
    env: {
      NODE_ENV: ENV
    }
  });
});

gulp.task('nodemon:cluster', function(cb) {
  return nodemon({
    watch: ['server/**/*.js', 'server/**/*.json'],
    script: 'server/app.js',
    execMap: {
      js: 'marx babel --cluster'
    },
    env: {
      NODE_ENV: ENV
    }
  });
});
