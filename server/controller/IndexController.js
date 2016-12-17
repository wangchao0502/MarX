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

  @router.full.auto
  async getWhoIsYourDaddyJson(ctx) {
    ctx.json({
      name: 'Raphael',
    });
  }

  @router.full.get('/show/me/the/money')
  async getFunnyJson(ctx) {
    ctx.json({
      minerals: 10000,
      gas: 10000,
    });
  }

  @router.get('/games/list.json')
  async getGamesListJson(ctx) {
    ctx.json([
      '星际争霸',
      '魔兽世界',
      '守望先锋',
      '反恐精英',
      '红色警戒',
      '剑侠情缘',
      '海岛奇兵',
      '炉石传说',
    ]);
  }

  async check(ctx, next) {
    this.Logger.debug('Checking... Everything is OK');
    await next();
  }
}
