'use strict';

const parseTpl = (template, map, fallback) => {
  const get = (path, obj, fb) => path.split('.').reduce((res, key) => res[key] || fb || `$\{${path}}`, obj);
  return template.replace(/\$\{.+?}/g, match => get(match.substr(2, match.length - 3).trim(), map, fallback));
};

module.exports = parseTpl;
