'use strict';

const fs    = require('fs');
const path  = require('path');
const chalk = require('chalk');

const log  = console.log;
const noop = () => {};

const parseTpl = (template, map, fallback) => {
  const get = (path, obj, fb) => path.split('.').reduce((res, key) => res[key] || fb || `$\{${path}}`, obj);
  return template.replace(/\$\{.+?}/g, match => get(match.substr(2, match.length - 3).trim(), map, fallback));
};

const createDir = (curPath, dirs) => {
  for (let dir of dirs) {
    try {
      log(chalk.green(`mkdir ${dir}`));
      fs.mkdirSync(path.resolve(curPath, dir));
    } catch (e) {
      log(chalk.red(`Client side folder ${dir} has existed.`));
    }
  }
};

const createTemplate = (curPath, templateMap, params) => {
  for (let templatePath in templateMap) {
    const template   = fs.readFileSync(path.resolve(__dirname, '../', templatePath), 'utf8');
    const targetPath = path.resolve(curPath, templateMap[templatePath]);

    log(chalk.green(`create ${targetPath.replace(curPath + '/', '')}`));
    fs.writeFile(targetPath, parseTpl(template, params), noop);
  }
};

module.exports = {
  parseTpl,
  createDir,
  createTemplate
};
