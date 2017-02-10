function jsonMiddleware(status, data) {
  this.body = { ...status, data };
}

const json = async (ctx, next) => {
  ctx.json = jsonMiddleware.bind(ctx);
  await next();
};

export default json;
