var Q = require('q');
var reflection = require('../utils/reflection');

// Module exports -----------------------------------------

module.exports.register = _register;

module.exports.startup = _startup;

module.exports.shutdown = _shutdown;

// Main functions -----------------------------------------

function _register(dependency, instance) {
  dependency.factory = instance;
}

function _startup(scope, dependency) {
  var deferred = Q.defer();
  var name = dependency.name;
  if (!reflection.hasMethod(dependency.factory, 'construct')) {
    deferred.reject(new Error('Factory named ' + name + ' requires a construct() method'));
    return deferred.promise;
  }
  reflection.execute(name, dependency.factory, 'construct', scope)
    .then(function(value) {
      if (!value) {
        throw new Error('Factory named ' + name + ' construct() method did not yield an instance');
      }
      dependency.instance = value;
      deferred.resolve(dependency);
    })
    .catch(function(err) {
      deferred.reject(err);
    });
  return deferred.promise;
}

function _shutdown(scope, dependency) {
  var deferred = Q.defer();
  delete dependency.instance;
  deferred.resolve(dependency);
  return deferred.promise;
}
