var strategies = require('./strategies');
var matchProfile = require('./utils/profile_matcher');
var RueError = require('./utils/rue_error');

// Module exports -----------------------------------------

module.exports = Registry;

// Main objects -------------------------------------------

function Registry() {

  var _activeDependencies = {};
  var _allDependencies = {};
  var _dependencyOrder = [];
  var _self = this;

  this.activate = function(profiles) {
    _activeDependencies = [];
    Object.keys(_allDependencies).forEach(function(name) {
      var dependencies = _allDependencies[name];
      dependencies.forEach(function(dependency) {
        if (matchProfile(profiles, dependency.profiles)) {
          _activeDependencies[dependency.name] = dependency;
        }
      });
    });
  };

  this.deactivate = function() {
    _activeDependencies = [];
  };

  this.exists = function(name, type) {
    var dependency = _activeDependencies[name];
    if (!dependency) {
      return false;
    }
    if (type && dependency.type !== type) {
      return false;
    }
    return true;
  };

  this.get = function(name, type) {
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

  this.list = function() {
    var result = [];
    _dependencyOrder.forEach(function(name) {
      var dependency = _activeDependencies[name];
      if (dependency) {
        result.push(dependency);
      }
    });
    return result;
  };

  this.register = function(name, type, instance, profiles) {
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

  this.unregister = function(name) {
    delete _activeDependencies[name];
    delete _allDependencies[name];
    var index = _dependencyOrder.indexOf(name);
    if (index > -1) {
      _dependencyOrder.splice(index, 1);
    }
  };

}
