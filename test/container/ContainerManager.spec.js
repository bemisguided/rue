/**
 * @flow
 */
import { beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import ContainerManager from '../../lib/container/ContainerManager';

describe('./ContainerManager.js', () => {

  let containerManager: ContainerManager;

  beforeEach(function () {
    containerManager = new ContainerManager();
  });

  describe('addContainerEntry()', () => {

    it('creates and adds a ContainerEntry to the default profile when no profiles are provided', () => {
      // Setup
      let name = 'test';
      let module = 'module';
      let dependencies = ['dependencies'];

      // Execute
      let containerEntry1 = containerManager.addContainerEntry(name, module, dependencies);

      // Assert
      let profileEntry = containerManager.profileManager.getDefaultProfileEntry();
      let containerEntry2 = profileEntry.containerEntries[name];
      expect(containerEntry2).to.not.be.undefined;
      expect(containerEntry2).to.not.be.null;
      expect(containerEntry2.name).to.equal(name);
      expect(containerEntry2.module).to.equal(module);
      expect(containerEntry2.dependencies).to.equal(dependencies);
      expect(containerEntry2).to.equal(containerEntry1);
    });

    it('creates and adds a ContainerEntry multiple profiles when multiple profiles are provided', () => {
      // Setup
      let name = 'test';
      let module = 'module';
      let dependencies = ['dependencies'];
      let profile1 = 'profile1';
      let profile2 = 'profile2';
      let profiles = [profile1, profile2];

      // Execute
      let containerEntry1 = containerManager.addContainerEntry(name, module, dependencies, profiles);

      // Assert
      let profileEntry1 = containerManager.profileManager.getProfileEntry(profile1);
      let containerEntry2 = profileEntry1.containerEntries[name];
      expect(containerEntry2).to.not.be.undefined;
      expect(containerEntry2).to.not.be.null;
      expect(containerEntry2.name).to.equal(name);
      expect(containerEntry2.module).to.equal(module);
      expect(containerEntry2.dependencies).to.equal(dependencies);
      expect(containerEntry2).to.equal(containerEntry1);

      let profileEntry2 = containerManager.profileManager.getProfileEntry(profile2);
      let containerEntry3 = profileEntry2.containerEntries[name];
      expect(containerEntry3).to.not.be.undefined;
      expect(containerEntry3).to.not.be.null;
      expect(containerEntry3.name).to.equal(name);
      expect(containerEntry3.module).to.equal(module);
      expect(containerEntry3.dependencies).to.equal(dependencies);
    });

  });

  describe('getContainerEntry()', function () {

    it('returns a ContainerEntry from the default profile when no profiles are provided', () => {
      // Setup
      let name = 'test';
      let module = 'module';
      let dependencies = ['dependencies'];
      let containerEntry1 = containerManager.addContainerEntry(name, module, dependencies);

      // Execute
      let containerEntry2 = containerManager.getContainerEntry(name);

      // Assert
      expect(containerEntry2).to.not.be.undefined;
      expect(containerEntry2).to.not.be.null;
      if (!containerEntry2) {
        return;
      }
      expect(containerEntry2.name).to.equal(name);
      expect(containerEntry2.module).to.equal(module);
      expect(containerEntry2.dependencies).to.equal(dependencies);
      expect(containerEntry2).to.equal(containerEntry1);
    });

    it('returns a ContainerEntry from the a single profile when a single profile is provided', () => {
      // Setup
      let name = 'test';
      let module = 'module';
      let dependencies = ['dependencies'];
      let profile1 = 'profile1';
      let profiles = [profile1];
      let containerEntry1 = containerManager.addContainerEntry(name, module, dependencies, profiles);

      // Execute
      let containerEntry2 = containerManager.getContainerEntry(name, profiles);

      // Assert
      expect(containerEntry2).to.not.be.undefined;
      expect(containerEntry2).to.not.be.null;
      if (!containerEntry2) {
        return;
      }
      expect(containerEntry2.name).to.equal(name);
      expect(containerEntry2.module).to.equal(module);
      expect(containerEntry2.dependencies).to.equal(dependencies);
      expect(containerEntry2).to.equal(containerEntry1);
    });

    it('returns a ContainerEntry from the default profile when a single profile is provided', () => {
      // Setup
      let name = 'test';
      let module = 'module';
      let dependencies = ['dependencies'];
      let profile1 = 'profile1';
      let profiles = [profile1];
      let containerEntry1 = containerManager.addContainerEntry(name, module, dependencies);

      // Execute
      let containerEntry2 = containerManager.getContainerEntry(name, profiles);

      // Assert
      expect(containerEntry2).to.not.be.undefined;
      expect(containerEntry2).to.not.be.null;
      if (!containerEntry2) {
        return;
      }
      expect(containerEntry2.name).to.equal(name);
      expect(containerEntry2.module).to.equal(module);
      expect(containerEntry2.dependencies).to.equal(dependencies);
      expect(containerEntry2).to.equal(containerEntry1);
    });

    it('returns a ContainerEntry from multiple profiles when multiple profiles are provided', () => {
      // Setup
      let name = 'test';
      let module = 'module';
      let dependencies = ['dependencies'];
      let profile1 = 'profile1';
      let profile2 = 'profile2';
      let profiles = [profile1, profile2];
      let containerEntry1 = containerManager.addContainerEntry(name, module, dependencies, profiles);

      // Execute
      let containerEntry2 = containerManager.getContainerEntry(name, [profile2]);

      // Assert
      expect(containerEntry2).to.not.be.undefined;
      expect(containerEntry2).to.not.be.null;
      if (!containerEntry2) {
        return;
      }
      expect(containerEntry2.name).to.equal(name);
      expect(containerEntry2.module).to.equal(module);
      expect(containerEntry2.dependencies).to.equal(dependencies);
      expect(containerEntry2).to.equal(containerEntry1);
    });

    it('returns a ContainerEntry from the default profile when multiple profiles are provided (resolved the same ModuleEntry)', () => {
      // Setup
      let name = 'test';
      let module = 'module';
      let dependencies = ['dependencies'];
      let profile1 = 'profile1';
      let profile2 = 'profile2';
      let profiles = [profile1, profile2];
      let containerEntry1 = containerManager.addContainerEntry(name, module, dependencies, profiles);

      // Execute
      let containerEntry2 = containerManager.getContainerEntry(name, profiles);

      // Assert
      expect(containerEntry2).to.not.be.undefined;
      expect(containerEntry2).to.not.be.null;
      if (!containerEntry2) {
        return;
      }
      expect(containerEntry2.name).to.equal(name);
      expect(containerEntry2.module).to.equal(module);
      expect(containerEntry2.dependencies).to.equal(dependencies);
      expect(containerEntry2).to.equal(containerEntry1);
    });

    it('throws error when different ContainerEntries are resolved from different profiles', () => {
      // Setup
      let name = 'test';
      let module1 = 'module1';
      let module2 = 'module2';
      let dependencies = ['dependencies'];
      let profile1 = 'profile1';
      let profile2 = 'profile2';
      let profiles = [profile1, profile2];
      containerManager.addContainerEntry(name, module1, dependencies, [profile1]);
      containerManager.addContainerEntry(name, module2, dependencies, [profile2]);

      // Assert
      try {
        containerManager.getContainerEntry(name, profiles);
      }
      catch (e) {
        expect(e.message).to.equal('Duplicate dependencies found: name=test');
      }
    });

  });

  describe('getContainerEntries()', function () {

    it('returns a Map of ContainerEntries from the default profile when no profiles are provided', () => {
      // Setup
      let name = 'test';
      let module = 'module';
      let dependencies = ['dependencies'];
      let containerEntry = containerManager.addContainerEntry(name, module, dependencies);

      // Assert
      let containerEntries = containerManager.getContainerEntries();
      expect(containerEntries.get(name)).to.equal(containerEntry);
    });

    it('returns a Map of ContainerEntries from the default profile a profile is provided', () => {
      // Setup
      let name = 'test';
      let module = 'module';
      let dependencies = ['dependencies'];
      let containerEntry = containerManager.addContainerEntry(name, module, dependencies);

      // Assert
      let containerEntries = containerManager.getContainerEntries(['profile']);
      expect(containerEntries.get(name)).to.equal(containerEntry);
    });

    it('returns a Map of ContainerEntries with a ContainerEntry from a of provided profiles', () => {
      // Setup
      let name1 = 'name1';
      let name2 = 'name2';
      let module1 = 'module1';
      let module2 = 'module2';
      let module3 = 'module3';
      let dependencies = ['dependencies'];
      let profile1 = 'profile1';
      let profile2 = 'profile2';
      let containerEntry1 = containerManager.addContainerEntry(name1, module1, dependencies);
      let containerEntry2 = containerManager.addContainerEntry(name2, module2, dependencies, [profile1]);
      let containerEntry3 = containerManager.addContainerEntry(name2, module3, dependencies, [profile2]);

      // Assert
      let containerEntries = containerManager.getContainerEntries([profile1]);
      expect(containerEntries.get(name1)).to.equal(containerEntry1);
      expect(containerEntries.get(name2)).to.equal(containerEntry2);
      expect(containerEntries.has(name2)).to.not.equal(containerEntry3);
    });

    it('returns a Map of ContainerEntries without a ContainerEntry when a profile is provided does not have it available', () => {
      // Setup
      let name = 'test';
      let module = 'module';
      let dependencies = ['dependencies'];
      let profile1 = 'profile1';
      let profile2 = 'profile2';
      containerManager.addContainerEntry(name, module, dependencies, [profile1]);

      // Assert
      let containerEntries = containerManager.getContainerEntries([profile2]);
      expect(containerEntries.has(name)).to.be.false;
    });

  });

});