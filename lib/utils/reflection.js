var Q = require('q');
var introspect = require('introspect');
var RueError = require('./rue_error');

// Module exports -----------------------------------------

module.exports.argsToArray = _argsToArray;

module.exports.execute = _execute;

module.exports.existsMethod = _existsMethod;

// Main functions -----------------------------------------

function _argsToArray(args) {
  var result = [];
  for (var i = 0; i < args.length; i++) {
    result.push(args[i]);
  }
  return result;
}

function _execute(name, instance, method, scope) {
  var deferred = Q.defer();
  if (!_existsMethod(instance, method)) {
    deferred.resolve();
    return deferred.promise;
  }
  var fn = instance[method];
  var handler = _bindMethodHandler(name, method, fn, scope, deferred);
  if (!handler) {
    return deferred.promise;
  }
  handler();
  return deferred.promise;
}

function _existsMethod(instance, method) {
  return typeof instance[method] === 'function';
}

// Support functions --------------------------------------

function _bindMethodHandler(name, method, fn, scope, deferred) {
  var params = introspect(fn);
  var args = [];
  var handler = _bindSyncMethodHandler(fn, args, deferred);
  for (var i = 0; i < params.length; i++) {
    var param = params[i];
    if (param === 'callback') {
      args.push(_createCallback(method, name, deferred));
      handler = _bindAsyncMethodHandler(fn, args, deferred);
      continue;
    }
    if (scope[param]) {
      args.push(scope[param]);
      continue;
    }
    deferred.reject(new RueError('Unable to bind to method ' + method + '() for dependency ' + name + ' had an unexpected parameter ' + param));
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
