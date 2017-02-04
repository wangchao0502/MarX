import { Models } from './model/model';

Object.keys(Models).forEach((key) => {
  Models[key].sync();
  // TODO:支持初始化数据
});
