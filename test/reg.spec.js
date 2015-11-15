var Registry = appRequire('./reg.js');
var strategies = appRequire('./strategies');

describe('./lib/reg.js', function() {

  var registry;

  beforeEach(function() {
    registry = new Registry();
  });

  describe('activate()', function() {

    it('activates dependencies correctly with a default profile', function() {
      var name = 'test';
      var type = strategies.TYPES.SERVICE;
      var service = {
        startup: function() {}
      };
      registry.register(name, type, service);
      registry.activate();
      registry.exists(name, type).should.be.true();
      registry.get(name, type).should.have.property('instance', service);
    });

    it('activates dependencies correctly with a specified profile', function() {
      var name = 'test';
      var type = strategies.TYPES.SERVICE;
      var service1 = {
        service: '1',
        startup: function() {}
      };
      var service2 = {
        service: '2',
        startup: function() {}
      };
      registry.register(name, type, service1);
      registry.register(name, type, service2, 'profile');
      registry.activate('profile');
      registry.exists(name, type).should.be.true();
      registry.get(name, type).should.have.property('instance', service2);
    });

    it('activates dependencies correctly with a specified list of profiles', function() {
      var name = 'test';
      var type = strategies.TYPES.SERVICE;
      var service1 = {
        service: '1',
        startup: function() {}
      };
      var service2 = {
        service: '2',
        startup: function() {}
      };
      registry.register(name, type, service1);
      registry.register(name, type, service2, 'profile2');
      registry.activate(['profile1', 'profile2']);
      registry.exists(name, type).should.be.true();
      registry.get(name, type).should.have.property('instance', service2);
    });

    it('throws an error when attempting to active profiles when there is already an active set of profiles', function() {
      registry.activate();
      (function() {
        registry.activate();
      }).should.throw('Illegal state profiles are active');
    })

  });

  describe('deactivate()', function() {

    it('deactivates dependencies correctly', function() {
      var name = 'test';
      var type = strategies.TYPES.SERVICE;
      var service = {
        startup: function() {}
      };
      registry.register(name, type, service);
      registry.activate();
      registry.deactivate();
      registry.isActive().should.be.false();
    });

    it('throws error when attempting to deactivate when no profiles are active', function() {
      (function() {
        registry.deactivate();
      }).should.throw('');
    });

  });

  describe('exists()', function() {

    var name = 'test';
    var type = strategies.TYPES.SERVICE;
    var service = {
      startup: function() {}
    };

    beforeEach(function() {
      registry.register(name, type, service);
      registry.activate();
    });

    it('should return true if the active dependency for a given name and optionally type exists', function() {
      registry.exists(name).should.be.true();
      registry.exists(name, type).should.be.true();
    });

    it('should return false if the active dependency for a given name and optionally type does not exist', function() {
      registry.exists('other').should.be.false();
      registry.exists(name, strategies.TYPES.FACTORY).should.be.false();
    });

    it('throws error when attempting use when no profiles are active', function() {
      registry.deactivate();
      (function() {
        registry.exists('test');
      }).should.throw('Illegal state no active profiles');
    });

  });

  describe('get()', function() {

    var name = 'test';
    var type = strategies.TYPES.SERVICE;
    var service = {
      startup: function() {}
    };

    beforeEach(function() {
      registry.register(name, type, service);
      registry.activate();
    });

    it('should return the active dependency for a given name and optionally type', function() {
      registry.get(name).should.have.property('instance', service);
      registry.get(name, type).should.have.property('instance', service);
    });

    it('should throw an error when the active dependency for a given name and optionally type cannot be found', function() {
      (function() {
        registry.get('other');
      }).should.throw('Dependency does not exist named "other"');
      (function() {
        registry.get(name, strategies.TYPES.FACTORY);
      }).should.throw('Dependency does not exist named "test" of type "factory"');
    });

    it('throws error when attempting use when no profiles are active', function() {
      registry.deactivate();
      (function() {
        registry.get('test');
      }).should.throw('Illegal state no active profiles');
    });

  });

  describe('getRegistrations()', function() {

    it('returns registrations for a given name matching the default profile', function() {
      var name = 'test';
      var type = strategies.TYPES.SERVICE;
      var service = {
        startup: function() {}
      };
      var otherservice = {
        other: 'service',
        startup: function() {}
      };
      registry.register(name, type, service);
      registry.register(name, type, otherservice, 'profile');
      registry.getRegistrations(name).should.be.Array();
      registry.getRegistrations(name).length.should.be.eql(1);
      registry.getRegistrations(name)[0].should.have.property('name', name);
      registry.getRegistrations(name)[0].should.have.property('type', type);
      registry.getRegistrations(name)[0].should.have.property('instance', service);
    });

    it('returns registrations for a given name matching a specified profile', function() {
      var name = 'test';
      var type = strategies.TYPES.SERVICE;
      var service = {
        startup: function() {}
      };
      var otherservice = {
        other: 'service',
        startup: function() {}
      };
      registry.register(name, type, service);
      registry.register(name, type, otherservice, 'profile');
      registry.getRegistrations(name, 'profile').should.be.Array();
      registry.getRegistrations(name, 'profile').length.should.be.eql(1);
      registry.getRegistrations(name, 'profile')[0].should.have.property('name', name);
      registry.getRegistrations(name, 'profile')[0].should.have.property('type', type);
      registry.getRegistrations(name, 'profile')[0].should.have.property('instance', otherservice);
    });

    it('returns registrations for a given name matching a specified list of profiles', function() {
      var name = 'test';
      var type = strategies.TYPES.SERVICE;
      var service = {
        startup: function() {}
      };
      var otherservice = {
        other: 'service',
        startup: function() {}
      };
      registry.register(name, type, service);
      registry.register(name, type, otherservice, 'profile');
      registry.getRegistrations(name, ['profile', 'other']).should.be.Array();
      registry.getRegistrations(name, ['profile', 'other']).length.should.be.eql(1);
      registry.getRegistrations(name, ['profile', 'other'])[0].should.have.property('name', name);
      registry.getRegistrations(name, ['profile', 'other'])[0].should.have.property('type', type);
      registry.getRegistrations(name, ['profile', 'other'])[0].should.have.property('instance', otherservice);
    });

    it('returns an empty array for a given name with no matching dependencies', function() {
      var name = 'test';
      registry.getRegistrations(name).should.be.Array();
      registry.getRegistrations(name).length.should.be.eql(0);
    });

  });

  describe('list()', function() {

    it('returns an ordered list of active dependencies', function() {
      var name1 = 'test1';
      var name2 = 'test2';
      var type = strategies.TYPES.SERVICE;
      var service1 = {
        service: '1',
        startup: function() {}
      };
      var service2 = {
        service: '2',
        startup: function() {}
      };
      registry.register(name1, type, service1);
      registry.register(name2, type, service2);
      registry.activate();
      registry.list().should.be.Array();
      registry.list().length.should.be.eql(2);
      registry.list()[0].should.have.property('instance', service1);
      registry.list()[1].should.have.property('instance', service2);
    });

    it('ignores deactivated dependencies', function() {
      var name1 = 'test1';
      var name2 = 'test2';
      var type = strategies.TYPES.SERVICE;
      var service1 = {
        service: '1',
        startup: function() {}
      };
      var service2 = {
        service: '2',
        startup: function() {}
      };
      registry.register(name1, type, service1);
      registry.register(name2, type, service2, 'profile');
      registry.activate();
      registry.list().should.be.Array();
      registry.list().length.should.be.eql(1);
      registry.list()[0].should.have.property('instance', service1);
    });

    it('throws error when attempting use when no profiles are active', function() {
      (function() {
        registry.list();
      }).should.throw('Illegal state no active profiles');
    });

  });

  describe('register()', function() {

    it('registers an instance dependency correctly', function() {
      var name = 'test';
      var type = strategies.TYPES.SERVICE;
      var service = {
        startup: function() {}
      };
      registry.register(name, type, service);
      registry.getRegistrations(name)[0].should.have.property('name', name);
      registry.getRegistrations(name)[0].should.have.property('type', type);
      registry.getRegistrations(name)[0].should.have.property('instance', service);
    });

    it('registers a factory dependency correctly', function() {
      var name = 'test';
      var type = strategies.TYPES.FACTORY;
      var factory = {
        construct: function() {}
      };
      registry.register(name, type, factory);
      registry.getRegistrations(name).should.be.Array();
      registry.getRegistrations(name).length.should.be.eql(1);
      registry.getRegistrations(name)[0].should.have.property('name', name);
      registry.getRegistrations(name)[0].should.have.property('type', type);
      registry.getRegistrations(name)[0].should.have.property('factory', factory);
    });

    it('registers an instance dependency correctly with multiple profiles', function() {
      var name = 'test';
      var type = strategies.TYPES.SERVICE;
      var service = {
        startup: function() {}
      };
      var otherservice = {
        other: 'service',
        startup: function() {}
      };
      registry.register(name, type, service, 'profile1');
      registry.register(name, type, otherservice, ['profile2', 'profile3']);
      registry.getRegistrations(name, ['profile1'])[0].should.have.property('name', name);
      registry.getRegistrations(name, ['profile1'])[0].should.have.property('type', type);
      registry.getRegistrations(name, ['profile1'])[0].should.have.property('instance', service);
      registry.getRegistrations(name, ['profile1'])[0].should.have.property('profiles', ['profile1']);
      registry.getRegistrations(name, ['profile2'])[0].should.have.property('name', name);
      registry.getRegistrations(name, ['profile2'])[0].should.have.property('type', type);
      registry.getRegistrations(name, ['profile2'])[0].should.have.property('instance', otherservice);
      registry.getRegistrations(name, ['profile2'])[0].should.have.property('profiles', ['profile2', 'profile3']);
      registry.getRegistrations(name, ['profile3'])[0].should.have.property('name', name);
      registry.getRegistrations(name, ['profile3'])[0].should.have.property('type', type);
      registry.getRegistrations(name, ['profile3'])[0].should.have.property('instance', otherservice);
      registry.getRegistrations(name, ['profile3'])[0].should.have.property('profiles', ['profile2', 'profile3']);
    });

    it('registers maintains dependency order correctly', function() {
      var name1 = 'test1';
      var name2 = 'test2';
      var type = strategies.TYPES.SERVICE;
      var service1 = {
        service: '1',
        startup: function() {}
      };
      var service2 = {
        service: '2',
        startup: function() {}
      };
      var service3 = {
        service: '3',
        startup: function() {}
      };
      registry.register(name1, type, service1);
      registry.register(name2, type, service2);
      registry.register(name1, type, service3);
      registry.activate();
      registry.list().length.should.be.eql(2);
      registry.list()[0].should.have.property('instance', service3);
      registry.list()[1].should.have.property('instance', service2);
    });

    it('throws error when attempting register when profiles are active', function() {
      registry.activate();
      (function() {
        registry.register('test', 'fsd', {});
      }).should.throw('Illegal state profiles are active');
    });

  });

  describe('restore()', function() {

    it('restores a stub to the original dependency', function() {
      var name = 'test';
      var type = strategies.TYPES.SERVICE;
      var service = {
        startup: function() {}
      };
      var stub = {
        stub: function() {}
      };
      registry.register(name, type, service);
      registry.activate();
      registry.get(name).should.have.property('instance', service);
      registry.stub(name, stub);
      registry.get(name).should.have.property('instance', stub);
      registry.restore(name);
      registry.get(name).should.have.property('instance', service);
    });

    it('throws an error when attempting to restore a dependency that is not stubbed', function() {
      var name = 'test';
      var type = strategies.TYPES.SERVICE;
      var service = {
        startup: function() {}
      };
      var stub = {
        stub: function() {}
      };
      registry.register(name, type, service);
      registry.activate();
      (function() {
        registry.restore(name);
      }).should.throw('Stubbed dependency could not be restored for name "test"');
    });

    it('throws error when attempting use when no profiles are active', function() {
      (function() {
        registry.restore('test');
      }).should.throw('Illegal state no active profiles');
    });

  });

  describe('stub()', function() {

    it('stubs and returns an active dependency with a given substitute', function() {
      var name = 'test';
      var type = strategies.TYPES.SERVICE;
      var service = {
        startup: function() {}
      };
      var stub = {
        stub: function() {}
      };
      registry.register(name, type, service);
      registry.activate();
      registry.get(name).should.have.property('instance', service);
      registry.stub(name, stub);
      registry.get(name).should.have.property('instance', stub);
    });

    it('throws an error when attempting to stub dependency that is not available and/or active', function() {
      var name = 'test';
      var type = strategies.TYPES.SERVICE;
      var service = {
        startup: function() {}
      };
      var stub = {
        stub: function() {}
      };
      registry.register(name, type, service, 'profile');
      registry.activate();
      (function() {
        registry.stub(name, stub);
      }).should.throw('Could not stub as no active dependency was not found for name "test"');
    });

    it('throws error when attempting use when no profiles are active', function() {
      (function() {
        registry.stub('test', {});
      }).should.throw('Illegal state no active profiles');
    });

  });

  describe('unregister()', function() {

    it('unregisters a dependency correctly', function() {
      var name = 'test';
      var type = strategies.TYPES.SERVICE;
      var service = {
        startup: function() {}
      };
      registry.register(name, type, service);
      registry.getRegistrations(name).length.should.be.eql(1);
      registry.getRegistrations(name)[0].should.have.property('name', name);
      registry.getRegistrations(name)[0].should.have.property('type', type);
      registry.getRegistrations(name)[0].should.have.property('instance', service);

      registry.unregister(name);
      registry.getRegistrations(name).length.should.be.eql(0);
    });

    it('throws error when attempting unregister when profiles are active', function() {
      registry.activate();
      (function() {
        registry.unregister('test');
      }).should.throw('Illegal state profiles are active');
    });

  });

});
