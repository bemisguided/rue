var registry = appRequire('./registry');
var strategy = appRequire('./strategies/prototype_strategy');

describe('./strategies/prototype_strategy.js', function() {

  describe('register()', function() {

    it('registers correctly', function() {
      var Function = function() {};
      var dependency = {};
      strategy.register(dependency, Function);
      dependency.should.have.property('factory', Function);
    });

  });

  describe('startup()', function() {

    it('startsup correctly', function(done) {
      var config = {
        foo: 'bar'
      };
      var Function = function() {};
      var dependency = {
        name: 'test',
        factory: Function
      };
      var assert = JSON.stringify(dependency);
      strategy.startup(config, dependency)
        .then(function(dependency) {
          JSON.stringify(dependency).should.be.eql(assert);
          done();
        })
        .done();
    });
  });

  describe('shutdown()', function() {

    it('shutsdown correctly', function(done) {
      var config = {
        foo: 'bar'
      };
      var Function = function() {};
      var dependency = {
        name: 'test',
        factory: Function
      };
      var assert = JSON.stringify(dependency);
      strategy.shutdown(config, dependency)
        .then(function(dependency) {
          JSON.stringify(dependency).should.be.eql(assert);
          done();
        })
        .done();
    });
  });

});
