import path from 'path';
import koaBody from 'koa-body';
import convert from 'koa-convert';

const body = convert(koaBody({
  formidable: { uploadDir: path.join('/tmp') },
  multipart: true,
  jsonLimit: '3mb',
  formLimit: '10mb',
  textLimit: '3mb',
}));

export default body;
