import path from 'path';
import convert from 'koa-convert';
import koaStatic from 'koa-static';

const cwd  = process.cwd();
const ENV  = process.env.NODE_ENV;
const prod = ENV === 'production' ? 'publish' : '';

const staticServer = convert(koaStatic(path.join(cwd, prod, 'static')));

export default staticServer;
