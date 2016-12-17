import autobind from 'autobind-decorator';
import BaseController from './BaseController';
import LoginService from '../service/LoginService';
import router from '../filter/router';

@autobind
@router.root('/login')
export default class LoginController extends BaseController {
  constructor() {
    super();
    this.LoginService = new LoginService();
  }

  @router.get()
  async getLoginHtml(ctx) {
    const { user } = ctx.session;

    if (user) {
      ctx.redirect('/');
    } else {
      await ctx.render('Login', {
        title: 'MarX',
      });
    }
  }

  @router.post()
  async login(ctx) {
    const { SUCCESS, LOGIN_ERROR } = ctx.CODE;
    const { username, password, remember = false } = ctx.request.body;

    const account = await this.LoginService.loginCheck(username, password);

    if (account) {
      if (!remember) {
        ctx.session.cookie.maxAge = 24 * 60 * 60 * 1000;
      }
      ctx.session.user = account;
      ctx.json(SUCCESS);
    } else {
      ctx.json(LOGIN_ERROR);
    }
  }
}
