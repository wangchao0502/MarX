const PREFIX = '$$route_';
const exportMethod = {};

function destruct(args) {
  const hasPath = typeof args[0] === 'string';
  const path = hasPath ? args[0] : '';
  const middleware = hasPath ? args.slice(1) : args;

  if (middleware.some(m => typeof m !== 'function')) {
    throw new Error('Middleware must be function');
  }

  return [path, middleware];
}

// @route(method, path: optional, ...middleware: optional)
function route(method, ...args) {
  if (typeof method !== 'string') {
    throw new Error('The first argument must be an HTTP method');
  }

  const [path, middleware] = destruct(args);

  return (target, name) => {
    target[`${PREFIX}${name}`] = { method, path, middleware };
  };
}

// @[method](...args) === @route(method, ...args)
const methods = ['get', 'post', 'put', 'patch', 'delete', 'all', 'redirect'];
methods.forEach((method) => {
  exportMethod[method] = route.bind(null, method);
});

function auto(target, name) {
  // parse key
  // add method into target
  const keyChips = name.split(/(?=[A-Z])/).map(x => x.toLowerCase());
  if (methods.indexOf(keyChips[0]) > -1) {
    const method = keyChips[0];
    const tail = keyChips[keyChips.length - 1];

    if (tail !== 'html' && tail !== 'json') {
      throw new Error(`method ${name} should end with Html or Json`);
    }
    if (keyChips.length < 3) {
      throw new Error('method body is not right');
    }
    if (keyChips.length === 3 && keyChips[1] === 'index') {
      keyChips[1] = '';
    }
    const path = `/${keyChips.slice(1, keyChips.length - 1).join('-')}`;
    target[`${PREFIX}${name}`] = { method, path, middleware: [] };
  } else {
    throw new Error(`method ${name} cannot match any legal word, please use follwing words: ${methods}`);
  }
}

// @controller(path: optional, ...middleware: optional)
function controller(...args) {
  const [ctrlPath, ctrlMiddleware] = destruct(args);

  return (target) => {
    const proto = target.prototype;
    proto.$routes = Object.getOwnPropertyNames(proto)
      .filter(prop => prop.indexOf(PREFIX) === 0)
      .map((prop) => {
        const { method, path, middleware: actionMiddleware } = proto[prop];
        const url = `${ctrlPath}${path}`.replace(/\/\//g, '/');
        const middleware = ctrlMiddleware.concat(actionMiddleware);
        const fnName = prop.substring(PREFIX.length);
        return { method, url, middleware, fnName };
      });
  };
}

exportMethod.auto = auto;
exportMethod.route = route;
exportMethod.root = controller;

export default exportMethod;
