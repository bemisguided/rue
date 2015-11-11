/**
 * Global test setup
 */
global.should = require('should');
global.sinon = require('sinon');
var sinonPromise = require('sinon-promise');
sinonPromise(global.sinon);

// Wrapper around require to simplify server testing
var __basedir = process.cwd() + '/lib';
global.appRequire = function(name) {
  return require(__basedir + '/' + name);
};
