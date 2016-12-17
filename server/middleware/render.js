import co from 'co';
import path from 'path';
import swigRender from 'koa-swig';

const ENV = process.env.NODE_ENV;

const baseRender = co.wrap(swigRender({
  root: path.join(__dirname, '../view'),
  autoescape: true,
  ext: 'html',
  cache: ENV === 'development' ? false : 'memory',
}));

function render(view, data = {}) {
  const scope = JSON.stringify(
    Object.assign(data.scope || {}, {
      env: 'development',
      cdnPrefix: 'https://b.yzcdn.cn/oa_static',
    }),
  );
  return baseRender.call(this, view, Object.assign(data, { scope }));
}

const middleware = async(ctx, next) => {
  ctx.render = render.bind(ctx);
  await next();
};

export default middleware;
