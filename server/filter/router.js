const PREFIX = '$$route_';
const exportMethod = {};
// define absolute url
exportMethod.full = {};

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
function route(method, isFull, ...args) {
  if (typeof method !== 'string') {
    throw new Error('The first argument must be an HTTP method');
  }

  const [path, middleware] = destruct(args);

  return (target, name) => {
    target[`${PREFIX}${isFull ? '1' : '0'}${name}`] = { method, path, middleware };
  };
}

// @[method](...args) === @route(method, ...args)
const methods = ['get', 'post', 'put', 'patch', 'delete'];
methods.forEach((method) => {
  exportMethod[method] = route.bind(null, method, false);
  exportMethod.full[method] = route.bind(null, method, true);
});

function baseAuto(target, name, descriptor, isFull) {
  // parse key
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
    let path = '';
    if (isFull) {
      path = `/${keyChips.slice(1, keyChips.length - 1).join('/')}`;
    } else {
      path = `/${keyChips.slice(1, keyChips.length - 1).join('-')}`;
    }
    // add method into controller
    target[`${PREFIX}${isFull ? '1' : '0'}${name}`] = { method, path, middleware: [] };
  } else {
    throw new Error(`method ${name} cannot match any legal word, please use follwing words: ${methods}`);
  }
}

const auto     = (...args) => baseAuto(...args, false);
const fullAuto = (...args) => baseAuto(...args, true);

// @controller(path: optional, ...middleware: optional)
function controller(...args) {
  const [ctrlPath, ctrlMiddleware] = destruct(args);

  return (target) => {
    const proto = target.prototype;
    proto.$routes = Object.getOwnPropertyNames(proto)
      .filter(prop => prop.indexOf(PREFIX) === 0)
      .map((prop) => {
        const { method, path, middleware: actionMiddleware } = proto[prop];
        const middleware = ctrlMiddleware.concat(actionMiddleware);
        const fnName = prop.substring(PREFIX.length + 1);
        const isFull = prop.charAt(PREFIX.length) === '1';
        const url = `${isFull ? '' : ctrlPath}${path}`.replace(/\/\//g, '/');
        return { method, url, middleware, fnName };
      });
  };
}

exportMethod.auto = auto;
exportMethod.full.auto = fullAuto;
exportMethod.root = controller;

export default exportMethod;
