'use strict';

const fs     = require('fs');
const path   = require('path');
const chalk  = require('chalk');
const string = require('./util/string');

const log     = console.log;
const cwd     = process.cwd();
const padding = string.padding;
const trueFuc = () => true;
const info    = text => log(chalk.green(`\n${text}\n`));
const remind  = text => log(chalk.red(`\n${text}\n`));


const list = (routeLines) => {
  remind('Router List:');
  info(
    routeLines.map((r, index) => `${padding(index + 1, 3, '0', 'left')}: ${r}`).join('\n')
  );
};

const find = (url, routes, controller, method) => {
  let path, route, m;

  const filters = [
    route => (path = route[1]) === '*' || path.indexOf(url) > -1,
    route => (m = route[0]) === '[ALL]' || m === `[${method.toUpperCase()}]`,
    route => route[3].split('.')[0].toUpperCase().indexOf(controller.toUpperCase()) > -1
  ];

  if (!controller) filters[2] = trueFuc;
  if (!method)     filters[1] = trueFuc;

  remind('Find Result:');
  info((
    route = routes.filter(x => filters.every(filter => filter(x)))).length ?
      route.map(x => x.join(' ')).join('\n') :
      'Not Found'
  );
};

const route = (url, options) => {
  const configPath  = path.resolve(cwd, 'server/router/router.config');

  let data = '';

  try {
    data = fs.readFileSync(configPath, 'utf8');
  } catch (err) {
    remind(err);
    remind('router.config file cannot find, please excute `npm run dev` to generate it.');
  }

  const routeLines = data.split('\n').slice(2);
  const routes     = routeLines.map(x => x.split(' '));
  const controller = options.controller;
  const method     = options.method;

  if (options.list) list(routeLines);
  if (options.find) find(url, routes, controller, method);
};

module.exports = route;
