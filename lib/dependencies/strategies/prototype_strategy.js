var Q = require('q');
var registry = require('../../registry');
var reflection = require('../../utils/reflection');

module.exports.register = _register;

module.exports.startup = _startup;

module.exports.shutdown = _shutdown;

function _register(dependency, instance) {
  dependency.factory = instance;
}

function _startup(config, dependency) {
  var deferred = Q.defer();
  deferred.resolve(dependency);
  return deferred.promise;
}

function _shutdown(config, dependency) {
  var deferred = Q.defer();
  deferred.resolve(dependency);
  return deferred.promise;
}
