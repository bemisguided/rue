var Q = require('q');
var EventEmitter2 = require('eventemitter2').EventEmitter2;
var Registry = require('./registry');
var Context = require('./context');
var strategies = require('./strategies');
var reflection = require('./utils/reflection');
var RueError = require('./utils/rue_error');

// Constants ----------------------------------------------

var CONFIG_NAME = '@config';
var LOGGER_NAME = '@logger';
var CORE_DEPENDENCIES_ORDER = [CONFIG_NAME, LOGGER_NAME];

// Module exports -----------------------------------------

module.exports = Application;

// Main objects -------------------------------------------

/**
 * Application class.
 *
 * @constructor
 * @type Application
 */
function Application(registry, eventEmitter) {

  var _contexts = {};
  var _registry = new Registry();

  // Hook for testing
  /* istanbul ignore next */
  if (registry) {
    _registry = registry;
  }

  var _eventEmitter = new EventEmitter2({
    wildcard: true,
    delimiter: ':',
    newListener: false,
    maxListeners: 20
  });

  // Hook for testing
  /* istanbul ignore next */
  if (eventEmitter) {
    _eventEmitter = _eventEmitter;
  }

  var _self = this;

  function _activateOrder() {
    var list = [];
    CORE_DEPENDENCIES_ORDER.forEach(function(name) {
      if (_registry.exists(name)) {
        list.push(_registry.get(name));
      }
    });
    _registry.list().forEach(function(dependency) {
      if (CORE_DEPENDENCIES_ORDER.indexOf(dependency.name) > -1) {
        return;
      }
      list.push(dependency);
    });
    return list;
  }

  function _bindDirectDependencies() {
    _registry.list().forEach(function(dependency) {
      if (!dependency || dependency.name[0] !== '@') {
        return;
      }
      var bindName = dependency.name.substring(1);
      Object.keys(_contexts).forEach(function(name) {
        _contexts[name][bindName] = dependency.instance;
      });
    });
  }

  function _getContext(name, mod) {
    var context = _contexts[name];
    if (context) {
      return context;
    }
    context = new Context(name, {
      registry: _registry,
      eventEmitter: _eventEmitter
    });
    _contexts[name] = context;
    return context;
  }

  function _registerServiceOrFactory(name, instance, profiles) {
    if (reflection.hasMethod(instance, 'construct')) {
      _registry.register(name, strategies.TYPES.FACTORY, instance, profiles);
      return;
    }
    _registry.register(name, strategies.TYPES.SERVICE, instance, profiles);
  }

  function _unbindDirectDependencies() {
    _registry.list().forEach(function(dependency) {
      if (!dependency || dependency.name[0] !== '@') {
        return;
      }
      var bindName = dependency.name.substring(1);
      Object.keys(_contexts).forEach(function(name) {
        delete _contexts[name][bindName];
      });
    });
  }

  /**
   * Activates the application for an optional set of profiles and initiating
   * all the registered dependencies.
   *
   * @param  {string|string[]} [profiles] [description]
   * @return {Q.promise}          [description]
   */
  this.activate = function(profiles) {
    _registry.activate(profiles);
    var dependencies = _activateOrder();
    var promise = Q.when();
    dependencies.forEach(function(nextDependency) {
      promise = promise.then(function(dependency) {
        var context = _getContext(nextDependency.name);
        var scope = {
          config: _self.config,
          context: context,
          rue: context
        };
        return strategies.get(nextDependency.type).startup(scope, nextDependency);
      });
    });
    promise = promise.then(function() {
      _bindDirectDependencies();
    });
    return promise;
  };

  /**
   * Returns a context instance for a given name.
   *
   * @param  {string} name [description]
   * @return {Context}      [description]
   */
  this.context = function(name, mod) {
    _validateNameArgument(arguments);
    return _getContext(name);
  };

  /**
   * Deactivates the application and deinitiating all the registered
   * dependencies.
   *
   * @return {Q.promise}          [description]
   */
  this.deactivate = function(profiles) {
    var dependencies = _activateOrder().reverse();
    var promise = Q.when();
    dependencies.forEach(function(nextDependency) {
      promise = promise.then(function(dependency) {
        var context = _getContext(nextDependency.name);
        var scope = {
          config: _self.config,
          context: context,
          rue: context
        };
        return strategies.get(nextDependency.type).shutdown(scope, nextDependency);
      });
    });
    promise = promise.then(function() {
      _unbindDirectDependencies();
      _registry.deactivate();
    });
    return promise;
  };

  /**
   * Registers a object for a given name to this application. Detects whether
   * the object is a factory or a service based on the presence of a contruct()
   * method.
   *
   * @param  {string} name     [description]
   * @param  {object} instance [description]
   * @param  {string|string[]} [profiles] [description]
   * @return {Context}      [description]
   */
  this.register = function(name, instance, profiles) {
    _validateNameArgument(arguments);
    _registerServiceOrFactory(name, instance, profiles);
    return _getContext(name);
  };

  /**
   * Registers a configuration object to this application. Detects whether
   * the object is a factory or a service based on the presence of a contruct()
   * method.
   *
   * @param  {object} config [description]
   * @param  {string|string[]} [profiles] [description]
   */
  this.registerConfig = function(config, profiles) {
    _registerServiceOrFactory(CONFIG_NAME, config, profiles);
  };

  /**
   * Registers a logger object to this application. Detects whether
   * the object is a factory or a service based on the presence of a contruct()
   * method.
   *
   * @param  {object} logger [description]
   * @param  {string|string[]} [profiles] [description]
   */
  this.registerLogger = function(logger, profiles) {
    _registerServiceOrFactory(LOGGER_NAME, logger, profiles);
  };

  /**
   * Registers a factory object to this application.
   *
   * @param  {string} name   [description]
   * @param  {object} config [description]
   * @param  {string|string[]} [profiles] [description]
   * @return {Context}      [description]
   */
  this.registerFactory = function(name, factory, profiles) {
    _validateNameArgument(arguments);
    _registry.register(name, strategies.TYPES.FACTORY, _toModule(factory), profiles);
    return _getContext(name);
  };

  /**
   * Registers a prototype function to this application.
   *
   * @param  {string} name   [description]
   * @param  {string|string[]} [profiles] [description]
   * @param  {function} prototype [description]
   */
  this.registerPrototype = function(name, prototype, profiles) {
    _validateNameArgument(arguments);
    _registry.register(name, strategies.TYPES.PROTOTYPE, prototype, profiles);
  };

  /**
   * Registers a service object to this application.
   *
   * @param  {string} name    [description]
   * @param  {object} service [description]
   * @param  {string|string[]} [profiles] [description]
   * @return {Context}      [description]
   */
  this.registerService = function(name, service, profiles) {
    _validateNameArgument(arguments);
    _registry.register(name, strategies.TYPES.SERVICE, _toModule(service), profiles);
    return _getContext(name);
  };

  /**
   * Restores a stubbed dependency to this application.
   *
   * @param  {string} name [description]
   */
  this.restore = function(name) {
    _validateNameArgument(arguments);
    _registry.restore(name);
  };

  /**
   * Temporarily stubs a dependency with another instance for testing of this
   * application.
   *
   * @param  {string} name [description]
   * @param  {object|functoin} stub [description]
   */
  this.stub = function(name, stub) {
    _validateNameArgument(arguments);
    _registry.stub(name, stub);
  };

}

// Support functions --------------------------------------

function _validateNameArgument(args) {
  if (args.length < 1) {
    throw new RueError('Illegal argument name is required');
  }
}

function _toModule(instance) {
  if (instance.constructor.name === 'Module') {
    return instance.exports;
  }
  return instance;
}
