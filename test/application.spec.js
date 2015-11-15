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

});
