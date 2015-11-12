var registry = require('./registry');

// Module exports -----------------------------------------

// Default instance of rue
module.exports = new registry.Registry();

// Constructor to create new instances of rue
module.exports.Rue = registry.Registry;
