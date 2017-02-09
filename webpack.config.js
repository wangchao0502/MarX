'use strict';

const fs = require('fs');
const path = require('path');

const generateEntries = (srcPath, n, e) => {
  // this version node do not support function param default values
  // so written as following codes
  const entries = e || {};
  const name    = n || '';
  const paths   = fs.readdirSync(srcPath);

  for (let i = 0; i < paths.length; i += 1) {
    const fileName  = paths[i];
    const fileState = fs.statSync(path.join(srcPath, fileName));
    const isDir     = fileState.isDirectory();
    const isFile    = fileState.isFile();
    const reg       = /\.js$/;

    if (isDir) {
      generateEntries(`${srcPath}/${fileName}`, `${name}/${fileName}`, entries);
    } else if (isFile && reg.test(fileName)) {
      entries[`${name}/${fileName.replace(reg, '')}`] = path.join(srcPath, fileName);
    }
  }

  return entries;
};

const entries = generateEntries(path.resolve(__dirname, 'src'));

module.exports = {
  entry: entries,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname)
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }],
  },
  node: {
    fs: 'empty',
    module: 'empty'
  }
};
