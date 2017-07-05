import path from 'path';

const cwd  = process.cwd();
const ENV  = process.env.NODE_ENV;
const prod = ENV !== 'development' ? 'publish' : '';
const CODE = require(path.join(cwd, prod, 'server/config/code'));

const code = async (ctx, next) => {
  ctx.CODE = CODE;
  await next();
};

export default code;
