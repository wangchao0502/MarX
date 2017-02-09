import bunyan from 'bunyan';

export default class BaseService {
  constructor() {
    this.Logger = bunyan.createLogger({
      name: this.constructor.name,
      level: 'debug',
    });
  }
}
