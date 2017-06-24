/**
 * Global test setup
 */
// Wrapper around require to simplify server testing
let __basedir = process.cwd() + '/lib';
global.appRequire = function(name) {
  return require(__basedir + '/' + name);
};
