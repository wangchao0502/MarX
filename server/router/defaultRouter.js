import Router from 'koa-router';
import IndexController from '../controller/IndexController';

const router = new Router();

// 这里只接受无法写在controller中的router配置
// 这个文件99%的情况是不需要写东西的
// 类似的登陆态检查，或者token校验，请写一个decorator注入到controller里
// router.all('*', XXXController.check);

export default router;
