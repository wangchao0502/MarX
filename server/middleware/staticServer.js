import convert from 'koa-convert';
import path from 'path';
import koaStatic from 'koa-static';

const staticServer = convert(koaStatic(path.join(__dirname, '../../static')));

export default staticServer;
