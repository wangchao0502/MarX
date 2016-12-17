import randomName from 'random-name';
import BaseService from './BaseService';
import { Models, redis } from '../model/model';

export default class LoginService extends BaseService {
  async createRandomAccount() {
    await redis.set(['some other key', 'some val']);

    return await Models.Account.create({
      username: randomName(),
      password: 123456,
    });
  }

  async loginCheck(username, password) {
    return await Models.Account.findOne({
      where: {
        username,
        password,
      },
    });
  }

}
