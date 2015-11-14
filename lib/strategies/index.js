var RueError = require('../utils/rue_error');

// Constants ----------------------------------------------

var TYPES = {
  FACTORY: 'factory',
  LOGGER: 'logger',
  PROTOTYPE: 'prototype',
  SERVICE: 'service'
};

var STRATEGIES = {};
STRATEGIES[TYPES.FACTORY] = require('./factory_strategy');
STRATEGIES[TYPES.LOGGER] = require('./factory_strategy');
STRATEGIES[TYPES.PROTOTYPE] = require('./prototype_strategy');
STRATEGIES[TYPES.SERVICE] = require('./service_strategy');

// Module exports -----------------------------------------

module.exports.TYPES = TYPES;

module.exports.get = _get;

// Module functions ---------------------------------------

function _get(type) {
  var strategy = STRATEGIES[type];
  if (!strategy) {
    // this should never happen
    throw new RueError('Unsupported dependency type "' + type + '"');
  }
  return strategy;
}
