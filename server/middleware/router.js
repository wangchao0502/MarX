import fs from 'fs';
import path from 'path';
import Router from 'koa-router';
import defaultRouter from '../router/default.json';
import * as Controllers from '../controller/index';

const router = new Router();
const routerConfig = [];
/*
 * key is Controller name, value is a array with object
 * {
 *   method: 'get|post|all|delete|patch|put',
 *   url
 * }
 */
const defaultRouterConfig = {};
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
    routerConfig.push(`[${item.method.toUpperCase()}] ${item.url} => ${ctrlName}.${item.fnName}`);
    router[item.method](item.url, controller[item.fnName]);
  });

  $routes.forEach((item) => {
    routerConfig.push(`[${item.method.toUpperCase()}] ${item.url} => ${ctrlName}.${item.fnName}`);
    router[item.method](item.url, ...item.middleware, controller[item.fnName]);
  });
});

// write config into file
const PRE_COMMENT = '# This file is auto generated when server is started.\n';
routerConfig.unshift(PRE_COMMENT);

fs.writeFile(path.join(__dirname, '../router/router.config'), routerConfig.join('\n'));

export default router;
