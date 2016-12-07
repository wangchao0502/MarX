'use strict';

const path = require('path');
const fs = require('fs');

const BUILD_PATH = path.resolve(__dirname, 'static');
const SRC_PATH = path.resolve(__dirname, 'client/js/src');

const generateEntries = (srcPath, name, entries) => {
  const paths = fs.readdirSync(srcPath);

  name = name || '';
  entries = entries || {};

  for (let i = 0; i < paths.length; i += 1) {
    if (fs.statSync(path.join(srcPath, paths[i])).isDirectory()) {
      generateEntries(`${srcPath}/${paths[i]}`, `${name}/${paths[i]}`, entries);
    } else if (fs.statSync(path.join(srcPath, paths[i])).isFile()) {
      if (paths.indexOf('main.jsx') > -1) {
        entries[`${name}`] = path.join(srcPath, 'main');
      }
    }
  }

  return entries;
};

const entries = generateEntries(SRC_PATH, 'js');

module.exports = {
  entry: entries,
  resolve: {
    extensions: ['', '.js', '.jsx', '.sass'],
  },
  output: {
    filename: '[name].js',
    path: BUILD_PATH,
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
    }, {
      test: /\.css$/,
      loaders: ['style-loader', 'css-loader'],
    }, {
      test: /\.scss$/,
      loaders: ['style-loader', 'css-loader', 'sass-loader'],
    }],
  },
};
