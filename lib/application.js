var EventEmitter2 = require('eventemitter2').EventEmitter2;
var Registry = require('./reg.js');
var strategies = require('./strategies');
var reflection = require('./utils/reflection');

// Module exports -----------------------------------------

module.exports = Application;

// Main objects -------------------------------------------

function Application(registry, eventEmitter) {

  var _registry = new Registry();

  // Hook for testing
  if (registry) {
    _registry = registry;
  }

  var _eventEmitter = new EventEmitter2({
    wildcard: true,
    delimiter: ':',
    newListener: false,
    maxListeners: 20
  });

  if (eventEmitter) {
    _eventEmitter = _eventEmitter;
  }

  var _self = this;

  function _registerServiceOrFactory(name, instance) {
    if (reflection.hasMethod(instance, 'construct')) {
      _registry.register(name, strategies.TYPES.FACTORY, instance);
      return;
    }
    _registry.register(name, strategies.TYPES.SERVICE, instance);
  }

  this.register = function(name, instance) {
    _registerServiceOrFactory(name, instance);
  };

  this.registerConfig = function(config) {
    _registerServiceOrFactory('@config', config);
  };

  this.registerLogger = function(logger) {
    _registerServiceOrFactory('@logger', logger);
  };

  this.registerFactory = function(name, factory) {
    _registry.registry(name, strategies.TYPES.FACTORY, factory);
  };

  this.registerPrototype = function(name, prototype) {
    _registry.registry(name, strategies.TYPES.PROTOTYPE, prototype);
  };

  this.registerService = function(name, prototype) {
    _registry.registry(name, strategies.TYPES.SERVICE, prototype);
  };


}
