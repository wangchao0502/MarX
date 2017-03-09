import route          from '@youzan/marx/filter/route';
import autobind       from '@youzan/marx/filter/autobind';
import authorize      from '@youzan/marx/filter/authorize';
import BaseController from '@youzan/marx/base/controller';

@autobind
@route.controller()
export default class IndexController extends BaseController {
  @authorize
  @route.auto
  async getIndexHtml(ctx) {
    await ctx.render('Index', {
      title: 'Welcome MarX',
    });
  }

  @route.auto
  async getWhoIsYourDaddyJson(ctx) {
    ctx.json({
      name: 'Raphael',
    });
  }

  @route.full.get('/show/me/the/money')
  async getFunnyJson(ctx) {
    ctx.json({
      minerals: 10000,
      gas: 10000,
    });
  }

  @route.get('/games/list.json')
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

  async httpRequestLog(ctx, next) {
    const url = ctx.request.url;
    const method = ctx.request.method;
    const start = new Date();
    this.Logger.info(`--> ${method} ${url}`);
    await next();
    const end = new Date();
    this.Logger.info(`<-- ${method} ${url} ${end.getTime() - start.getTime()}ms`);
  }
}
