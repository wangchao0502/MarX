import fs from 'fs';
import path from 'path';
import router from '../router/defaultRouter';
import * as Controllers from '../controller/index';

const routerConfig = [];

Object.keys(Controllers).forEach((ctlName) => {
  const controller = new Controllers[ctlName]();
  const $routes = controller.$routes;

  $routes.forEach((item) => {
    routerConfig.push(`[${item.method.toUpperCase()}] ${item.url} => ${ctlName}.${item.fnName}`);
    router[item.method](item.url, ...item.middleware, controller[item.fnName]);
  });
});

// write config into file
const PRE_COMMENT = '# This file is auto generated when server is started.\n';
routerConfig.unshift(PRE_COMMENT);

fs.writeFile(path.join(__dirname, '../router/router.config'), routerConfig.join('\n'));

export default router;
