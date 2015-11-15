var Q = require('q');
var EventEmitter2 = require('eventemitter2').EventEmitter2;
var util = require('util');

var TYPES = {
  FACTORY: 'factory',
  LOGGER: 'logger',
  PROTOTYPE: 'prototype',
  SERVICE: 'service'
};

var STATES = {
  STOPPED: 'stopped',
  STARTED: 'started'
};

var STRATEGIES = {};
STRATEGIES[TYPES.FACTORY] = require('./strategies/factory_strategy');
STRATEGIES[TYPES.LOGGER] = require('./strategies/factory_strategy');
STRATEGIES[TYPES.PROTOTYPE] = require('./strategies/prototype_strategy');
STRATEGIES[TYPES.SERVICE] = require('./strategies/service_strategy');

util.inherits(Registry, EventEmitter2);

// Module exports -----------------------------------------

module.exports.STATES = STATES;

module.exports.TYPES = TYPES;

module.exports.Registry = Registry;

// Main objects -------------------------------------------

function Registry() {

  EventEmitter2.call(this, {
    wildcard: true,
    delimiter: ':',
    newListener: false,
    maxListeners: 20
  });

  var _dependenciesByOrder = [];
  var _dependenciesByName = {};
  var _self = this;

  function _registerDependency(name, type, instance) {
    var order = _dependenciesByOrder.length;
    if (_dependenciesByName[name]) {
      order = _dependenciesByName[name].order;
    }
    var dependency = {
      name: name,
      type: type,
      order: order
    };
    _resolveStrategy(type).register(dependency, instance);
    _dependenciesByName[name] = dependency;
    _dependenciesByOrder[order] = dependency;
  }

  this.registerConfig = function(config) {
    _self.config = config;
  };

  this.registerLoggerFactory = function(loggerFactory) {
    _registerDependency('@logger', TYPES.LOGGER, loggerFactory);
  };

  this.registerFactory = function(name, factory) {
    _registerDependency(name, TYPES.FACTORY, factory);
  };

  this.registerPrototype = function(name, prototype) {
    _registerDependency(name, TYPES.PROTOTYPE, prototype);
  };

  this.registerService = function(name, service) {
    _registerDependency(name, TYPES.SERVICE, service);
  };

  this.new = function(name, params) {
    var Obj = _self.getPrototype(name);
    return new Obj(params);
  };

  this.exists = function(name) {
    return _dependenciesByName[name] !== undefined;
  };

  this.existsFactory = function(name) {
    var dependency = _dependenciesByName[name];
    return dependency !== undefined && dependency.type === TYPES.FACTORY;
  };

  this.existsPrototype = function(name) {
    var dependency = _dependenciesByName[name];
    return dependency !== undefined && dependency.type === TYPES.PROTOTYPE;
  };

  this.existsService = function(name) {
    var dependency = _dependenciesByName[name];
    return dependency !== undefined && dependency.type === TYPES.SERVICE;
  };

  this.get = function(name) {
    var dependency = _dependenciesByName[name];
    if (!dependency) {
      throw new Error('Dependency named ' + name + ' could not be resolved');
    }
    return dependency.instance;
  };

  this.getFactory = function(name) {
    var dependency = _dependenciesByName[name];
    if (!dependency || dependency.type !== TYPES.FACTORY) {
      throw new Error('Factory named ' + name + ' could not be resolved');
    }
    return dependency.factory;
  };

  this.getPrototype = function(name) {
    var dependency = _dependenciesByName[name];
    if (!dependency || dependency.type !== TYPES.PROTOTYPE) {
      throw new Error('Prototype named ' + name + ' could not be resolved');
    }
    return dependency.factory;
  };

  this.isStarted = function(name) {
    var dependency = _dependenciesByName[name];
    if (!dependency || dependency.type !== TYPES.SERVICE) {
      throw new Error('Service named ' + name + ' could not be resolved');
    }
    return dependency.state === STATES.STARTED;
  };

  this.remove = function(name) {
    delete _dependenciesByName[name];
  };

  this.restore = function(name) {
    var dependency = _dependenciesByName[name];
    if (!dependency || !dependency.temp) {
      throw new Error('Stubbed dependency named ' + name + ' could not be restored');
    }
    dependency.instance = dependency.temp;
    delete dependency.temp;
  };

  this.startup = function() {
    var promise = Q.when();
    _dependenciesByOrder.forEach(function(nextDependency) {
      promise = promise.then(function(dependency) {
        if (dependency && dependency.name[0] === '@') {
          _self[dependency.name.substring(1)] = dependency.instance;
        }
        var scope = {
          config: _self.config
        };
        return _resolveStrategy(nextDependency.type).startup(scope, nextDependency);
      });
    });
    return promise;
  };

  this.shutdown = function() {
    var promise = Q.when();
    _dependenciesByOrder.forEach(function(nextDependency) {
      promise = promise.then(function(dependency) {
        var scope = {
          config: _self.config
        };
        return _resolveStrategy(nextDependency.type).shutdown(scope, nextDependency);
      });
    });
    return promise;
  };

  this.stub = function(name, stub) {
    var dependency = _dependenciesByName[name];
    if (!dependency) {
      throw new Error('Could not stub dependency named ' + name + ' as it was not found');
    }
    dependency.temp = dependency.instance;
    dependency.instance = stub;
  };

}

// Supprt methods -----------------------------------------

function _resolveStrategy(type) {
  var strategy = STRATEGIES[type];
  if (!strategy) {
    // this should never happen
    throw new Error('Unsupported dependency type ' + type);
  }
  return strategy;
}
