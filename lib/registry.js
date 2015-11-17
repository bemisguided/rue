var strategies = require('./strategies');
var matchProfile = require('./utils/profile_matcher');
var RueError = require('./utils/rue_error');

// Module exports -----------------------------------------

module.exports = Registry;

// Main objects -------------------------------------------

/**
 * Registry class.
 *
 * @type registry
 * @constructor
 */
function Registry() {

  var _activeDependencies = null;
  var _allDependencies = {};
  var _dependencyOrder = [];
  var _self = this;

  function _isActive() {
    if (_activeDependencies) {
      return true;
    }
    return false;
  }

  function _vaildateActive() {
    if (!_isActive()) {
      throw new RueError('Illegal state no active profiles');
    }
  }

  function _vaildateInactive() {
    if (_isActive()) {
      throw new RueError('Illegal state profiles are active');
    }
  }

  /**
   * Activates one or more profiles of registered dependencies. If no profile
   * is provided the default profile is activated.
   *
   * @param  {string|string[]} [profiles] [description]
   */
  this.activate = function(profiles) {
    _vaildateInactive();
    _activeDependencies = {};
    Object.keys(_allDependencies).forEach(function(name) {
      var dependencies = _allDependencies[name];
      dependencies.forEach(function(dependency) {
        if (matchProfile(profiles, dependency.profiles)) {
          _activeDependencies[dependency.name] = dependency;
        }
      });
    });
  };

  /**
   * Deactivates the currently active set of registered dependencies.
   */
  this.deactivate = function() {
    _vaildateActive();
    _activeDependencies = null;
  };

  /**
   * Indicates if a registered dependency for give name and optional type
   * exists and is active.
   *
   * @param  {string} name [description]
   * @param  {string} [type] [description]
   * @return {boolean}      [description]
   */
  this.exists = function(name, type) {
    _vaildateActive();
    var dependency = _activeDependencies[name];
    if (!dependency) {
      return false;
    }
    if (type && dependency.type !== type) {
      return false;
    }
    return true;
  };

  /**
   * Returns the active dependency registration for a given name and optional
   * type.
   *
   * @param  {string} name [description]
   * @param  {string} type [description]
   * @return {object}      [description]
   */
  this.get = function(name, type) {
    _vaildateActive();
    if (!_self.exists(name, type)) {
      var message = 'Dependency does not exist named "' + name + '"';
      if (type) {
        message += ' of type "' + type + '"';
      }
      throw new RueError(message);
    }
    var dependency = _activeDependencies[name];
    return dependency;
  };

  /**
   * Returns all dependency registrations for a given name and optional set of
   * profiles active or inactive.
   *
   * @param  {string} name     [description]
   * @param  {string|string[]} [profiles[] [description]
   * @return {object[]}          [description]
   */
  this.getRegistrations = function(name, profiles) {
    var result = [];
    var dependencies = _allDependencies[name];
    if (!dependencies) {
      return result;
    }
    dependencies.forEach(function(dependency) {
      if (matchProfile(profiles, dependency.profiles)) {
        result.push(dependency);
      }
    });
    return result;
  };

  /**
   * Indicates if the application is in an activated state.
   *
   * @return {boolean} [description]
   */
  this.isActive = function() {
    return _isActive();
  };

  /**
   * Returns an ordered list of active dependency registrations.
   *
   * @return {object[]} [description]
   */
  this.list = function() {
    _vaildateActive();
    var result = [];
    _dependencyOrder.forEach(function(name) {
      var dependency = _activeDependencies[name];
      if (dependency) {
        result.push(dependency);
      }
    });
    return result;
  };

  /**
   * Registers a dependency.
   *
   * @param  {string} name     [description]
   * @param  {string} type     [description]
   * @param  {object|function} instance [description]
   * @param  {string|string[]} [profiles] [description]
   */
  this.register = function(name, type, instance, profiles) {
    _vaildateInactive();
    var dependencies = _allDependencies[name];
    if (!dependencies) {
      dependencies = [];
      _allDependencies[name] = dependencies;
      _dependencyOrder.push(name);
    }

    var dependency = {
      name: name,
      type: type
    };

    if (profiles) {
      if (Array.isArray(profiles)) {
        dependency.profiles = profiles;
      } else {
        dependency.profiles = [profiles];
      }
    }
    strategies.get(type).register(dependency, instance);
    dependencies.push(dependency);
  };

  /**
   * Restores a stubbed active registered dependency.
   *
   * @param  {string} name [description]
   */
  this.restore = function(name) {
    _vaildateActive();
    var dependency = _activeDependencies[name];
    if (!dependency || !dependency.temp) {
      throw new RueError('Stubbed dependency could not be restored for name "' + name + '"');
    }
    dependency.instance = dependency.temp;
    delete dependency.temp;
  };

  /**
   * Temporarily stubs an active registered dependency with another instance.
   *
   * @param  {string} name [description]
   * @param  {object|function} stub [description]
   */
  this.stub = function(name, stub) {
    // TODO strategy for stubbing (i.e. prototype not propertly supported)
    _vaildateActive();
    var dependency = _activeDependencies[name];
    if (!dependency) {
      throw new RueError('Could not stub as no active dependency was not found for name "' + name + '"');
    }
    dependency.temp = dependency.instance;
    dependency.instance = stub;
  };

  /**
   * Unregisters a registered dependency for a given name.
   *
   * @param  {string} name [description]
   */
  this.unregister = function(name) {
    _vaildateInactive();
    delete _allDependencies[name];
    var index = _dependencyOrder.indexOf(name);
    if (index > -1) {
      _dependencyOrder.splice(index, 1);
    }
  };

}
