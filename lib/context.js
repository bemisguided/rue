var strategies = require('./strategies');
var reflection = require('./utils/reflection');
var RueError = require('./utils/rue_error');

// Module exports -----------------------------------------

module.exports = Context;

// Main objects -------------------------------------------

function Context(name, application) {

  var _name = name;
  var _registry = application.registry;
  var _eventEmitter = application.eventEmitter;
  var _self = this;

  this.emit = function(event) {
    var args = reflection.argsToArray(arguments);
    if (args.length < 1) {
      throw new RueError('Illegal argument event is required');
    }
    args[0] = name + ':' + args[0];
    _eventEmitter.emit.call(_eventEmitter, args);
  };

  this.get = function(name) {
    _validateNameArgument(arguments);
    var dependency = _registry.get(name);
    if (!dependency.instance) {
      throw new RueError('Dependency does not exist named "' + name + '"');
    }
    return dependency.instance;
  };

  this.getFactory = function(name) {
    _validateNameArgument(arguments);
    var dependency = _registry.get(name, strategies.TYPES.FACTORY);
    return dependency.factory;
  };

  this.getPrototype = function(name) {
    _validateNameArgument(arguments);
    var dependency = _registry.get(name, strategies.TYPES.PROTOTYPE);
    return dependency.factory;
  };

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
