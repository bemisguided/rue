var Context = appRequire('./context.js');
var strategies = appRequire('./strategies');

describe('./lib/context.js', function() {

  var CONTEXT_NAME = 'test';
  var registry;
  var eventEmitter;
  var context;

  beforeEach(function() {
    eventEmitter = {};
    registry = {};
    application = {
      eventEmitter: eventEmitter,
      registry: registry
    };
    context = new Context(CONTEXT_NAME, application);
  });

  describe('emit()', function() {

    it('emits to the event namespaced without paremters to the event emitter', function() {
      // setup
      eventEmitter.emit = sinon.stub();

      // emit()
      context.emit('eventName');

      eventEmitter.emit.calledWith(CONTEXT_NAME + ':eventName').should.be.true();
    });

    it('emits to the event namespaced with paremters to the event emitter', function() {
      // setup
      eventEmitter.emit = sinon.stub();

      // emit()
      context.emit('eventName', 'test1', 'test2');

      eventEmitter.emit.calledWith(CONTEXT_NAME + ':eventName', 'test1', 'test2').should.be.true();
    });

    it('throws an error when no event name parameter given', function() {
      // emit()
      (function() {
        context.emit();
      }).should.throw('Illegal argument event is required');
    });

  });

  describe('exists()', function() {

    it('return the exists indicator for a given name', function() {
      // setup
      registry.exists = sinon.stub();
      registry.exists.withArgs('service').returns(true);

      // get()
      context.exists('service').should.be.true();
    });

  });

  describe('get()', function() {

    it('returns the registered instance for a given name', function() {
      // setup
      registry.get = sinon.stub();
      var service = {
        service: 'something'
      };
      registry.get.withArgs('service').returns({
        instance: service
      });

      // get()
      context.get('service').should.be.eql(service);
    });

    it('throws an error if no registered instance exists for a given name', function() {
      // setup
      registry.get = sinon.stub();
      registry.get.withArgs('service').returns({
        instance: null
      });

      // get()
      (function() {
        context.get('service');
      }).should.throw('Dependency does not exist named "service"');
    });

    it('throws an error no name parameter given', function() {
      // get()
      (function() {
        context.get();
      }).should.throw('Illegal argument name is required');
    });

  });

  describe('getFactory()', function() {

    it('returns the registered factory for a given name', function() {
      // setup
      registry.get = sinon.stub();
      var factory = {
        factory: 'something'
      };
      registry.get.withArgs('factory', strategies.TYPES.FACTORY).returns({
        factory: factory
      });

      // getFactory()
      context.getFactory('factory').should.be.eql(factory);
    });

    it('throws an error no name parameter given', function() {
      // getFactory()
      (function() {
        context.getFactory();
      }).should.throw('Illegal argument name is required');
    });

  });

  describe('getPrototype()', function() {

    it('returns the registered prototype for a given name', function() {
      // setup
      registry.get = sinon.stub();
      var Prototype = function() {
        return 'somethign';
      };
      registry.get.withArgs('prototype', strategies.TYPES.PROTOTYPE).returns({
        factory: Prototype
      });

      // getPrototype()
      context.getPrototype('prototype').should.be.eql(Prototype);
    });

    it('throws an error no name parameter given', function() {
      // getPrototype()
      (function() {
        context.getPrototype();
      }).should.throw('Illegal argument name is required');
    });

  });

  describe('new()', function() {

    it('constructs a new instance from the prototype without parameters', function() {
      // setup
      registry.get = sinon.stub();
      var Prototype = function() {
        return {
          value1: 'test1',
          value2: 'test2'
        };
      };
      registry.get.withArgs('prototype', strategies.TYPES.PROTOTYPE).returns({
        factory: Prototype
      });

      // new()
      context.new('prototype').should.be.eql({
        value1: 'test1',
        value2: 'test2'
      });
    });

    it('constructs a new instance from the prototype with parameters', function() {
      // setup
      registry.get = sinon.stub();
      var Prototype = function(arg1, arg2) {
        return {
          value1: arg1,
          value2: arg2
        };
      };
      registry.get.withArgs('prototype', strategies.TYPES.PROTOTYPE).returns({
        factory: Prototype
      });

      // new()
      context.new('prototype', 'test1', 'test2').should.be.eql({
        value1: 'test1',
        value2: 'test2'
      });
    });

    it('throws an error no name parameter given', function() {
      // new()
      (function() {
        context.new();
      }).should.throw('Illegal argument name is required');
    });

  });

});
