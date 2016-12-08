import randomName from 'random-name';
import { Models, redis } from '../model/model';

export default class LoginService {
  static async createRandomAccount() {
    await redis.set(['some other key', 'some val']);

    return await Models.Account.create({
      username: randomName(),
      password: 123456,
    });
  }
}
