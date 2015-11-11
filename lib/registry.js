/**
 * Registry
 *
 * @module registry
 */
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
STRATEGIES[TYPES.FACTORY] = require('./dependencies/strategies/factory_strategy');
STRATEGIES[TYPES.LOGGER] = require('./dependencies/strategies/factory_strategy');
STRATEGIES[TYPES.PROTOTYPE] = require('./dependencies/strategies/prototype_strategy');
STRATEGIES[TYPES.SERVICE] = require('./dependencies/strategies/service_strategy');

util.inherits(Registry, EventEmitter2);

// Module exports -----------------------------------------

module.exports.STATES = STATES;

module.exports.TYPES = TYPES;

module.exports.Registry = Registry;

// Main objects -------------------------------------------

/**
 * Registry class.
 *
 * @constructor
 */
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

  /**
   * Registers a configuration to this registry.
   *
   * @param  {Object} config - The configuration as an associative hash array object
   */
  this.registerConfig = function(config) {
    _self.config = config;
  };

  this.registerLoggerFactory = function(loggerFactory) {
    _registerDependency('@logger', TYPES.LOGGER, loggerFactory);
  };

  /**
   * Registers a factory instance to this registry.
   *
   * @param  {string} name - The name of the factory
   * @param  {Object} factory - The factory instance
   */
  this.registerFactory = function(name, factory) {
    _registerDependency(name, TYPES.FACTORY, factory);
  };

  /**
   * Registers a prototype instance to this registry.
   *
   * @param  {string} name - The name of the factory
   * @param  {function} prototype - The prototype function for the factory
   */
  this.registerPrototype = function(name, prototype) {
    _registerDependency(name, TYPES.PROTOTYPE, prototype);
  };

  /**
   * Registers a service instance to this registry.
   *
   * @param  {string} name - The name of the service
   * @param  {Object} service - The service object instance
   */
  this.registerService = function(name, service) {
    _registerDependency(name, TYPES.SERVICE, service);
  };

  /**
   * Creates a new instance from a prototype.
   *
   * @param  {string} name - The name of the prototype
   * @param  {...*} params - The parameters for the creation of the new instance
   */
  this.new = function(name, params) {
    var Obj = _self.getPrototype(name);
    return new Obj(params);
  };

  /**
   * Indicates if a given dependency name exists.
   *
   * @param  {string} name - The dependency name
   * @return {boolean} Returns true if the dependency exists
   */
  this.exists = function(name) {
    return _dependenciesByName[name] !== undefined;
  };

  /**
   * Indicates if a given factory name exists.
   *
   * @param  {string} name - The factory name
   * @return {boolean} Returns true if the factory exists
   */
  this.existsFactory = function(name) {
    var dependency = _dependenciesByName[name];
    return dependency !== undefined && dependency.type === TYPES.FACTORY;
  };

  /**
   * Indicates if a given prototype name exists.
   *
   * @param  {string} name - The prototype name
   * @return {boolean} Returns true if the prototype exists
   */
  this.existsPrototype = function(name) {
    var dependency = _dependenciesByName[name];
    return dependency !== undefined && dependency.type === TYPES.PROTOTYPE;
  };

  /**
   * Indicates if a given service name exists.
   *
   * @param  {string} name - The service name
   * @return {boolean} Returns true if the service exists
   */
  this.existsService = function(name) {
    var dependency = _dependenciesByName[name];
    return dependency !== undefined && dependency.type === TYPES.SERVICE;
  };

  /**
   * Returns a dependency for a given name.
   *
   * @param  {string} name - The registered dependency name
   * @return {Object|function} The registered dependency instance
   */
  this.get = function(name) {
    var dependency = _dependenciesByName[name];
    if (!dependency) {
      throw new Error('Dependency named ' + name + ' could not be resolved');
    }
    return dependency.instance;
  };

  /**
   * Returns the factory function for a given factory name.
   *
   * @param  {string} name - The registered factory name
   * @return {function} The registered factory function
   */
  this.getFactory = function(name) {
    var dependency = _dependenciesByName[name];
    if (!dependency || dependency.type !== TYPES.FACTORY) {
      throw new Error('Factory named ' + name + ' could not be resolved');
    }
    return dependency.factory;
  };

  /**
   * Returns the prototype function for a given prototype name.
   *
   * @param  {string} name - The registered prototype name
   * @return {function} The registered prototype function
   */
  this.getPrototype = function(name) {
    var dependency = _dependenciesByName[name];
    if (!dependency || dependency.type !== TYPES.PROTOTYPE) {
      throw new Error('Prototype named ' + name + ' could not be resolved');
    }
    return dependency.factory;
  };

  /**
   * Indicates if a given service name is in a started state.
   *
   * @param  {string} name - The registered service name
   * @return {boolean} Returns true if the service is in a started state
   */
  this.isStarted = function(name) {
    var dependency = _dependenciesByName[name];
    if (!dependency || dependency.type !== TYPES.SERVICE) {
      throw new Error('Service named ' + name + ' could not be resolved');
    }
    return dependency.state === STATES.STARTED;
  };

  /**
   * Removes a dependency from the registry.
   *
   * @param  {string} name - The name of the registered dependency
   */
  this.remove = function(name) {
    delete _dependenciesByName[name];
  };

  /**
   * Restores a stubbed dependency to the registry.
   *
   * @param  {string} name - The name of the registered dependency
   */
  this.restore = function(name) {
    var dependency = _dependenciesByName[name];
    if (!dependency || !dependency.temp) {
      throw new Error('Stubbed dependency named ' + name + ' could not be restored');
    }
    dependency.instance = dependency.temp;
    delete dependency.temp;
  };

  /**
   * Starts up all sevices in the registry.
   */
  this.startup = function() {
    var promise = Q.when();
    _dependenciesByOrder.forEach(function(nextDependency) {
      promise = promise.then(function(dependency) {
        if (dependency && dependency.name[0] === '@') {
          _self[dependency.name.substring(1)] = dependency.instance;
        }
        return _resolveStrategy(nextDependency.type).startup(_self.config, nextDependency);
      });
    });
    return promise;
  };

  /**
   * Starts a specific service.
   *
   * @param  {string} name - The registered service name
   */
  this.startService = function(name) {
    var deferred = Q.defer();
    var dependency = _dependenciesByName[name];
    if (!dependency || dependency.type !== TYPES.SERVICE) {
      deferred.reject(new Error('Service named ' + name + ' could not be resolved'));
      return deferred.promise;
    }
    if (dependency.state !== STATES.STOPPED) {
      deferred.reject(new Error('Service named ' + name + ' is already started'));
      return deferred.promise;
    }
    _executeLifecycle('startup', name, _self.config, dependency.instance)
      .then(function() {
        dependency.state = STATES.STARTED;
        deferred.resolve(dependency);
      })
      .catch(function(err) {
        deferred.reject(err);
      });
    return deferred.promise;
  };

  /**
   * Builds a specific factory instance
   *
   * @param  {string} name - The registered dependency name
   */
  this._createInstance = function(name) {
    var deferred = Q.defer();
    var dependency = _dependenciesByName[name];
    if (!dependency || dependency.type === TYPES.SERVICE) {
      deferred.reject(new Error('Factory named ' + name + ' could not be resolved'));
      return deferred.promise;
    }
    _executeLifecycle('construct', name, _self.config, dependency.factory)
      .then(function(value) {
        dependency.instance = value;
        deferred.resolve(dependency);
      })
      .catch(function(err) {
        deferred.reject(err);
      });
    return deferred.promise;
  };

  /**
   * Starts up all sevices in the registry.
   */
  this.shutdown = function() {
    var promise = Q.when();
    _dependenciesByOrder.forEach(function(nextDependency) {
      promise = promise.then(function(dependency) {
        return _resolveStrategy(nextDependency.type).shutdown(_self.config, nextDependency);
      });
    });
    return promise;
  };

  /**
   * Shuts down a specific service.
   *
   * @param  {string} name - The registered service name
   */
  this.shutdownService = function(name) {
    var deferred = Q.defer();
    var dependency = _dependenciesByName[name];
    if (!dependency || dependency.type !== TYPES.SERVICE) {
      deferred.reject(new Error('Service named ' + name + ' could not be resolved'));
      return deferred.promise;
    }
    if (dependency.state !== STATES.STARTED) {
      deferred.reject(new Error('Service named ' + name + ' is already shutdown'));
      return deferred.promise;
    }
    _executeLifecycle('shutdown', name, _self.config, dependency.instance)
      .then(function() {
        dependency.state = STATES.STOPPED;
        deferred.resolve();
      })
      .catch(function(err) {
        deferred.reject(err);
      });
    return deferred.promise;
  };

  /**
   * Temporarily stubs a dependency with another instance for testing.
   *
   * @param  {string} name - The registered dependency name
   * @param  {Object|function} stub - The stubbing object or fuction
   */
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
