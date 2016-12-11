import autobind from 'autobind-decorator';
import BaseController from './BaseController';

@autobind
export default class IndexController extends BaseController {
  async indexHtml(ctx) {
    ctx.redirect('/login');
  }
}
