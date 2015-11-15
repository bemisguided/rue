var strategies = require('./strategies');
var reflection = require('./utils/reflection');
var RueError = require('./utils/rue_error');

// Module exports -----------------------------------------

module.exports = Context;

// Main objects -------------------------------------------

/**
 * Context class.
 *
 * @type Context
 * @constructor
 * @param {string} name        [description]
 * @param {Application} application [description]
 */
function Context(name, application) {

  var _registry = application.registry;
  var _eventEmitter = application.eventEmitter;
  var _self = this;

  this.name = name;

  /**
   * Emit an event to the application.
   *
   * @param  {string} event [description]
   * @param  {...*} args [description]
   */
  this.emit = function(event) {
    var args = reflection.argsToArray(arguments);
    if (args.length < 1) {
      throw new RueError('Illegal argument event is required');
    }
    args[0] = name + ':' + args[0];
    _eventEmitter.emit.apply(_eventEmitter, args);
  };

  /**
   * Indicates if a dependency and exists for a given name.
   *
   * @param  {string} name [description]
   * @return {boolean}      [description]
   */
  this.exists = function(name) {
    _validateNameArgument(arguments);
    return _registry.exists(name);
  };

  /**
   * Returns the active dependency instance for a given name.
   *
   * @param  {string} name [description]
   * @return {object}      [description]
   */
  this.get = function(name) {
    _validateNameArgument(arguments);
    var dependency = _registry.get(name);
    if (!dependency.instance) {
      throw new RueError('Dependency does not exist named "' + name + '"');
    }
    return dependency.instance;
  };

  /**
   * Returns the active factory instance for a given name.
   *
   * @param  {string} name [description]
   * @return {object}      [description]
   */
  this.getFactory = function(name) {
    _validateNameArgument(arguments);
    var dependency = _registry.get(name, strategies.TYPES.FACTORY);
    return dependency.factory;
  };

  /**
   * Returns the active prototype function for a given name.
   *
   * @param  {string} name [description]
   * @return {function}      [description]
   */
  this.getPrototype = function(name) {
    _validateNameArgument(arguments);
    var dependency = _registry.get(name, strategies.TYPES.PROTOTYPE);
    return dependency.factory;
  };

  /**
   * Returns a newly constructed instance from an active prototype funciton
   * for a given name.
   *
   * @param  {string} name   [description]
   * @param  {...*} params   [description]
   * @return {object}        [description]
   */
  this.new = function(name, params) {
    var args = reflection.argsToArray(arguments);
    _validateNameArgument(args);
    var Obj = _self.getPrototype(args[0]);
    if (args.length > 1) {
      return (Obj.apply(Obj, args.slice(1)));
    }
    return new Obj();
  };

}

// Support functions --------------------------------------

function _validateNameArgument(args) {
  if (args.length < 1) {
    throw new RueError('Illegal argument name is required');
  }
}
