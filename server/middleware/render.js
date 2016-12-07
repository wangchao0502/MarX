import co from 'co';
import path from 'path';
import swigRender from 'koa-swig';

const baseRender = co.wrap(swigRender({
  root: path.join(__dirname, '../view'),
  autoescape: true,
  ext: 'html',
  cache: 'memory',
}));

function render(view, data = {}) {
  data.scope = JSON.stringify(
    Object.assign(data.scope || {}, {
      env: 'development',
      cdnPrefix: 'https://b.yzcdn.cn/oa_static',
    })
  );
  return baseRender.call(this, view, data);
};

const middleware = async (ctx, next) => {
  ctx.render = render.bind(ctx);
  await next();
};

export default middleware;
