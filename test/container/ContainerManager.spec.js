/**
 * Rue - nodejs dependency injection container
 *
 * Copyright 2017 Martin Crawford (@bemisguided)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @flow
 */
import { beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import ContainerManager from '../../lib/container/ContainerManager';
import ContainerEntryResolver from '../../lib/container/ContainerEntryResolver';

describe('./container/ContainerManager.js', () => {

  let containerManager: ContainerManager;

  beforeEach(function () {
    containerManager = new ContainerManager();
  });

  describe('addContainerEntry()', () => {

    it('creates and adds a ContainerEntry to the default profile when no profiles are provided', () => {
      // Setup
      let name = 'test';
      let resolver = new ContainerEntryResolver('resolver');
      let dependencies = ['dependencies'];

      // Execute
      let containerEntry1 = containerManager.addContainerEntry(name, resolver, dependencies);

      // Assert
      let profileEntry = containerManager.profileManager.getDefaultProfileEntry();
      let containerEntry2 = profileEntry.containerEntries[name];
      expect(containerEntry2).to.not.be.undefined;
      expect(containerEntry2).to.not.be.null;
      expect(containerEntry2.name).to.equal(name);
      expect(containerEntry2.resolver).to.equal(resolver);
      expect(containerEntry2.dependencies).to.equal(dependencies);
      expect(containerEntry2).to.equal(containerEntry1);
    });

    it('creates and adds a ContainerEntry multiple profiles when multiple profiles are provided', () => {
      // Setup
      let name = 'test';
      let resolver = new ContainerEntryResolver('resolver');
      let dependencies = ['dependencies'];
      let profile1 = 'profile1';
      let profile2 = 'profile2';
      let profiles = [profile1, profile2];

      // Execute
      let containerEntry1 = containerManager.addContainerEntry(name, resolver, dependencies, profiles);

      // Assert
      let profileEntry1 = containerManager.profileManager.getProfileEntry(profile1);
      let containerEntry2 = profileEntry1.containerEntries[name];
      expect(containerEntry2).to.not.be.undefined;
      expect(containerEntry2).to.not.be.null;
      expect(containerEntry2.name).to.equal(name);
      expect(containerEntry2.resolver).to.equal(resolver);
      expect(containerEntry2.dependencies).to.equal(dependencies);
      expect(containerEntry2).to.equal(containerEntry1);

      let profileEntry2 = containerManager.profileManager.getProfileEntry(profile2);
      let containerEntry3 = profileEntry2.containerEntries[name];
      expect(containerEntry3).to.not.be.undefined;
      expect(containerEntry3).to.not.be.null;
      expect(containerEntry3.name).to.equal(name);
      expect(containerEntry3.resolver).to.equal(resolver);
      expect(containerEntry3.dependencies).to.equal(dependencies);
    });

  });

  describe('getContainerEntry()', function () {

    it('returns a ContainerEntry from the default profile when no profiles are provided', () => {
      // Setup
      let name = 'test';
      let resolver = new ContainerEntryResolver('resolver');
      let dependencies = ['dependencies'];
      let containerEntry1 = containerManager.addContainerEntry(name, resolver, dependencies);

      // Execute
      let containerEntry2 = containerManager.getContainerEntry(name);

      // Assert
      expect(containerEntry2).to.not.be.undefined;
      expect(containerEntry2).to.not.be.null;
      if (!containerEntry2) {
        return;
      }
      expect(containerEntry2.name).to.equal(name);
      expect(containerEntry2.resolver).to.equal(resolver);
      expect(containerEntry2.dependencies).to.equal(dependencies);
      expect(containerEntry2).to.equal(containerEntry1);
    });

    it('returns a ContainerEntry from the a single profile when a single profile is provided', () => {
      // Setup
      let name = 'test';
      let resolver = new ContainerEntryResolver('resolver');
      let dependencies = ['dependencies'];
      let profile1 = 'profile1';
      let profiles = [profile1];
      let containerEntry1 = containerManager.addContainerEntry(name, resolver, dependencies, profiles);

      // Execute
      let containerEntry2 = containerManager.getContainerEntry(name, profiles);

      // Assert
      expect(containerEntry2).to.not.be.undefined;
      expect(containerEntry2).to.not.be.null;
      if (!containerEntry2) {
        return;
      }
      expect(containerEntry2.name).to.equal(name);
      expect(containerEntry2.resolver).to.equal(resolver);
      expect(containerEntry2.dependencies).to.equal(dependencies);
      expect(containerEntry2).to.equal(containerEntry1);
    });

    it('returns a ContainerEntry from the default profile when a single profile is provided', () => {
      // Setup
      let name = 'test';
      let resolver = new ContainerEntryResolver('resolver');
      let dependencies = ['dependencies'];
      let profile1 = 'profile1';
      let profiles = [profile1];
      let containerEntry1 = containerManager.addContainerEntry(name, resolver, dependencies);

      // Execute
      let containerEntry2 = containerManager.getContainerEntry(name, profiles);

      // Assert
      expect(containerEntry2).to.not.be.undefined;
      expect(containerEntry2).to.not.be.null;
      if (!containerEntry2) {
        return;
      }
      expect(containerEntry2.name).to.equal(name);
      expect(containerEntry2.resolver).to.equal(resolver);
      expect(containerEntry2.dependencies).to.equal(dependencies);
      expect(containerEntry2).to.equal(containerEntry1);
    });

    it('returns a ContainerEntry from multiple profiles when multiple profiles are provided', () => {
      // Setup
      let name = 'test';
      let resolver = new ContainerEntryResolver('resolver');
      let dependencies = ['dependencies'];
      let profile1 = 'profile1';
      let profile2 = 'profile2';
      let profiles = [profile1, profile2];
      let containerEntry1 = containerManager.addContainerEntry(name, resolver, dependencies, profiles);

      // Execute
      let containerEntry2 = containerManager.getContainerEntry(name, [profile2]);

      // Assert
      expect(containerEntry2).to.not.be.undefined;
      expect(containerEntry2).to.not.be.null;
      if (!containerEntry2) {
        return;
      }
      expect(containerEntry2.name).to.equal(name);
      expect(containerEntry2.resolver).to.equal(resolver);
      expect(containerEntry2.dependencies).to.equal(dependencies);
      expect(containerEntry2).to.equal(containerEntry1);
    });

    it('returns a ContainerEntry from the default profile when multiple profiles are provided (resolved the same ModuleEntry)', () => {
      // Setup
      let name = 'test';
      let resolver = new ContainerEntryResolver('resolver');
      let dependencies = ['dependencies'];
      let profile1 = 'profile1';
      let profile2 = 'profile2';
      let profiles = [profile1, profile2];
      let containerEntry1 = containerManager.addContainerEntry(name, resolver, dependencies, profiles);

      // Execute
      let containerEntry2 = containerManager.getContainerEntry(name, profiles);

      // Assert
      expect(containerEntry2).to.not.be.undefined;
      expect(containerEntry2).to.not.be.null;
      if (!containerEntry2) {
        return;
      }
      expect(containerEntry2.name).to.equal(name);
      expect(containerEntry2.resolver).to.equal(resolver);
      expect(containerEntry2.dependencies).to.equal(dependencies);
      expect(containerEntry2).to.equal(containerEntry1);
    });

    it('throws error when different ContainerEntries are resolved from different profiles', () => {
      // Setup
      let name = 'test';
      let resolver1 = new ContainerEntryResolver('resolver');
      let resolver2 = new ContainerEntryResolver('resolver');
      let dependencies = ['dependencies'];
      let profile1 = 'profile1';
      let profile2 = 'profile2';
      let profiles = [profile1, profile2];
      containerManager.addContainerEntry(name, resolver1, dependencies, [profile1]);
      containerManager.addContainerEntry(name, resolver2, dependencies, [profile2]);

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
      let resolver = new ContainerEntryResolver('resolver');
      let dependencies = ['dependencies'];
      let containerEntry = containerManager.addContainerEntry(name, resolver, dependencies);

      // Assert
      let containerEntries = containerManager.getContainerEntries();
      expect(containerEntries.get(name)).to.equal(containerEntry);
    });

    it('returns a Map of ContainerEntries from the default profile a profile is provided', () => {
      // Setup
      let name = 'test';
      let resolver = new ContainerEntryResolver('resolver');
      let dependencies = ['dependencies'];
      let containerEntry = containerManager.addContainerEntry(name, resolver, dependencies);

      // Assert
      let containerEntries = containerManager.getContainerEntries(['profile']);
      expect(containerEntries.get(name)).to.equal(containerEntry);
    });

    it('returns a Map of ContainerEntries with a ContainerEntry from a of provided profiles', () => {
      // Setup
      let name1 = 'name1';
      let name2 = 'name2';
      let resolver1 = new ContainerEntryResolver('resolver');
      let resolver2 = new ContainerEntryResolver('resolver');
      let resolver3 = new ContainerEntryResolver('resolver');
      let dependencies = ['dependencies'];
      let profile1 = 'profile1';
      let profile2 = 'profile2';
      let containerEntry1 = containerManager.addContainerEntry(name1, resolver1, dependencies);
      let containerEntry2 = containerManager.addContainerEntry(name2, resolver2, dependencies, [profile1]);
      let containerEntry3 = containerManager.addContainerEntry(name2, resolver3, dependencies, [profile2]);

      // Assert
      let containerEntries = containerManager.getContainerEntries([profile1]);
      expect(containerEntries.get(name1)).to.equal(containerEntry1);
      expect(containerEntries.get(name2)).to.equal(containerEntry2);
      expect(containerEntries.has(name2)).to.not.equal(containerEntry3);
    });

    it('returns a Map of ContainerEntries without a ContainerEntry when a profile is provided does not have it available', () => {
      // Setup
      let name = 'test';
      let resolver = new ContainerEntryResolver('resolver');
      let dependencies = ['dependencies'];
      let profile1 = 'profile1';
      let profile2 = 'profile2';
      containerManager.addContainerEntry(name, resolver, dependencies, [profile1]);

      // Assert
      let containerEntries = containerManager.getContainerEntries([profile2]);
      expect(containerEntries.has(name)).to.be.false;
    });

  });

});