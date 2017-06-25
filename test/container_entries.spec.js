const expect = require('chai').expect;
const ContainerEntries = appRequire('./container_entries');

describe('./container_entries.js', function () {

  let containerEntry;

  beforeEach(function () {
    containerEntry = new ContainerEntries();
  });

  describe('getProfileEntry()', function () {

    it('creates and returns new ProfileEntry if one does not exist for provided name', function () {
      // Execute
      let profileEntry = containerEntry.getProfileEntry('test');

      // Assert
      expect(profileEntry).to.not.be.undefined;
      expect(profileEntry).to.not.be.null;
    });

    it('returns an existing ProfileEntry for provided name ', function () {
      // Setup
      let profileEntry1 = containerEntry.getProfileEntry('test');

      // Execute
      let profileEntry2 = containerEntry.getProfileEntry('test');

      // Assert
      expect(profileEntry1).to.equal(profileEntry2);
    });

  });

  describe('addModuleEntry()', function () {

    it('creates a ModuleEntry and adds to the default profile when no profiles are provided', function () {
      // Setup
      let name = 'test';
      let module = 'module';
      let dependencies = 'dependencies';

      // Execute
      containerEntry.addModuleEntry(name, module, dependencies);

      // Assert
      let profileEntry = containerEntry.getProfileEntry('');
      let moduleEntry = profileEntry.entries[name];
      expect(moduleEntry).to.not.be.undefined;
      expect(moduleEntry).to.not.be.null;
      expect(moduleEntry.name).to.equal(name);
      expect(moduleEntry.module).to.equal(module);
      expect(moduleEntry.dependencies).to.equal(dependencies);
    });

    it('creates a ModuleEntry and adds to a single profile when a single profile is provided', function () {
      // Setup
      let name = 'test';
      let module = 'module';
      let dependencies = 'dependencies';
      let profile = 'profile';

      // Execute
      containerEntry.addModuleEntry(name, module, dependencies, profile);

      // Assert
      let profileEntry = containerEntry.getProfileEntry(profile);
      let moduleEntry = profileEntry.entries[name];
      expect(moduleEntry).to.not.be.undefined;
      expect(moduleEntry).to.not.be.null;
      expect(moduleEntry.name).to.equal(name);
      expect(moduleEntry.module).to.equal(module);
      expect(moduleEntry.dependencies).to.equal(dependencies);
    });

    it('creates a ModuleEntry and adds to multiple profiles when multiple profiles are provided', function () {
      // Setup
      let name = 'test';
      let module = 'module';
      let dependencies = 'dependencies';
      let profile = ['profile1', 'profile2'];

      // Execute
      containerEntry.addModuleEntry(name, module, dependencies, profile);

      // Assert
      let profileEntry1 = containerEntry.getProfileEntry(profile[0]);
      let moduleEntry1 = profileEntry1.entries[name];
      expect(moduleEntry1).to.not.be.undefined;
      expect(moduleEntry1).to.not.be.null;
      expect(moduleEntry1.name).to.equal(name);
      expect(moduleEntry1.module).to.equal(module);
      expect(moduleEntry1.dependencies).to.equal(dependencies);

      let profileEntry2 = containerEntry.getProfileEntry(profile[1]);
      let moduleEntry2 = profileEntry2.entries[name];
      expect(moduleEntry2).to.not.be.undefined;
      expect(moduleEntry2).to.not.be.null;
      expect(moduleEntry2.name).to.equal(name);
      expect(moduleEntry2.module).to.equal(module);
      expect(moduleEntry2.dependencies).to.equal(dependencies);
    });

  });

  describe('getModuleEntry()', function () {

    it('returns a ModuleEntry from the default profile when no profiles are provided', function () {
      // Setup
      let name = 'test';
      let module = 'module';
      let dependencies = 'dependencies';
      containerEntry.addModuleEntry(name, module, dependencies);

      // Assert
      let moduleEntry = containerEntry.getModuleEntry(name);
      expect(moduleEntry).to.not.be.undefined;
      expect(moduleEntry).to.not.be.null;
      expect(moduleEntry.name).to.equal(name);
      expect(moduleEntry.module).to.equal(module);
      expect(moduleEntry.dependencies).to.equal(dependencies);
    });

    it('returns a ModuleEntry from the a single profile when a single profile is provided', function () {
      // Setup
      let name = 'test';
      let module = 'module';
      let dependencies = 'dependencies';
      let profile = 'profile';
      containerEntry.addModuleEntry(name, module, dependencies, profile);

      // Assert
      let moduleEntry = containerEntry.getModuleEntry(name, profile);
      expect(moduleEntry).to.not.be.undefined;
      expect(moduleEntry).to.not.be.null;
      expect(moduleEntry.name).to.equal(name);
      expect(moduleEntry.module).to.equal(module);
      expect(moduleEntry.dependencies).to.equal(dependencies);
    });

    it('returns a ModuleEntry from the default profile when a single profile is provided', function () {
      // Setup
      let name = 'test';
      let module = 'module';
      let dependencies = 'dependencies';
      let profile = 'profile';
      containerEntry.addModuleEntry(name, module, dependencies);

      // Assert
      let moduleEntry = containerEntry.getModuleEntry(name, profile);
      expect(moduleEntry).to.not.be.undefined;
      expect(moduleEntry).to.not.be.null;
      expect(moduleEntry.name).to.equal(name);
      expect(moduleEntry.module).to.equal(module);
      expect(moduleEntry.dependencies).to.equal(dependencies);
    });

    it('returns a ModuleEntry from multiple profiles when multiple profiles are provided', function () {
      // Setup
      let name = 'test';
      let module = 'module';
      let dependencies = 'dependencies';
      let profile = ['profile1', 'profile2'];
      containerEntry.addModuleEntry(name, module, dependencies, profile);

      // Assert
      let moduleEntry = containerEntry.getModuleEntry(name, profile);
      expect(moduleEntry).to.not.be.undefined;
      expect(moduleEntry).to.not.be.null;
      expect(moduleEntry.name).to.equal(name);
      expect(moduleEntry.module).to.equal(module);
      expect(moduleEntry.dependencies).to.equal(dependencies);
    });

    it('returns a ModuleEntry from the default profile when multiple profiles are provided (resolved the same ModuleEntry)', function () {
      // Setup
      let name = 'test';
      let module = 'module';
      let dependencies = 'dependencies';
      let profile = ['profile1', 'profile2'];
      containerEntry.addModuleEntry(name, module, dependencies);

      // Assert
      let moduleEntry = containerEntry.getModuleEntry(name, profile);
      expect(moduleEntry).to.not.be.undefined;
      expect(moduleEntry).to.not.be.null;
      expect(moduleEntry.name).to.equal(name);
      expect(moduleEntry.module).to.equal(module);
      expect(moduleEntry.dependencies).to.equal(dependencies);
    });

    it('throws error when different ModuleEntries are resolved from different profiles', function () {
      // Setup
      let name = 'test';
      let module1 = 'module1';
      let module2 = 'module2';
      let dependencies = 'dependencies';
      let profile1 = 'profile1';
      let profile2 = 'profile2';
      let profiles = [profile1, profile2];
      containerEntry.addModuleEntry(name, module1, dependencies, profile1);
      containerEntry.addModuleEntry(name, module2, dependencies, profile2);

      // Assert
      try {
        containerEntry.getModuleEntry(name, profiles);
      } catch (e) {
        expect(e.message).to.equal('Duplicate dependencies found: name=test');
      }
    });

  });

  describe('getModuleEntries()', function () {

    it('returns a set of ModuleEntries with a ModuleEntry from the default profile when no profiles are provided', function () {
      // Setup
      let name = 'test';
      let module = 'module';
      let dependencies = 'dependencies';
      let moduleEntry = containerEntry.addModuleEntry(name, module, dependencies);

      // Assert
      let moduleEntries = containerEntry.getModuleEntries();
      expect(moduleEntries.has(moduleEntry)).to.be.true;
    });

    it('returns a set of ModuleEntries with a ModuleEntry from the default profile a profile is provided', function () {
      // Setup
      let name = 'test';
      let module = 'module';
      let dependencies = 'dependencies';
      let moduleEntry = containerEntry.addModuleEntry(name, module, dependencies);

      // Assert
      let moduleEntries = containerEntry.getModuleEntries('profile');
      expect(moduleEntries.has(moduleEntry)).to.be.true;
    });

    it('returns a set of ModuleEntries with a ModuleEntries from a set of provided profiles', function () {
      // Setup
      let name = 'test';
      let module1 = 'module1';
      let dependencies = 'dependencies';
      let moduleEntry1 = containerEntry.addModuleEntry(name, module1, dependencies);
      let moduleEntry2 = containerEntry.addModuleEntry(name, module1, dependencies, 'profile1');
      let moduleEntry3 = containerEntry.addModuleEntry(name, module1, dependencies, 'profile2');

      // Assert
      let moduleEntries = containerEntry.getModuleEntries('profile1');
      expect(moduleEntries.has(moduleEntry1)).to.be.true;
      expect(moduleEntries.has(moduleEntry2)).to.be.true;
      expect(moduleEntries.has(moduleEntry3)).to.be.false;
    });

    it('returns a set of ModuleEntries without a ModuleEntry when a profile is provided does not have it available', function () {
      // Setup
      let name = 'test';
      let module = 'module';
      let dependencies = 'dependencies';
      let moduleEntry = containerEntry.addModuleEntry(name, module, dependencies, 'profile1');

      // Assert
      let moduleEntries = containerEntry.getModuleEntries('profile2');
      expect(moduleEntries.has(moduleEntry)).to.be.false;
    });

  });

  describe('resolveDependencyOrder()', function () {

    it('returns an ordered set of ModuleEntry names with no dependencies', function () {
      // Setup
      let name = 'test';
      let module = 'module';
      let dependencies = [];
      containerEntry.addModuleEntry(name, module, dependencies);

      // Assert
      let dependenciesOrder = containerEntry.resolveDependencyOrder();
      let iterator = dependenciesOrder.values();
      expect(iterator.next().value).to.equal(name);
    });

    it('returns an ordered set of ModuleEntry names with single dependency', function () {
      // Setup
      let name1 = 'test1';
      let module1 = 'module1';
      let name2 = 'test2';
      let module2 = 'module2';
      containerEntry.addModuleEntry(name1, module1, [name2]);
      containerEntry.addModuleEntry(name2, module2, []);

      // Assert
      let dependenciesOrder = containerEntry.resolveDependencyOrder();
      let iterator = dependenciesOrder.values();
      expect(iterator.next().value).to.equal(name2);
      expect(iterator.next().value).to.equal(name1);
    });

    it('returns an ordered set of ModuleEntry names with multiple dependencies', function () {
      // Setup
      let name1 = 'test1';
      let module1 = 'module1';
      let name2 = 'test2';
      let module2 = 'module2';
      let name3 = 'test3';
      let module3 = 'module3';
      containerEntry.addModuleEntry(name1, module1, [name2, name3]);
      containerEntry.addModuleEntry(name2, module2, []);
      containerEntry.addModuleEntry(name3, module3, []);

      // Assert
      let dependenciesOrder = containerEntry.resolveDependencyOrder();
      let iterator = dependenciesOrder.values();
      expect(iterator.next().value).to.equal(name2);
      expect(iterator.next().value).to.equal(name3);
      expect(iterator.next().value).to.equal(name1);
    });

    it('returns an ordered set of ModuleEntry names with multiple dependencies with dependencies', function () {
      // Setup
      let name1 = 'test1';
      let module1 = 'module1';
      let name2 = 'test2';
      let module2 = 'module2';
      let name3 = 'test3';
      let module3 = 'module3';
      containerEntry.addModuleEntry(name1, module1, [name2, name3]);
      containerEntry.addModuleEntry(name2, module2, [name3]);
      containerEntry.addModuleEntry(name3, module3, []);

      // Assert
      let dependenciesOrder = containerEntry.resolveDependencyOrder();
      let iterator = dependenciesOrder.values();
      expect(iterator.next().value).to.equal(name3);
      expect(iterator.next().value).to.equal(name2);
      expect(iterator.next().value).to.equal(name1);
    });

    it('returns an ordered set of ModuleEntry names with separate dependency graphs', function () {
      // Setup
      let name1 = 'test1';
      let module1 = 'module1';
      let name2 = 'test2';
      let module2 = 'module2';
      let name3 = 'test3';
      let module3 = 'module3';
      let name4 = 'test4';
      let module4 = 'module4';
      containerEntry.addModuleEntry(name1, module1, [name2]);
      containerEntry.addModuleEntry(name2, module2, []);
      containerEntry.addModuleEntry(name3, module3, []);
      containerEntry.addModuleEntry(name4, module4, [name3]);

      // Assert
      let dependenciesOrder = containerEntry.resolveDependencyOrder();
      let iterator = dependenciesOrder.values();
      expect(iterator.next().value).to.equal(name2);
      expect(iterator.next().value).to.equal(name1);
      expect(iterator.next().value).to.equal(name3);
      expect(iterator.next().value).to.equal(name4);
    });

    it('returns an ordered set of ModuleEntry names with profiles provided', function () {
      // Setup
      let name1 = 'test1';
      let module1 = 'module1';
      let name2 = 'test2';
      let module2 = 'module2';
      let name3 = 'test3';
      let module3 = 'module3';
      let profile1 = 'profile1';
      let profile2 = 'profile2';
      containerEntry.addModuleEntry(name1, module1, [name2, name3]);
      containerEntry.addModuleEntry(name2, module2, [name3], profile2);
      containerEntry.addModuleEntry(name3, module3, [], profile1);

      // Assert
      let dependenciesOrder = containerEntry.resolveDependencyOrder([profile1, profile2]);
      let iterator = dependenciesOrder.values();
      expect(iterator.next().value).to.equal(name3);
      expect(iterator.next().value).to.equal(name2);
      expect(iterator.next().value).to.equal(name1);
    });

    it('throws error when a dependency cannot be resolved', function () {
      // Setup
      let name1 = 'test1';
      let module1 = 'module1';
      let name2 = 'test2';
      let module2 = 'module2';
      let name3 = 'test3';
      let module3 = 'module3';
      containerEntry.addModuleEntry(name1, module1, [name2, name3]);
      containerEntry.addModuleEntry(name2, module2, [name3]);

      // Assert
      try {
        containerEntry.resolveDependencyOrder();
      } catch (e) {
        expect(e.message).to.equal('Dependency not available: name=test3 profiles=undefined');
      }
    });
    
    it('throws error when a dependency cannot be resolved because the profile is not provided', function () {
      // Setup
      let name1 = 'test1';
      let module1 = 'module1';
      let name2 = 'test2';
      let module2 = 'module2';
      let name3 = 'test3';
      let module3 = 'module3';
      let profile1 = 'profile1';
      let profile2 = 'profile2';
      containerEntry.addModuleEntry(name1, module1, [name2, name3]);
      containerEntry.addModuleEntry(name2, module2, [name3], profile2);
      containerEntry.addModuleEntry(name3, module3, [], profile1);

      // Assert
      try {
        containerEntry.resolveDependencyOrder([profile1]);
      } catch (e) {
        expect(e.message).to.equal('Dependency not available: name=test2 profiles=profile1,');
      }
    });

    it('throws error when there is a circular dependency', function () {
      // Setup
      let name1 = 'test1';
      let module1 = 'module1';
      let name2 = 'test2';
      let module2 = 'module2';
      containerEntry.addModuleEntry(name1, module1, [name2]);
      containerEntry.addModuleEntry(name2, module2, [name1]);

      // Assert
      try {
        containerEntry.resolveDependencyOrder();
      } catch (e) {
        expect(e.message).to.equal('Circular dependency found: name=test2 dependency=test1');
      }
    });

  });

});