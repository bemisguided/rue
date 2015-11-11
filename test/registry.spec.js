var Registry = appRequire('./registry').Registry;

describe('./registry.js', function() {

  var FACTORY_NAME = 'test.factory.name';
  var PROTOTYPE_NAME = 'test.prototype.name';
  var SERVICE_NAME = 'test.service.name';
  var registry = null;

  beforeEach(function() {
    registry = new Registry();
  });

  describe('Lifecycle', function() {

    it('registry starts all services on startup', function(done) {

      var spy = sinon.spy();
      var service = {
        startup: function() {
          spy();
        }
      };
      registry.registerService(SERVICE_NAME, service);
      registry.startup()
        .then(function() {
          registry.isStarted(SERVICE_NAME).should.be.true();
          spy.calledOnce.should.be.true();
          done();
        })
        .done();
    });

    it('registry stops all services on shutdown', function(done) {

      var spyStartup = sinon.spy();
      var spyShutdown = sinon.spy();
      var service = {
        startup: function() {
          spyStartup();
        },
        shutdown: function() {
          spyShutdown();
        }
      };
      registry.registerService(SERVICE_NAME, service);
      registry.startup()
        .then(function() {
          registry.isStarted(SERVICE_NAME).should.be.true();
          spyStartup.calledOnce.should.be.true();
          return registry.shutdown();
        })
        .then(function() {
          registry.isStarted(SERVICE_NAME).should.be.false();
          spyShutdown.calledOnce.should.be.true();
          done();
        })
        .done();
    });

  });

  describe('Event emitter', function() {

    it('emits events and fires events for exact name', function() {
      var spy = sinon.spy();

      registry.on('foo', spy);
      registry.emit('foo');
      spy.called.should.be.true();
    });

    it('emits events and fires events for all', function() {
      var spy = sinon.spy();

      registry.on('*:*', spy);
      registry.emit('foo:something');
      spy.called.should.be.true();
    });

    it('emits events and fires events for namespaces', function() {
      var spy = sinon.spy();

      registry.on('foo:*', spy);
      registry.emit('foo:something');
      spy.called.should.be.true();
    });

  });

  describe('Services registry', function() {

    it('services can be added, checked for existence, retrieved and removed', function() {
      var service = {
        test: 'service'
      };

      // Add the service
      registry.registerService(SERVICE_NAME, service);

      // Check if it exists & retrieve it
      registry.existsService(SERVICE_NAME).should.be.true();
      registry.exists(SERVICE_NAME).should.be.true();
      registry.get(SERVICE_NAME).should.be.eql(service);

      // Remove & verify it's removal
      registry.remove(SERVICE_NAME);
      registry.existsService(SERVICE_NAME).should.be.false();
    });

    it('checked for existence is false for a service that\'s name that is not a type of service', function() {
      var Factory = function(params) {
        this.params = params;
      };
      registry.registerFactory(SERVICE_NAME, Factory);
      registry.existsService(SERVICE_NAME).should.be.false();
    });

    it('throws an exception when attempting to retrieve a non-existent dependency', function() {
      registry.existsService(SERVICE_NAME).should.be.false();
      (function() {
        registry.get(SERVICE_NAME);
      }).should.throw('Dependency named ' + SERVICE_NAME + ' could not be resolved');
    });

  });

  describe('Stubbing and restoring dependencies', function() {

    it('dependencies can be stubbed and restored', function() {
      var service = {
        test: 'service'
      };

      var stub = {
        test: 'stub'
      };

      // Setup the service
      registry.registerService(SERVICE_NAME, service);
      registry.existsService(SERVICE_NAME).should.be.true();
      registry.get(SERVICE_NAME).should.be.eql(service);

      // Stub the service & validate
      registry.stub(SERVICE_NAME, stub);
      registry.existsService(SERVICE_NAME).should.be.true();
      registry.get(SERVICE_NAME).should.be.eql(stub);

      // Restore the service
      registry.restore(SERVICE_NAME);
      registry.existsService(SERVICE_NAME).should.be.true();
      registry.get(SERVICE_NAME).should.be.eql(service);

      // Should thow an exception once the restore is complete
      (function() {
        registry.restore(SERVICE_NAME);
      }).should.throw('Stubbed dependency named ' + SERVICE_NAME + ' could not be restored');
    });

  });

  describe('Prototype registry', function() {

    it('prototypes can be added, checked for existence, retrieved and removed', function() {
      var Prototype = function(params) {
        this.params = params;
      };

      // Add the factory
      registry.registerPrototype(PROTOTYPE_NAME, Prototype);

      // Check if it exists & retrieve it
      registry.existsPrototype(PROTOTYPE_NAME).should.be.true();
      registry.exists(PROTOTYPE_NAME).should.be.true();
      registry.getPrototype(PROTOTYPE_NAME).should.be.eql(Prototype);

      // Remove & verify it's removal
      registry.remove(PROTOTYPE_NAME);
      registry.existsPrototype(PROTOTYPE_NAME).should.be.false();
    });

    it('prototypes create new objects', function() {
      var Prototype = function(params) {
        this.params = params;
      };

      // Add the factory
      registry.registerPrototype(PROTOTYPE_NAME, Prototype);

      // Create an object instance
      var obj = registry.new(PROTOTYPE_NAME, 'value');

      // Verify the newly constructed object
      Prototype.should.not.be.eql(obj);
      obj.should.have.property('params', 'value');
      obj.constructor.should.be.eql(Prototype);
    });

    it('checked for existence is false for a prototype that\'s name that is not a type of factory', function() {
      var service = {
        test: 'service'
      };
      registry.registerService(PROTOTYPE_NAME, service);
      registry.existsPrototype(PROTOTYPE_NAME).should.be.false();
    });

    it('throws an exception when attempting to retrieve a non-existent prototype', function() {
      registry.existsPrototype(PROTOTYPE_NAME).should.be.false();
      (function() {
        registry.getPrototype(PROTOTYPE_NAME);
      }).should.throw('Prototype named ' + PROTOTYPE_NAME + ' could not be resolved');
    });

    it('throws an exception when attempting to retrieve a factory that\'s name that is not a type of prototype', function() {
      var service = {
        test: 'service'
      };
      registry.registerService(PROTOTYPE_NAME, service);
      (function() {
        registry.getPrototype(PROTOTYPE_NAME);
      }).should.throw('Prototype named ' + PROTOTYPE_NAME + ' could not be resolved');
    });

  });
});
