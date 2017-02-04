function errorMiddleware(msg) {
  const ctx = this;
  if (!isNaN(msg) && [404, 403, 500].indexOf(+msg) > -1) {
    ctx.status = msg;
    ctx.redirect(msg);
  } else {
    let errorMsg = '';
    if (msg instanceof Error) {
      errorMsg = msg.message;
    } else if (typeof msg === 'string' || typeof msg === 'object') {
      errorMsg = msg;
    }
    ctx.body = { code: -1, msg: errorMsg };
  }
}

const error = async(ctx, next) => {
  ctx.error = errorMiddleware.bind(ctx);
  await next();
};

export default error;
