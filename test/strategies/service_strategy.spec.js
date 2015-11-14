var registry = appRequire('./registry');
var strategy = appRequire('./strategies/service_strategy');

describe('./strategies/service_strategy.js', function() {

  describe('register()', function() {

    it('registers correctly', function() {
      var service = {
        foo: 'test'
      };
      var dependency = {};
      strategy.register(dependency, service);
      dependency.should.have.property('instance', service);
    });

  });

  describe('startup()', function() {

    it('service without a startup method', function(done) {
      var config = {
        foo: 'bar'
      };
      var scope = {
        config: config
      };
      var service = {};
      var dependency = {
        name: 'test',
        instance: service,
        state: registry.STATES.STOPPED
      };
      strategy.startup(scope, dependency)
        .then(function(dependency) {
          dependency.state.should.be.eql(registry.STATES.STARTED);
          done();
        })
        .done();
    });

    it('service with a startup method without a config or callback parameter', function(done) {
      var spy = sinon.spy();
      var config = {
        foo: 'bar'
      };
      var scope = {
        config: config
      };
      var service = {
        startup: function() {
          spy();
        }
      };
      var dependency = {
        name: 'test',
        instance: service,
        state: registry.STATES.STOPPED
      };
      strategy.startup(scope, dependency)
        .then(function(dependency) {
          dependency.state.should.be.eql(registry.STATES.STARTED);
          spy.calledOnce.should.be.true();
          done();
        })
        .done();
    });

    it('service with a startup method with a config but without a callback parameter', function(done) {
      var spy = sinon.spy();
      var config = {
        foo: 'bar'
      };
      var scope = {
        config: config
      };
      var service = {
        startup: function(config) {
          spy(config);
        }
      };
      var dependency = {
        name: 'test',
        instance: service,
        state: registry.STATES.STOPPED
      };
      strategy.startup(scope, dependency)
        .then(function(dependency) {
          dependency.state.should.be.eql(registry.STATES.STARTED);
          spy.calledWith(config).should.be.true();
          done();
        })
        .done();
    });

    it('service with a startup method with a config and callback parameter', function(done) {
      var spy = sinon.spy();
      var config = {
        foo: 'bar'
      };
      var scope = {
        config: config
      };
      var service = {
        startup: function(config, callback) {
          process.nextTick(function() {
            spy(config);
            callback();
          });
        }
      };
      var dependency = {
        name: 'test',
        instance: service,
        state: registry.STATES.STOPPED
      };
      strategy.startup(scope, dependency)
        .then(function(dependency) {
          dependency.state.should.be.eql(registry.STATES.STARTED);
          spy.calledWith(config).should.be.true();
          done();
        })
        .done();
    });

    it('throws exception for a service with a startup method containing an unrecognized parameter', function(done) {
      var config = {
        foo: 'bar'
      };
      var scope = {
        config: config
      };
      var service = {
        startup: function(foobar) {}
      };
      var dependency = {
        name: 'test',
        instance: service,
        state: registry.STATES.STOPPED
      };
      strategy.startup(scope, dependency)
        .catch(function(err) {
          err.message.should.be.eql('Unable to bind to method startup() for dependency test had an unexpected parameter foobar');
          done();
        })
        .done();
    });

    it('throws exception when attempting to start and already started service', function(done) {
      var config = {
        foo: 'bar'
      };
      var service = {
        startup: function() {}
      };
      var scope = {
        config: config
      };
      var dependency = {
        name: 'test',
        instance: service,
        state: registry.STATES.STARTED
      };
      strategy.startup(scope, dependency)
        .catch(function(err) {
          err.message.should.be.eql('Service named test is already started');
          done();
        })
        .done();
    });
  });

  describe('shutdown()', function() {

    it('service without a shutdown method', function(done) {
      var config = {
        foo: 'bar'
      };
      var scope = {
        config: config
      };
      var service = {};
      var dependency = {
        name: 'test',
        instance: service,
        state: registry.STATES.STARTED
      };
      strategy.shutdown(scope, dependency)
        .then(function(dependency) {
          dependency.state.should.be.eql(registry.STATES.STOPPED);
          done();
        })
        .done();
    });

    it('service with a shutdown method without a config or callback parameter', function(done) {
      var spy = sinon.spy();
      var config = {
        foo: 'bar'
      };
      var service = {
        shutdown: function() {
          spy();
        }
      };
      var scope = {
        config: config
      };
      var dependency = {
        name: 'test',
        instance: service,
        state: registry.STATES.STARTED
      };
      strategy.shutdown(scope, dependency)
        .then(function(dependency) {
          dependency.state.should.be.eql(registry.STATES.STOPPED);
          spy.calledOnce.should.be.true();
          done();
        })
        .done();
    });

    it('service with a shutdown method with a config but without a callback parameter', function(done) {
      var spy = sinon.spy();
      var config = {
        foo: 'bar'
      };
      var scope = {
        config: config
      };
      var service = {
        shutdown: function(config) {
          spy(config);
        }
      };
      var dependency = {
        name: 'test',
        instance: service,
        state: registry.STATES.STARTED
      };
      strategy.shutdown(scope, dependency)
        .then(function(dependency) {
          dependency.state.should.be.eql(registry.STATES.STOPPED);
          spy.calledWith(config).should.be.true();
          done();
        })
        .done();
    });

    it('service with a shutdown method with a config and callback parameter', function(done) {
      var spy = sinon.spy();
      var config = {
        foo: 'bar'
      };
      var scope = {
        config: config
      };
      var service = {
        shutdown: function(config, callback) {
          process.nextTick(function() {
            spy(config);
            callback();
          });
        }
      };
      var dependency = {
        name: 'test',
        instance: service,
        state: registry.STATES.STARTED
      };
      strategy.shutdown(scope, dependency)
        .then(function(dependency) {
          dependency.state.should.be.eql(registry.STATES.STOPPED);
          spy.calledWith(config).should.be.true();
          done();
        })
        .done();
    });

    it('throws exception for a service with a shutdown() method containing an unrecognized parameter', function(done) {
      var config = {
        foo: 'bar'
      };
      var scope = {
        config: config
      };
      var service = {
        shutdown: function(foobar) {}
      };
      var dependency = {
        name: 'test',
        instance: service,
        state: registry.STATES.STARTED
      };
      strategy.shutdown(scope, dependency)
        .catch(function(err) {
          err.message.should.be.eql('Unable to bind to method shutdown() for dependency test had an unexpected parameter foobar');
          done();
        })
        .done();
    });

    it('throws exception when attempting to shutdown and already stopped service', function(done) {
      var config = {
        foo: 'bar'
      };
      var scope = {
        config: config
      };
      var service = {
        shutdown: function() {}
      };
      var dependency = {
        name: 'test',
        instance: service,
        state: registry.STATES.STOPPED
      };
      strategy.shutdown(scope, dependency)
        .catch(function(err) {
          err.message.should.be.eql('Service named test is already shutdown');
          done();
        })
        .done();
    });
  });

});
