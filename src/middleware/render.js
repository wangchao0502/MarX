import path from 'path';
import nunjucks from 'nunjucks';

const createEnv = (opts) => {
  const {
    autoescape = true,
    noCache = false,
    watch = false,
    throwOnUndefined = false,
  } = opts;

  const cwd  = process.cwd();
  const ENV  = process.env.NODE_ENV;
  const prod = ENV === 'production' ? 'publish' : '';

  const env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(path.resolve(cwd, prod, 'server/view'), { noCache, watch }),
    { autoescape, throwOnUndefined },
  );

  if (opts.filters) {
    Object.keys(opts.filters).map(key => env.addFilter(key, opts.filters[key]));
  }
  return env;
};

const renderMiddleware = (opts) => {
  // 创建Nunjucks的env对象:
  const env = createEnv(opts);
  const ext = opts.ext || '.njk';
  return async (ctx, next) => {
    // 给ctx绑定render函数:
    ctx.render = (view, model) => {
      // 把render后的内容赋值给response.body:
      ctx.response.body = env.render(view + ext, Object.assign({}, ctx.state || {}, model || {}));
      // 设置Content-Type:
      ctx.response.type = 'text/html';
    };
    // 继续处理请求:
    await next();
  };
};

export default renderMiddleware;
