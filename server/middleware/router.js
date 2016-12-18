import fs from 'fs';
import path from 'path';
import Router from 'koa-router';
import defaultRouter from '../router/default.json';
import * as Controllers from '../controller/index';

const router = new Router();
const routerConfig = {};
/*
 * key is Controller name, value is a array with object
 * {
 *   method: 'get|post|all|delete|patch|put',
 *   url
 * }
 */
const defaultRouterConfig = {};

const addRouterConfig = (item) => {
  const { method } = item;
  if (!routerConfig[method]) {
    routerConfig[method] = [];
  }
  routerConfig[method].push(item);
};

const formatRouter = item => `[${item.method.toUpperCase()}] ${item.url} => ${item.ctrlName}.${item.fnName}`;

// deal with defaultRouter
Object.keys(defaultRouter).forEach((key) => {
  const [method, url] = key.split(' ');
  const [ctrlName, fnName] = defaultRouter[key].split('.');
  if (!defaultRouterConfig[ctrlName]) defaultRouterConfig[ctrlName] = [];
  defaultRouterConfig[ctrlName].push({
    method,
    url,
    fnName,
  });
});

Object.keys(Controllers).forEach((ctrlName) => {
  const controller = new Controllers[ctrlName]();
  const $routes = controller.$routes;

  // load default router config first
  (defaultRouterConfig[ctrlName] || []).forEach((item) => {
    addRouterConfig(Object.assign(item, { ctrlName }));
    router[item.method](item.url, controller[item.fnName]);
  });

  ($routes || []).forEach((item) => {
    addRouterConfig(Object.assign(item, { ctrlName }));
    router[item.method](item.url, ...item.middleware, controller[item.fnName]);
  });
});


// write config into file
const PRE_COMMENT = '# This file is auto generated when server is started.\n';
const result = Object
  .keys(routerConfig)
  .sort((a, b) => a.length - b.length)
  .map(key => routerConfig[key]
    .map(item => formatRouter(item))
    .sort((a, b) => a.length - b.length))
  .reduce((prev, next) => prev.concat(next), []);

result.unshift(PRE_COMMENT);

fs.writeFile(path.join(__dirname, '../router/router.config'), result.join('\n'));

export default router;
