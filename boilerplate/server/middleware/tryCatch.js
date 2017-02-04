import bunyan from 'bunyan';

const Logger = bunyan.createLogger({ name: 'GlobalError' });

const tryCatchMiddleware = async(ctx, next) => {
  try {
    await next();
  } catch (e) {
    Logger.error(e);
  }
};

export default tryCatchMiddleware;
