import { parse, compile } from 'path-to-regexp';

function _typeof(obj) {
  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof = function(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function(obj) {
      return obj &&
        typeof Symbol === 'function' &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? 'symbol'
        : typeof obj;
    };
  }

  return _typeof(obj);
}

var checkEnv = process.env.NODE_ENV === 'development';
function include(base, routes) {
  var mappedRoutes = {
    toString: function toString() {
      return base;
    }
  };
  Object.keys(routes).forEach(function(route) {
    var url = routes[route];

    if (typeof url === 'function' && route === 'toString') {
      mappedRoutes.toString = function() {
        return base + routes.toString();
      };
    } else if (_typeof(url) === 'object') {
      // nested include - prefix all sub-routes with base
      mappedRoutes[route] = include(base, url);
    } else {
      // route - prefix with base and replace duplicate //
      mappedRoutes[route] =
        url.indexOf('/') === 0 ? url : [base, url].join('/').replace('//', '/');

      // R means a relative route without any prefixes. Add only once
      if (url.indexOf('/') !== 0) {
        mappedRoutes[`${route}R`] = url;
      }
    }
  });
  return mappedRoutes;
}

function compileWithParams(pattern) {
  var params =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var reversed = compile(pattern);
  return reversed(params);
}

function reverse(pattern) {
  var params =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  try {
    return compileWithParams(pattern, params);
  } catch (err) {
    return pattern;
  }
}
function reverseForce(pattern) {
  var params =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  try {
    return compileWithParams(pattern, params);
  } catch (err) {
    var tokens = parse(pattern);
    return tokens
      .filter(function(token) {
        return typeof token === 'string';
      })
      .join('');
  }
}

export { include, reverse, reverseForce };
