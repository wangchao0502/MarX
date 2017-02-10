import Koa               from 'koa';
import convert           from 'koa-convert';
import bunyan            from 'bunyan';
import catchMiddleware   from '@youzan/marx/middleware/catch';
import bodyMiddleware    from '@youzan/marx/middleware/body';
import codeMiddleware    from '@youzan/marx/middleware/code';
import jsonMiddleware    from '@youzan/marx/middleware/json';
import errorMiddleware   from '@youzan/marx/middleware/error';
import sessionMiddleware from '@youzan/marx/middleware/session';
import staticMiddleware  from '@youzan/marx/middleware/static';
import renderMiddleware  from '@youzan/marx/middleware/render';
import routerMiddleware  from '@youzan/marx/middleware/router';
import appConfig         from './config/app.json';

const Logger   = bunyan.createLogger({ name: 'app' });
const ENV      = process.env.NODE_ENV;
const isProd   = ENV === 'production';
const APP_NAME = appConfig[ENV].name;
const APP_PORT = appConfig[ENV].port;

const app = new Koa();
// set for session
app.keys = [APP_NAME];

app.use(catchMiddleware);
app.use(bodyMiddleware);
app.use(codeMiddleware);
app.use(jsonMiddleware);
app.use(errorMiddleware);
app.use(sessionMiddleware);
app.use(staticMiddleware);
app.use(renderMiddleware({
  filters: {
    shorten: (str, count) => str.slice(0, count || 5),
  },
  noCache: !isProd,
  watch: !isProd,
}));
app.use(convert(routerMiddleware.routes()));
app.use(convert(routerMiddleware.allowedMethods()));

app.listen(APP_PORT, () => {
  Logger.info(`${APP_NAME} is running, port: ${APP_PORT}`);
});

export default app;
