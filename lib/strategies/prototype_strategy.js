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
