var Application = appRequire('./application');
var strategies = appRequire('./strategies');

describe('./application.js', function() {

  var application;
  var registry;
  var eventEmitter;

  beforeEach(function() {
    registry = {};
    eventEmitter = {};
    application = new Application(registry, eventEmitter);
  });

  describe('activate()', function() {

    var startupSpy;

    function _stubDependency(name, instance) {
      registry.exists.withArgs(name).returns(true);
      var dependency = {
        name: name,
        type: strategies.TYPES.SERVICE,
        state: 'stopped',
        instance: instance
      };
      registry.get.withArgs(name).returns(dependency);
      return dependency;
    }

    beforeEach(function() {
      startupSpy = sinon.spy();
      var config = {
        startup: function(context) {
          startupSpy(1, context);
        }
      };
      var logger = {
        startup: function(context) {
          startupSpy(2, context);
        }
      };
      var service = {
        startup: function(context) {
          startupSpy(3, context);
        }
      };
      registry.activate = sinon.stub();
      registry.get = sinon.stub();
      registry.exists = sinon.stub();
      registry.list = sinon.stub();
      registry.list.returns([_stubDependency('@logger', logger), _stubDependency('service', service), _stubDependency('@config', config)]);
    });

    it('activates a given set of profiles in the correct order and creates context instances', function(done) {
      var profiles = ['profile1', 'profile2'];
      application.activate(profiles)
        .then(function() {
          // Assert activate called with profiles
          registry.activate.calledWith(profiles).should.be.true();

          // Assert the startup order (i.e. core components before other services)
          startupSpy.firstCall.args[0].should.be.eql(1, '@config not called in correct order');
          startupSpy.secondCall.args[0].should.be.eql(2, '@logger not called in correct order');
          startupSpy.thirdCall.args[0].should.be.eql(3, 'service not called in correct order');
          startupSpy.callCount.should.be.eql(3);

          // Assert context instances created and appropriated injected to startup methods
          application.context('@config').should.have.property('name', '@config');
          startupSpy.firstCall.args[1].should.have.property('name', '@config');
          application.context('@logger').should.have.property('name', '@logger');
          startupSpy.secondCall.args[1].should.have.property('name', '@logger');
          application.context('service').should.have.property('name', 'service');
          startupSpy.thirdCall.args[1].should.have.property('name', 'service');
          done();
        })
        .done();
    });

  });

  describe('deactivate()', function() {

    var startupSpy;

    function _stubDependency(name, instance) {
      registry.exists.withArgs(name).returns(true);
      var dependency = {
        name: name,
        type: strategies.TYPES.SERVICE,
        state: 'started',
        instance: instance
      };
      registry.get.withArgs(name).returns(dependency);
      return dependency;
    }

    beforeEach(function() {
      startupSpy = sinon.spy();
      var config = {
        shutdown: function(context) {
          startupSpy(3, context);
        }
      };
      var logger = {
        shutdown: function(context) {
          startupSpy(2, context);
        }
      };
      var service = {
        shutdown: function(context) {
          startupSpy(1, context);
        }
      };
      registry.deactivate = sinon.stub();
      registry.get = sinon.stub();
      registry.exists = sinon.stub();
      registry.list = sinon.stub();
      registry.list.returns([_stubDependency('@logger', logger), _stubDependency('service', service), _stubDependency('@config', config)]);
    });

    it('deactivates a given set of profiles in the correct order', function(done) {
      application.deactivate()
        .then(function() {
          // Assert deactivate called
          registry.deactivate.calledOnce.should.be.true();

          // Assert the shutdown order
          startupSpy.firstCall.args[0].should.be.eql(1, 'service not called in correct order');
          startupSpy.secondCall.args[0].should.be.eql(2, '@logger not called in correct order');
          startupSpy.thirdCall.args[0].should.be.eql(3, '@config not called in correct order');
          startupSpy.callCount.should.be.eql(3);

          // Assert appropriated contexts injected to shutdown methods
          startupSpy.firstCall.args[1].should.have.property('name', 'service');
          startupSpy.secondCall.args[1].should.have.property('name', '@logger');
          startupSpy.thirdCall.args[1].should.have.property('name', '@config');
          done();
        })
        .done();
    });

  });

  describe('context', function() {

    it('creates a context for a given name on first call and returns it', function() {
      var name = 'text';
      var context = application.context(name);
      context.name.should.be.eql(name);
    });

    it('returns the same context on subsquent calls', function() {
      var name = 'text';
      var context = application.context(name);
      context.should.have.property('name', name);
      context.foobar = 'foo';
      context = application.context(name);
      context.should.have.property('name', name);
      context.should.have.property('foobar', 'foo');
    });

  });

  describe('register()', function() {

    it('detects a factory and registers it correctly', function() {
      // Setup
      registry.register = sinon.stub();
      var name = 'test';
      var profiles = ['profile1', 'profile2'];
      var factory = {
        construct: function() {}
      };

      // register()
      application.register(name, factory, profiles);

      // Assert
      registry.register.calledWith(name, strategies.TYPES.FACTORY, factory, profiles).should.be.true();
    });

    it('detects a service and registers it correctly', function() {
      // Setup
      registry.register = sinon.stub();
      var name = 'test';
      var profiles = ['profile1', 'profile2'];
      var service = {
        service: 'something'
      };

      // register()
      application.register(name, service, profiles);

      // Assert
      registry.register.calledWith(name, strategies.TYPES.SERVICE, service, profiles).should.be.true();
    });

    it('throws an error no name parameter given', function() {
      // register()
      (function() {
        application.register();
      }).should.throw('Illegal argument name is required');
    });

  });

  describe('registerConfig()', function() {

    it('detects a config as a factory and registers it correctly', function() {
      // Setup
      var profiles = ['profile1', 'profile2'];
      registry.register = sinon.stub();
      var factory = {
        construct: function() {}
      };

      // registerConfig()
      application.registerConfig(factory, profiles);

      // Assert
      registry.register.calledWith('@config', strategies.TYPES.FACTORY, factory, profiles).should.be.true();
    });

    it('detects a config as service and registers it correctly', function() {
      // Setup
      var profiles = ['profile1', 'profile2'];
      registry.register = sinon.stub();
      var service = {
        service: 'something'
      };

      // registerConfig()
      application.registerConfig(service, profiles);

      // Assert
      registry.register.calledWith('@config', strategies.TYPES.SERVICE, service, profiles).should.be.true();
    });

  });

  describe('registerFactory()', function() {

    function Module() {
      this.exports = {};
    }

    it('registers a factory correctly', function() {
      // Setup
      registry.register = sinon.stub();
      var name = 'test';
      var profiles = ['profile1', 'profile2'];
      var factory = {
        construct: function() {}
      };

      // registerFactory()
      var context = application.registerFactory(name, factory, profiles);

      // Assert
      context.should.have.property('name', name);
      registry.register.calledWith(name, strategies.TYPES.FACTORY, factory, profiles).should.be.true();
    });

    it('registers a factory from a CommonJS module correctly', function() {
      // Setup
      registry.register = sinon.stub();
      var name = 'test';
      var profiles = ['profile1', 'profile2'];
      var factory = {
        construct: function() {}
      };
      var module = new Module();
      module.exports = factory;

      // registerFactory()
      var context = application.registerFactory(name, module, profiles);

      // Assert
      context.should.have.property('name', name);
      registry.register.calledWith(name, strategies.TYPES.FACTORY, factory, profiles).should.be.true();
    });

  });

  describe('registerLogger()', function() {

    it('detects a logger as a factory and registers it correctly', function() {
      // Setup
      registry.register = sinon.stub();
      var profiles = ['profile1', 'profile2'];
      var factory = {
        construct: function() {}
      };

      // registerLogger()
      application.registerLogger(factory, profiles);

      // Assert
      registry.register.calledWith('@logger', strategies.TYPES.FACTORY, factory, profiles).should.be.true();
    });

    it('detects a logger as service and registers it correctly', function() {
      // Setup
      registry.register = sinon.stub();
      var profiles = ['profile1', 'profile2'];
      var service = {
        service: 'something'
      };

      // registerLogger()
      application.registerLogger(service, profiles);

      // Assert
      registry.register.calledWith('@logger', strategies.TYPES.SERVICE, service, profiles).should.be.true();
    });

  });

  describe('registerPrototype()', function() {

    it('registers a factory correctly', function() {
      // Setup
      registry.register = sinon.stub();
      var name = 'test';
      var profiles = ['profile1', 'profile2'];
      var Prototype = function() {};

      // registerPrototype()
      application.registerPrototype(name, Prototype, profiles);

      // Assert
      registry.register.calledWith(name, strategies.TYPES.PROTOTYPE, Prototype, profiles).should.be.true();
    });

    it('throws an error no name parameter given', function() {
      // registerPrototype()
      (function() {
        application.registerPrototype();
      }).should.throw('Illegal argument name is required');
    });

  });

  describe('registerService()', function() {

    function Module() {
      this.exports = {};
    }

    it('registers a service correctly', function() {
      // Setup
      registry.register = sinon.stub();
      var name = 'test';
      var profiles = ['profile1', 'profile2'];
      var service = {
        somthing: function() {}
      };

      // registerService()
      var context = application.registerService(name, service, profiles);

      // Assert
      context.should.have.property('name', name);
      registry.register.calledWith(name, strategies.TYPES.SERVICE, service, profiles).should.be.true();
    });

    it('registers a service from a CommonJS module correctly', function() {
      // Setup
      registry.register = sinon.stub();
      var name = 'test';
      var profiles = ['profile1', 'profile2'];
      var service = {
        somthing: function() {}
      };
      var module = new Module();
      module.exports = service;

      // registerService()
      var context = application.registerService(name, module, profiles);

      // Assert
      context.should.have.property('name', name);
      registry.register.calledWith(name, strategies.TYPES.SERVICE, service, profiles).should.be.true();
    });

    it('throws an error no name parameter given', function() {
      // registerService()
      (function() {
        application.registerService();
      }).should.throw('Illegal argument name is required');
    });

  });

  describe('restore()', function() {

    it('restores a stubbed instance correctly', function() {
      // Setup
      registry.restore = sinon.stub();
      var name = 'test';

      // restore()
      application.restore(name);

      // Assert
      registry.restore.calledWith(name).should.be.true();
    });

    it('throws an error no name parameter given', function() {
      // restore()
      (function() {
        application.restore();
      }).should.throw('Illegal argument name is required');
    });

  });

  describe('stub()', function() {

    it('stubs a given instance correctly', function() {
      // Setup
      registry.stub = sinon.stub();
      var name = 'test';
      var stub = {
        stub: 'stub'
      };

      // stub()
      application.stub(name, stub);

      // Assert
      registry.stub.calledWith(name, stub).should.be.true();
    });

    it('throws an error no name parameter given', function() {
      // stub()
      (function() {
        application.stub();
      }).should.throw('Illegal argument name is required');
    });

  });

});
