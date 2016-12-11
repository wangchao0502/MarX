import autobind from 'autobind-decorator';
import BaseController from './BaseController';
import LoginService from '../service/LoginService';

@autobind
export default class LoginController extends BaseController {

  async loginHtml(ctx) {
    const account = await LoginService.createRandomAccount();

    this.Logger.info(account.dataValues);

    await ctx.render('Login', {
      title: 'MarX',
    });
  }

}
