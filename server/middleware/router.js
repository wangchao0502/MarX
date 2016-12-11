import router from '../router/defaultRouter';
import * as Controllers from '../controller/index';

Object.keys(Controllers).forEach((ctlName) => {
  const controller = new Controllers[ctlName]();
  const $routes = controller.$routes;

  $routes.forEach((item) => {
    router[item.method](item.url, ...item.middleware, controller[item.fnName]);
  });
});

export default router;
