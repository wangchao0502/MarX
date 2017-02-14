import path from 'path';
import session from 'koa-generic-session';
import redisStore from 'koa-redis';
import convert from 'koa-convert';

const ENV = process.env.NODE_ENV;
const cwd = process.cwd();

const appConfig   = require(path.join(cwd, 'package.json')).config;
const redisConfig = require(path.join(cwd, 'server/config/redis'));

const sessionMiddleware = convert(session({
  store: redisStore(redisConfig[ENV]),
  prefix: `${appConfig[ENV].name}.sess.`,
}));

export default sessionMiddleware;
