// superman build
const spawn = require('child_process').spawn;

spawn('superman', ['build'], { stdio: 'inherit' });
