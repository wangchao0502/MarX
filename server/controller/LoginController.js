import autobind from 'autobind-decorator';
import BaseController from './BaseController';
import LoginService from '../service/LoginService';
import route from '../filter/router';
import appConfig from '../config/app.json';

@autobind
@route.controller()
export default class LoginController extends BaseController {
  constructor() {
    super();
    this.LoginService = new LoginService();
  }

  @route.get('/login')
  @route.get('/register')
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

  @route.post('/login')
  async login(ctx) {
    const { SUCCESS, LOGIN_ERROR } = ctx.CODE;
    const { username, password, remember = false } = ctx.request.body;

    try {
      const account = await this.LoginService.loginCheck(username, password);

      if (account) {
        ctx.session.cookie.maxAge = remember ? appConfig[process.env.NODE_ENV].cookie.maxAge : null;
        ctx.session.user = account;
        ctx.json(SUCCESS);
      } else {
        ctx.json(LOGIN_ERROR);
      }
    } catch (error) {
      ctx.error(error);
    }
  }

  @route.post('/register')
  async register(ctx) {
    const { SUCCESS } = ctx.CODE;
    const { username, password } = ctx.request.body;

    try {
      const account = await this.LoginService.register({ username, password });
      ctx.session.user = account.toJSON();
      ctx.json(SUCCESS);
    } catch (error) {
      ctx.error(error);
    }
  }

  @route.get('/logout')
  async logout(ctx) {
    ctx.session = null;
    ctx.redirect('login');
  }

}
