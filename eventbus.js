'use strict';

const EventEmitter = require('events').EventEmitter;
const browserSync = require('browser-sync').create();
const appConfig = require('./server/config/app.json');

const ENV = 'development';

const EventBus = new EventEmitter();

EventBus.on('MARX_RUNNING', function() {
  browserSync.init({
    proxy: 'http://' + appConfig[ENV].host + ':' + appConfig[ENV].port + '/login',
    files: ['static/**/*.*', 'server/view/**/*.html'],
    browser: 'google chrome',
    port: 54188,
    online: false,
    notify: false,
    scrollProportionally: false,
  });
});

module.exports = EventBus;
