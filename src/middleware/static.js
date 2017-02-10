import path from 'path';
import convert from 'koa-convert';
import koaStatic from 'koa-static';

const cwd = process.cwd();

const staticServer = convert(koaStatic(path.join(cwd, 'static')));

export default staticServer;
