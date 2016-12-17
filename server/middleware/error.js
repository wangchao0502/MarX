function errorMiddleware(msg) {
  const ctx = this;
  if (!isNaN(msg) && [404, 403, 500].indexOf(+msg) > -1) {
    ctx.status = msg;
    ctx.redirect(msg);
  } else {
    ctx.body = {
      code: -1,
      msg,
    };
  }
}

const error = async(ctx, next) => {
  ctx.error = errorMiddleware.bind(ctx);
  await next();
};

export default error;
