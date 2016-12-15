import autobind from 'autobind-decorator';
import BaseController from './BaseController';
import Router from '../filter/router';

@autobind
@Router.root('/')
export default class IndexController extends BaseController {
  @Router.auto
  async getIndexHtml(ctx) {
    ctx.redirect('/login');
  }
}
