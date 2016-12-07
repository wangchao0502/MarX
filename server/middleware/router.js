import Router from 'koa-router';
import IndexController from '../controller/IndexController';

const router = new Router();

router.get('首页', '/index', IndexController.indexHtml);

export default async (ctx, next) => {
  await router.routes();
  await router.allowedMethods();
  await next();
};
