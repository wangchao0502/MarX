import fs from 'fs';
import path from 'path';
import nunjucks from 'nunjucks';
import uaParser from 'ua-parser-js';

const cwd  = process.cwd();
const ENV  = process.env.NODE_ENV;
const prod = ENV !== 'development' ? 'publish' : '';
const templatePath = path.resolve(cwd, prod, 'server/view');

const createEnv = (opts) => {
  const {
    autoescape = true,
    noCache = false,
    watch = false,
    throwOnUndefined = false,
  } = opts;

  const env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(templatePath, { noCache, watch }),
    { autoescape, throwOnUndefined },
  );

  if (opts.filters) {
    Object.keys(opts.filters).map(key => env.addFilter(key, opts.filters[key]));
  }
  return env;
};

const isMobile = (ua) => {
  const parsed = uaParser(ua);
  return parsed.device.type === 'mobile' || parsed.device.model === 'iPhone' || parsed.os.name === 'Android' || /iphone/i.test(ua);
};

const renderMiddleware = (opts) => {
  // 创建Nunjucks的env对象:
  const env = createEnv(opts);
  const ext = opts.ext || '.njk';

  // load global values
  Object.keys(opts.global || {}).forEach(key => {
    env.addGlobal(key, opts.global[key]);
  });

  return async (ctx, next) => {
    // 给ctx绑定render函数:
    ctx.render = (view, model = {}) => {
      let viewName = view;

      // 判断是否获取mobile模版, xxx.mobile.njk
      if (isMobile(ctx.headers['user-agent'])) {
        const mobileFileExist = fs.existsSync(path.join(templatePath, view, '.mobile', ext));
        viewName = mobileFileExist ? `${viewName}.mobile` : viewName;
      }

      // 把render后的内容赋值给response.body:
      ctx.response.body = env.render(viewName + ext, { ...ctx.state, ...model });
      // 设置Content-Type:
      ctx.response.type = 'text/html';
    };
    // 继续处理请求:
    await next();
  };
};

export default renderMiddleware;
