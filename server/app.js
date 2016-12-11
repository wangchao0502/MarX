import Koa from 'koa';
import Router from 'koa-router';
import convert from 'koa-convert';
import bunyan from 'bunyan';
import { app as appConfig } from './config/index';
import middleware from './middleware/index';
import IndexController from './controller/IndexController';
import LoginController from './controller/LoginController';

const Logger = bunyan.createLogger({ name: 'app' });
const ENV = process.env.NODE_ENV;
const APP_NAME = appConfig[ENV].name;
const APP_PORT = appConfig[ENV].port;

const app = new Koa();
const router = new Router();

const indexCtl = new IndexController();
const loginCtl = new LoginController();

router.get('/', indexCtl.indexHtml);
router.get('首页', '/index', indexCtl.indexHtml);
router.get('登陆', '/login', loginCtl.loginHtml);

app.use(middleware.error);
app.use(middleware.staticServer);
app.use(middleware.body);
app.use(middleware.render);
app.use(middleware.session);
app.use(convert(router.routes()));
app.use(convert(router.allowedMethods()));

app.listen(APP_PORT, () => {
  Logger.info(`${APP_NAME} is running, port: ${APP_PORT}`);
});

export default app;
