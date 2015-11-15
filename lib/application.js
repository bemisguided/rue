var EventEmitter2 = require('eventemitter2').EventEmitter2;
var Registry = require('./reg.js');
var Context = require('./context.js');
var strategies = require('./strategies');
var reflection = require('./utils/reflection');

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


  }

  function _getContext(name) {
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

  function _registerServiceOrFactory(name, instance) {
    if (reflection.hasMethod(instance, 'construct')) {
      _registry.register(name, strategies.TYPES.FACTORY, instance);
      return;
    }
    _registry.register(name, strategies.TYPES.SERVICE, instance);
  }

  /**
   * Returns a context instance for a given name.
   *
   * @param  {string} name [description]
   * @return {Context}      [description]
   */
  this.context = function(name) {
    _validateNameArgument(arguments);
    return _getContext(name);
  };

  /**
   * Registers a object for a given name to this application. Detects whether
   * the object is a factory or a service based on the presence of a contruct()
   * method.
   *
   * @param  {string} name     [description]
   * @param  {object} instance [description]
   */
  this.register = function(name, instance) {
    _validateNameArgument(arguments);
    _registerServiceOrFactory(name, instance);
  };

  /**
   * Registers a configuration object to this application. Detects whether
   * the object is a factory or a service based on the presence of a contruct()
   * method.
   *
   * @param  {object} config [description]
   */
  this.registerConfig = function(config) {
    _registerServiceOrFactory(CONFIG_NAME, config);
  };

  /**
   * Registers a logger object to this application. Detects whether
   * the object is a factory or a service based on the presence of a contruct()
   * method.
   *
   * @param  {object} logger [description]
   */
  this.registerLogger = function(logger) {
    _registerServiceOrFactory(LOGGER_NAME, logger);
  };

  /**
   * Registers a factory object to this application.
   *
   * @param  {string} name   [description]
   * @param  {object} config [description]
   */
  this.registerFactory = function(name, factory) {
    _validateNameArgument(arguments);
    _registry.register(name, strategies.TYPES.FACTORY, factory);
  };

  /**
   * Registers a prototype function to this application.
   *
   * @param  {string} name   [description]
   * @param  {function} prototype [description]
   */
  this.registerPrototype = function(name, prototype) {
    _validateNameArgument(arguments);
    _registry.register(name, strategies.TYPES.PROTOTYPE, prototype);
  };

  /**
   * Registers a service object to this application.
   *
   * @param  {string} name    [description]
   * @param  {object} service [description]
   */
  this.registerService = function(name, service) {
    _validateNameArgument(arguments);
    _registry.register(name, strategies.TYPES.SERVICE, service);
  };

}

// Support functions --------------------------------------

function _validateNameArgument(args) {
  if (args.length < 1) {
    throw new RueError('Illegal argument name is required');
  }
}
