var strategy = appRequire('./strategies/factory_strategy');

describe('./strategies/factory_strategy.js', function() {

  describe('register()', function() {

    it('registers correctly', function() {
      var Function = function() {};
      var dependency = {};
      strategy.register(dependency, Function);
      dependency.should.have.property('factory', Function);
    });

  });


  describe('startup()', function() {

    it('factory with a construct method without a config or callback parameter', function(done) {
      var instance = {
        test: 'instance'
      };
      var config = {
        foo: 'bar'
      };
      var scope = {
        config: config
      };
      var factory = {
        construct: function() {
          return instance;
        }
      };
      var dependency = {
        name: 'test',
        factory: factory
      };
      strategy.startup(scope, dependency)
        .then(function(dependency) {
          dependency.should.have.property('instance', instance);
          done();
        })
        .done();
    });

    it('factory with a construct method with a config but without a callback parameter', function(done) {
      var spy = sinon.spy();
      var instance = {
        test: 'instance'
      };
      var config = {
        foo: 'bar'
      };
      var scope = {
        config: config
      };
      var factory = {
        construct: function() {
          spy(config);
          return instance;
        }
      };
      var dependency = {
        name: 'test',
        factory: factory
      };
      strategy.startup(scope, dependency)
        .then(function(dependency) {
          dependency.should.have.property('instance', instance);
          spy.calledWith(config).should.be.true();
          done();
        })
        .done();
    });

    it('factory with a construct method with a config and callback parameter', function(done) {
      var spy = sinon.spy();
      var instance = {
        test: 'instance'
      };
      var config = {
        foo: 'bar'
      };
      var scope = {
        config: config
      };
      var factory = {
        construct: function(config, callback) {
          process.nextTick(function() {
            spy(config);
            callback(null, instance);
          });
        }
      };
      var dependency = {
        name: 'test',
        factory: factory
      };
      strategy.startup(scope, dependency)
        .then(function(dependency) {
          dependency.should.have.property('instance', instance);
          spy.calledWith(config).should.be.true();
          done();
        })
        .done();
    });

    it('throws exception for a factory with a construct method containing an unrecognized parameter', function(done) {
      var config = {
        foo: 'bar'
      };
      var scope = {
        config: config
      };
      var factory = {
        construct: function(foobar) {}
      };
      var dependency = {
        name: 'test',
        factory: factory
      };
      strategy.startup(scope, dependency)
        .catch(function(err) {
          err.message.should.be.eql('Unable to bind to method construct() for dependency test had an unexpected parameter foobar');
          done();
        })
        .done();
    });

    it('throws exception when factory does not have a construct method', function(done) {
      var config = {
        foo: 'bar'
      };
      var scope = {
        config: config
      };
      var factory = {};
      var dependency = {
        name: 'test',
        factory: factory
      };
      strategy.startup(scope, dependency)
        .catch(function(err) {
          err.message.should.be.eql('Factory named test requires a construct() method');
          done();
        })
        .done();
    });

    it('throws exception when factory\'s construct method does not return anything', function(done) {
          var config = {
            foo: 'bar'
          };
          var scope = {
            config: config
          };
          var factory = {
            construct: function() {
            }
          };
          var dependency = {
            name: 'test',
            factory: factory
          };
          strategy.startup(scope, dependency)
            .catch(function(err) {
              err.message.should.be.eql('Factory named test construct() method did not yield an instance');
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
      var scope = {
        config: config
      };
      var factory = {
        construct: function() {
          return {};
        }
      };
      var dependency = {
        name: 'test',
        factory: factory,
        instance: {}
      };
      strategy.shutdown(scope, dependency)
        .then(function(dependency) {
          dependency.should.not.have.property('instance');
          done();
        })
        .done();
    });

  });

});
