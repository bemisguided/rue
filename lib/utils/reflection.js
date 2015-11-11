var Q = require('q');
var introspect = require('introspect');

module.exports.execute = _execute;

function _execute(name, instance, method, config) {
  var deferred = Q.defer();
  if (typeof instance[method] !== 'function') {
    deferred.resolve();
    return deferred.promise;
  }
  var fn = instance[method];
  var handler = _bindMethodHandler(name, method, fn, config, deferred);
  if (!handler) {
    return deferred.promise;
  }
  handler();
  return deferred.promise;
}

function _bindMethodHandler(name, method, fn, config, deferred) {
  var params = introspect(fn);
  var args = [];
  var handler = _bindSyncMethodHandler(fn, args, deferred);
  for (var i = 0; i < params.length; i++) {
    var param = params[i];
    if (param === 'config') {
      args.push(config);
      continue;
    }
    if (param === 'callback') {
      args.push(_createCallback(method, name, deferred));
      handler = _bindAsyncMethodHandler(fn, args, deferred);
      continue;
    }
    deferred.reject(Error('Unable to bind to method ' + method + ' for dependency ' + name + ' had an unexpected parameter ' + param));
    return;
  }
  return handler;
}

function _bindAsyncMethodHandler(fn, args, deferred) {
  return function() {
    fn.apply(this, args);
  };
}

function _bindSyncMethodHandler(fn, args, deferred) {
  return function() {
    var value = fn.apply(this, args);
    deferred.resolve(value);
  };
}

function _createCallback(method, name, deferred) {
  return function(err, value) {
    if (err) {
      return deferred.reject(err);
    }
    deferred.resolve(value);
  };
}
