var util = require('util');

util.inherits(RueError, Error);

// Module exports -----------------------------------------

module.exports = RueError;

// Main objects -------------------------------------------

function RueError(message, options) {
  var _self = this;
  _self.name = 'RueError';
  _self.message = message;
  if (options && options.rootError) {
    _self.rootError = options.rootError;
  }
  if (options && options.details) {
    _self.details = options.details;
  }
  Error.captureStackTrace(_self, RueError);
}
