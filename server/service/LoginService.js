import randomName from 'random-name';
import { Models } from '../model/model';

export default class LoginService {
  static async createRandomAccount() {
    return await Models.Account.create({
      username: randomName(),
      password: 123456,
    });
  }
}
