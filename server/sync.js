import { Models } from './model/model';

Object.keys(Models).forEach((key) => {
  Models[key].sync();
});
