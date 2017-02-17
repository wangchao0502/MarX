import Koa               from 'koa';
import bunyan            from 'bunyan';
import convert           from 'koa-convert';
import catchMiddleware   from '@youzan/marx/middleware/catch';
import bodyMiddleware    from '@youzan/marx/middleware/body';
import codeMiddleware    from '@youzan/marx/middleware/code';
import jsonMiddleware    from '@youzan/marx/middleware/json';
import errorMiddleware   from '@youzan/marx/middleware/error';
import sessionMiddleware from '@youzan/marx/middleware/session';
import staticMiddleware  from '@youzan/marx/middleware/static';
import renderMiddleware  from '@youzan/marx/middleware/render';
import routerMiddleware  from '@youzan/marx/middleware/router';
import jsCDN             from './config/version_js.json';
import cssCDN            from './config/version_css.json';
import pkgJson           from '../package.json';

const Logger   = bunyan.createLogger({ name: 'app' });
const ENV      = process.env.NODE_ENV;
const isProd   = ENV === 'production';
const APP_NAME = pkgJson.name;
const APP_PORT = pkgJson.config[ENV].port;
const CDN_HOST = `https://b.yzcdn.cn/${APP_NAME}/`;

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
    js: name => (isProd ? `${CDN_HOST}${jsCDN[name]}` : `/${name}`),
    css: name => (isProd ? `${CDN_HOST}${cssCDN[name]}` : `/${name}`),
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
