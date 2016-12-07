import session from 'koa-generic-session';
import redisStore from 'koa-redis';
import convert from 'koa-convert';
import {
  redis as redisConfig,
  app as appConfig,
} from '../config/index';

const ENV = process.env.NODE_ENV;

const sessionMiddleware = convert(session({
  store: redisStore(redisConfig[ENV]),
  prefix: `${appConfig[ENV].name}.sess`,
  cookie: appConfig[ENV].cookie,
}));

export default sessionMiddleware;
