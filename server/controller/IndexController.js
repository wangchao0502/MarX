import autobind from 'autobind-decorator';
import BaseController from './BaseController';
import router from '../filter/router';
import authorize from '../filter/authorize';

@autobind
@router.root('/')
export default class IndexController extends BaseController {
  @router.auto
  @authorize
  async getIndexHtml(ctx) {
    await ctx.render('Index', {
      title: 'Welcome MarX',
    });
  }

  async check(ctx, next) {
    this.Logger.debug('Checking... Everything is OK');
    await next();
  }
}
