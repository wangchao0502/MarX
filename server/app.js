import Koa from 'koa';
import convert from 'koa-convert';
import bunyan from 'bunyan';
import { app as appConfig } from './config/index';
import middleware from './middleware/index';

const Logger = bunyan.createLogger({ name: 'app' });
const ENV = process.env.NODE_ENV;
const APP_NAME = appConfig[ENV].name;
const APP_PORT = appConfig[ENV].port;

const app = new Koa();
const router = middleware.router;
// set for session
app.keys = [APP_NAME];

app.use(middleware.tryCatch);
app.use(middleware.body);
app.use(middleware.code);
app.use(middleware.json);
app.use(middleware.error);
app.use(middleware.render);
app.use(middleware.session);
app.use(middleware.staticServer);
app.use(convert(router.routes()));
app.use(convert(router.allowedMethods()));

app.listen(APP_PORT, () => {
  Logger.info(`${APP_NAME} is running, port: ${APP_PORT}`);
});

export default app;
