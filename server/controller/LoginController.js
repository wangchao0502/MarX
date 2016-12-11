import autobind from 'autobind-decorator';
import BaseController from './BaseController';
import LoginService from '../service/LoginService';
import Router from '../filter/router';

@autobind
@Router.root('/login')
export default class LoginController extends BaseController {

  @Router.get('/')
  async getLoginHtml(ctx) {
    const account = await LoginService.createRandomAccount();

    this.Logger.info(account.dataValues);

    await ctx.render('Login', {
      title: 'MarX',
    });
  }

}
