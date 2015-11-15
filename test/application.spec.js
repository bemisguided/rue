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
      var factory = {
        construct: function() {}
      };

      // register()
      application.register(name, factory);

      // Assert
      registry.register.calledWith(name, strategies.TYPES.FACTORY, factory).should.be.true();
    });

    it('detects a service and registers it correctly', function() {
      // Setup
      registry.register = sinon.stub();
      var name = 'test';
      var service = {
        service: 'something'
      };

      // register()
      application.register(name, service);

      // Assert
      registry.register.calledWith(name, strategies.TYPES.SERVICE, service).should.be.true();
    });

  });

  describe('registerConfig()', function() {

    it('detects a config as a factory and registers it correctly', function() {
      // Setup
      registry.register = sinon.stub();
      var factory = {
        construct: function() {}
      };

      // registerConfig()
      application.registerConfig(factory);

      // Assert
      registry.register.calledWith('@config', strategies.TYPES.FACTORY, factory).should.be.true();
    });

    it('detects a config as service and registers it correctly', function() {
      // Setup
      registry.register = sinon.stub();
      var service = {
        service: 'something'
      };

      // registerConfig()
      application.registerConfig(service);

      // Assert
      registry.register.calledWith('@config', strategies.TYPES.SERVICE, service).should.be.true();
    });

  });

  describe('registerFactory()', function() {

    it('registers a factory correctly', function() {
      // Setup
      registry.register = sinon.stub();
      var name = 'test';
      var factory = {
        construct: function() {}
      };

      // registerFactory()
      application.registerFactory(name, factory);

      // Assert
      registry.register.calledWith(name, strategies.TYPES.FACTORY, factory).should.be.true();
    });

  });

  describe('registerLogger()', function() {

    it('detects a logger as a factory and registers it correctly', function() {
      // Setup
      registry.register = sinon.stub();
      var factory = {
        construct: function() {}
      };

      // registerLogger()
      application.registerLogger(factory);

      // Assert
      registry.register.calledWith('@logger', strategies.TYPES.FACTORY, factory).should.be.true();
    });

    it('detects a logger as service and registers it correctly', function() {
      // Setup
      registry.register = sinon.stub();
      var service = {
        service: 'something'
      };

      // registerLogger()
      application.registerLogger(service);

      // Assert
      registry.register.calledWith('@logger', strategies.TYPES.SERVICE, service).should.be.true();
    });

  });

  describe('registerPrototype()', function() {

    it('registers a factory correctly', function() {
      // Setup
      registry.register = sinon.stub();
      var name = 'test';
      var Prototype = function() {};

      // registerPrototype()
      application.registerPrototype(name, Prototype);

      // Assert
      registry.register.calledWith(name, strategies.TYPES.PROTOTYPE, Prototype).should.be.true();
    });

  });

  describe('registerService()', function() {

    it('registers a service correctly', function() {
      // Setup
      registry.register = sinon.stub();
      var name = 'test';
      var service = {
        somthing: function() {}
      };

      // registerService()
      application.registerService(name, service);

      // Assert
      registry.register.calledWith(name, strategies.TYPES.SERVICE, service).should.be.true();
    });

  });


});
