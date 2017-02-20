const path  = require('path');
const spawn = require('child_process').spawn;

const superman = path.resolve(__dirname, '../node_modules/@youzan/superman/index.js');

spawn(superman, ['build'], { stdio: 'inherit' });
