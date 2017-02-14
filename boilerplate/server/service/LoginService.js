import BaseService from '@youzan/marx/base/service';
import { Models }  from '../model/index';

export default class LoginService extends BaseService {

  async isUsernameHasUsed(username) {
    const result = await Models.Account.findOne({
      where: { username },
    });
    return !!result;
  }

  async register(account) {
    const { username, password } = account;

    if (!(username || ''.trim())) {
      throw new Error('username can not be empty');
    }
    if ((password || '').length < 6) {
      throw new Error('password can not less than 6 letters');
    }

    if (!(await this.isUsernameHasUsed(username))) {
      return await Models.Account.create(account);
    }

    throw new Error('username has been used');
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
