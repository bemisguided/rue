var Q = require('q');
var registry = require('../../registry');
var reflection = require('../../utils/reflection');

// Module exports -----------------------------------------

module.exports.register = _register;

module.exports.startup = _startup;

module.exports.shutdown = _shutdown;

// Main functions -----------------------------------------

function _register(dependency, instance) {
  dependency.state = registry.STATES.STOPPED;
  dependency.instance = instance;
}

function _startup(config, dependency) {
  var deferred = Q.defer();
  var name = dependency.name;
  if (dependency.state !== registry.STATES.STOPPED) {
    deferred.reject(new Error('Service named ' + name + ' is already started'));
    return deferred.promise;
  }
  reflection.execute(name, dependency.instance, 'startup', config)
    .then(function() {
      dependency.state = registry.STATES.STARTED;
      deferred.resolve(dependency);
    })
    .catch(function(err) {
      deferred.reject(err);
    });
  return deferred.promise;
}

function _shutdown(config, dependency) {
  var deferred = Q.defer();
  var name = dependency.name;
  if (dependency.state !== registry.STATES.STARTED) {
    deferred.reject(new Error('Service named ' + name + ' is already shutdown'));
    return deferred.promise;
  }
  reflection.execute(name, dependency.instance, 'shutdown', config)
    .then(function() {
      dependency.state = registry.STATES.STOPPED;
      deferred.resolve(dependency);
    })
    .catch(function(err) {
      deferred.reject(err);
    });
  return deferred.promise;
}
