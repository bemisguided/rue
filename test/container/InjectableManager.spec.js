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
import InjectableManager from '../../lib/container/InjectableManager';
import InjectableResolver from '../../lib/container/injectables/InjectableResolver';

describe('./injectableManager/InjectableManager.js', () => {

  let injectableManager: InjectableManager;

  beforeEach(function () {
    injectableManager = new InjectableManager();
  });

  describe('addInjectableEntry()', () => {

    it('creates and adds a InjectableEntry with a default setting of singleton', () => {
      // Setup
      let name = 'test';
      let resolver = new InjectableResolver('resolver');
      let dependencies = ['dependencies'];

      // Execute
      let injectableEntry1 = injectableManager.addInjectableEntry(name, resolver, dependencies);

      // Assert
      let profileEntry = injectableManager.profileManager.getDefaultProfileEntry();
      let injectableEntry2 = profileEntry.injectableEntries[name];
      expect(injectableEntry2).not.toBeUndefined();
      expect(injectableEntry2).not.toBeNull();
      expect(injectableEntry2.name).toEqual(name);
      expect(injectableEntry2.resolver).toEqual(resolver);
      expect(injectableEntry2.dependencies).toEqual(dependencies);
      expect(injectableEntry2.singleton).toEqual(true);
      expect(injectableEntry2).toEqual(injectableEntry1);
    });

    it('creates and adds a InjectableEntry with a setting of singleton as provided', () => {
      // Setup
      let name = 'test';
      let resolver = new InjectableResolver('resolver');
      let dependencies = ['dependencies'];
      let singleton = false;

      // Execute
      let injectableEntry1 = injectableManager.addInjectableEntry(name, resolver, dependencies, singleton);

      // Assert
      let profileEntry = injectableManager.profileManager.getDefaultProfileEntry();
      let injectableEntry2 = profileEntry.injectableEntries[name];
      expect(injectableEntry2).not.toBeUndefined();
      expect(injectableEntry2).not.toBeNull();
      expect(injectableEntry2.name).toEqual(name);
      expect(injectableEntry2.resolver).toEqual(resolver);
      expect(injectableEntry2.dependencies).toEqual(dependencies);
      expect(injectableEntry2.singleton).toEqual(singleton);
      expect(injectableEntry2).toEqual(injectableEntry1);
    });

    it('creates and adds a InjectableEntry to the default profile when no profiles are provided', () => {
      // Setup
      let name = 'test';
      let resolver = new InjectableResolver('resolver');
      let dependencies = ['dependencies'];
      let singleton = true;

      // Execute
      let injectableEntry1 = injectableManager.addInjectableEntry(name, resolver, dependencies);

      // Assert
      let profileEntry = injectableManager.profileManager.getDefaultProfileEntry();
      let injectableEntry2 = profileEntry.injectableEntries[name];
      expect(injectableEntry2).not.toBeUndefined();
      expect(injectableEntry2).not.toBeNull();
      expect(injectableEntry2.name).toEqual(name);
      expect(injectableEntry2.resolver).toEqual(resolver);
      expect(injectableEntry2.dependencies).toEqual(dependencies);
      expect(injectableEntry2).toEqual(injectableEntry1);
    });

    it('creates and adds a InjectableEntry multiple profiles when multiple profiles are provided', () => {
      // Setup
      let name = 'test';
      let resolver = new InjectableResolver('resolver');
      let dependencies = ['dependencies'];
      let singleton = true;
      let profile1 = 'profile1';
      let profile2 = 'profile2';
      let profiles = [profile1, profile2];

      // Execute
      let injectableEntry1 = injectableManager.addInjectableEntry(name, resolver, dependencies, singleton, profiles);

      // Assert
      let profileEntry1 = injectableManager.profileManager.getProfileEntry(profile1);
      let injectableEntry2 = profileEntry1.injectableEntries[name];
      expect(injectableEntry2).not.toBeUndefined();
      expect(injectableEntry2).not.toBeNull();
      expect(injectableEntry2.name).toEqual(name);
      expect(injectableEntry2.resolver).toEqual(resolver);
      expect(injectableEntry2.dependencies).toEqual(dependencies);
      expect(injectableEntry2.singleton).toEqual(singleton);
      expect(injectableEntry2).toEqual(injectableEntry1);

      let profileEntry2 = injectableManager.profileManager.getProfileEntry(profile2);
      let injectableEntry3 = profileEntry2.injectableEntries[name];
      expect(injectableEntry3).not.toBeUndefined();
      expect(injectableEntry3).not.toBeNull();
      expect(injectableEntry3.name).toEqual(name);
      expect(injectableEntry3.resolver).toEqual(resolver);
      expect(injectableEntry3.dependencies).toEqual(dependencies);
    });

  });

  describe('getInjectableEntry()', function () {

    it('returns a InjectableEntry from the default profile when no profiles are provided', () => {
      // Setup
      let name = 'test';
      let resolver = new InjectableResolver('resolver');
      let dependencies = ['dependencies'];
      let injectableEntry1 = injectableManager.addInjectableEntry(name, resolver, dependencies);

      // Execute
      let injectableEntry2 = injectableManager.getInjectableEntry(name);

      // Assert
      expect(injectableEntry2).not.toBeUndefined();
      expect(injectableEntry2).not.toBeNull();
      if (!injectableEntry2) {
        throw new Error('Expect injectable to not be null/undefined');
      }
      expect(injectableEntry2.name).toEqual(name);
      expect(injectableEntry2.resolver).toEqual(resolver);
      expect(injectableEntry2.dependencies).toEqual(dependencies);
      expect(injectableEntry2).toEqual(injectableEntry1);
    });

    it('returns a InjectableEntry from the a single profile when a single profile is provided', () => {
      // Setup
      let name = 'test';
      let resolver = new InjectableResolver('resolver');
      let dependencies = ['dependencies'];
      let profile1 = 'profile1';
      let profiles = [profile1];
      let injectableEntry1 = injectableManager.addInjectableEntry(name, resolver, dependencies, true, profiles);

      // Execute
      let injectableEntry2 = injectableManager.getInjectableEntry(name, profiles);

      // Assert
      expect(injectableEntry2).not.toBeUndefined();
      expect(injectableEntry2).not.toBeNull();
      if (!injectableEntry2) {
        return;
      }
      expect(injectableEntry2.name).toEqual(name);
      expect(injectableEntry2.resolver).toEqual(resolver);
      expect(injectableEntry2.dependencies).toEqual(dependencies);
      expect(injectableEntry2).toEqual(injectableEntry1);
    });

    it('returns a InjectableEntry from the default profile when a single profile is provided', () => {
      // Setup
      let name = 'test';
      let resolver = new InjectableResolver('resolver');
      let dependencies = ['dependencies'];
      let profile1 = 'profile1';
      let profiles = [profile1];
      let injectableEntry1 = injectableManager.addInjectableEntry(name, resolver, dependencies);

      // Execute
      let injectableEntry2 = injectableManager.getInjectableEntry(name, profiles);

      // Assert
      expect(injectableEntry2).not.toBeUndefined();
      expect(injectableEntry2).not.toBeNull();
      if (!injectableEntry2) {
        return;
      }
      expect(injectableEntry2.name).toEqual(name);
      expect(injectableEntry2.resolver).toEqual(resolver);
      expect(injectableEntry2.dependencies).toEqual(dependencies);
      expect(injectableEntry2).toEqual(injectableEntry1);
    });

    it('returns a InjectableEntry from multiple profiles when multiple profiles are provided', () => {
      // Setup
      let name = 'test';
      let resolver = new InjectableResolver('resolver');
      let dependencies = ['dependencies'];
      let profile1 = 'profile1';
      let profile2 = 'profile2';
      let profiles = [profile1, profile2];
      let injectableEntry1 = injectableManager.addInjectableEntry(name, resolver, dependencies, true, profiles);

      // Execute
      let injectableEntry2 = injectableManager.getInjectableEntry(name, [profile2]);

      // Assert
      expect(injectableEntry2).not.toBeUndefined();
      expect(injectableEntry2).not.toBeNull();
      if (!injectableEntry2) {
        return;
      }
      expect(injectableEntry2.name).toEqual(name);
      expect(injectableEntry2.resolver).toEqual(resolver);
      expect(injectableEntry2.dependencies).toEqual(dependencies);
      expect(injectableEntry2).toEqual(injectableEntry1);
    });

    it('returns a InjectableEntry from the default profile when multiple profiles are provided (resolved the same ModuleEntry)', () => {
      // Setup
      let name = 'test';
      let resolver = new InjectableResolver('resolver');
      let dependencies = ['dependencies'];
      let profile1 = 'profile1';
      let profile2 = 'profile2';
      let profiles = [profile1, profile2];
      let injectableEntry1 = injectableManager.addInjectableEntry(name, resolver, dependencies, true, profiles);

      // Execute
      let injectableEntry2 = injectableManager.getInjectableEntry(name, profiles);

      // Assert
      expect(injectableEntry2).not.toBeUndefined();
      expect(injectableEntry2).not.toBeNull();
      if (!injectableEntry2) {
        return;
      }
      expect(injectableEntry2.name).toEqual(name);
      expect(injectableEntry2.resolver).toEqual(resolver);
      expect(injectableEntry2.dependencies).toEqual(dependencies);
      expect(injectableEntry2).toEqual(injectableEntry1);
    });

    it('throws error when different ContainerEntries are resolved from different profiles', () => {
      // Setup
      let name = 'test';
      let resolver1 = new InjectableResolver('resolver');
      let resolver2 = new InjectableResolver('resolver');
      let dependencies = ['dependencies'];
      let profile1 = 'profile1';
      let profile2 = 'profile2';
      let profiles = [profile1, profile2];
      injectableManager.addInjectableEntry(name, resolver1, dependencies, true, [profile1]);
      injectableManager.addInjectableEntry(name, resolver2, dependencies, true, [profile2]);

      // Assert
      try {
        injectableManager.getInjectableEntry(name, profiles);
      }
      catch (e) {
        expect(e.message).toEqual('Duplicate dependencies found: name=test');
      }
    });

  });

  describe('getInjectableEntries()', function () {

    it('returns a Map of ContainerEntries from the default profile when no profiles are provided', () => {
      // Setup
      let name = 'test';
      let resolver = new InjectableResolver('resolver');
      let dependencies = ['dependencies'];
      let injectableEntry = injectableManager.addInjectableEntry(name, resolver, dependencies);

      // Assert
      let injectableEntries = injectableManager.getInjectableEntries();
      expect(injectableEntries.get(name)).toEqual(injectableEntry);
    });

    it('returns a Map of ContainerEntries from the default profile a profile is provided', () => {
      // Setup
      let name = 'test';
      let resolver = new InjectableResolver('resolver');
      let dependencies = ['dependencies'];
      let injectableEntry = injectableManager.addInjectableEntry(name, resolver, dependencies);

      // Assert
      let injectableEntries = injectableManager.getInjectableEntries(['profile']);
      expect(injectableEntries.get(name)).toEqual(injectableEntry);
    });

    it('returns a Map of ContainerEntries with a InjectableEntry from a of provided profiles', () => {
      // Setup
      let name1 = 'name1';
      let name2 = 'name2';
      let resolver1 = new InjectableResolver('resolver');
      let resolver2 = new InjectableResolver('resolver');
      let resolver3 = new InjectableResolver('resolver');
      let dependencies = ['dependencies'];
      let profile1 = 'profile1';
      let profile2 = 'profile2';
      let injectableEntry1 = injectableManager.addInjectableEntry(name1, resolver1, dependencies);
      let injectableEntry2 = injectableManager.addInjectableEntry(name2, resolver2, dependencies, true, [profile1]);
      let injectableEntry3 = injectableManager.addInjectableEntry(name2, resolver3, dependencies, true, [profile2]);

      // Assert
      let injectableEntries = injectableManager.getInjectableEntries([profile1]);
      expect(injectableEntries.get(name1)).toEqual(injectableEntry1);
      expect(injectableEntries.get(name2)).toEqual(injectableEntry2);
      expect(injectableEntries.has(name2)).not.toEqual(injectableEntry3);
    });

    it('returns a Map of ContainerEntries without a InjectableEntry when a profile is provided does not have it available', () => {
      // Setup
      let name = 'test';
      let resolver = new InjectableResolver('resolver');
      let dependencies = ['dependencies'];
      let profile1 = 'profile1';
      let profile2 = 'profile2';
      injectableManager.addInjectableEntry(name, resolver, dependencies, true, [profile1]);

      // Assert
      let injectableEntries = injectableManager.getInjectableEntries([profile2]);
      expect(injectableEntries.has(name)).toEqual(false);
    });

  });

});