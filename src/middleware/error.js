function errorMiddleware(...args) {
  const ctx = this;

  let errorCode = -1;
  let errorMsg = 'error';
  let errorData = {};

  if (args.length === 0) {
    ctx.body = { code: errorCode, msg: 'unknown error' };
  } else if (args.length === 1) {
    if (typeof args[0] === 'number') ctx.status = args[0];
    if (typeof args[0] === 'object') {
      if (args[0] instanceof Error) {
        ctx.body = { code: errorCode, msg: args[0].message };
      } else {
        ctx.body = { ...args[0] };
      }
    }
    if (typeof args[0] === 'string') ctx.body = { code: errorCode, msg: args[0] };
  } else if (args.length === 2) {
    errorData = args[1];

    if (typeof args[0] === 'object') {
      errorCode = args[0].code;
      errorMsg = args[0].msg;
    } else if (args[0] instanceof Error) {
      errorMsg = args[0].message;
    }
    if (typeof args[0] === 'string') errorMsg = args[0];

    ctx.body = { code: errorCode, msg: errorMsg, data: errorData };
  } else {
    ctx.body = { code: errorCode, msg: 'ctx.error call failed' };
  }
}

const error = async (ctx, next) => {
  ctx.error = errorMiddleware.bind(ctx);
  await next();
};

export default error;
