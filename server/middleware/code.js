import * as CODE from '../constant/code';

const code = async(ctx, next) => {
  ctx.CODE = CODE;
  await next();
};

export default code;
