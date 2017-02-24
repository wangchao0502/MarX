const spawn = require('child_process').spawn;

const superman = require.resolve('@youzan/superman');

spawn(superman, ['build'], { stdio: 'inherit' });
