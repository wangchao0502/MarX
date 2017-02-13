'use strict';

const spawn = require('child_process').spawn;

const run = () => {
  const log  = console.log;
  const gulp = spawn('gulp',   ['--color']);
  const blog = spawn('bunyan', ['--color', '--time', 'local', '-o', 'short']);

  blog.stdout.setEncoding('utf8');
  gulp.stdout.on('data', data => blog.stdin.write(data));
  gulp.stderr.on('data', data => blog.stdin.write(data));
  blog.stdout.on('data', data => data.toString().split('\n').forEach(x => x && log(x)));
};

module.exports = run;
