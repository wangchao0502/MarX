import bunyan from 'bunyan';

const Logger = bunyan.createLogger({ name: 'GlobalError' });

const catchMiddleware = async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    Logger.error(e);
  }
};

export default catchMiddleware;
