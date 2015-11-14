var Q = require('q');
var reflection = require('../utils/reflection');

// TODO refactor out duplicates with registry.js
var STATES = {
  STOPPED: 'stopped',
  STARTED: 'started'
};

// Module exports -----------------------------------------

module.exports.register = _register;

module.exports.startup = _startup;

module.exports.shutdown = _shutdown;

// Main functions -----------------------------------------

function _register(dependency, instance) {
  dependency.state = STATES.STOPPED;
  dependency.instance = instance;
}

function _startup(scope, dependency) {
  var deferred = Q.defer();
  var name = dependency.name;
  if (dependency.state !== STATES.STOPPED) {
    deferred.reject(new Error('Service named ' + name + ' is already started'));
    return deferred.promise;
  }
  reflection.execute(name, dependency.instance, 'startup', scope)
    .then(function() {
      dependency.state = STATES.STARTED;
      deferred.resolve(dependency);
    })
    .catch(function(err) {
      deferred.reject(err);
    });
  return deferred.promise;
}

function _shutdown(scope, dependency) {
  var deferred = Q.defer();
  var name = dependency.name;
  if (dependency.state !== STATES.STARTED) {
    deferred.reject(new Error('Service named ' + name + ' is already shutdown'));
    return deferred.promise;
  }
  reflection.execute(name, dependency.instance, 'shutdown', scope)
    .then(function() {
      dependency.state = STATES.STOPPED;
      deferred.resolve(dependency);
    })
    .catch(function(err) {
      deferred.reject(err);
    });
  return deferred.promise;
}
