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
import InjectableManager from '../../../lib/container/injectables/InjectableManager';
import InjectableResolver from '../../../lib/container/injectables/InjectableResolver';

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
      let dependencyNames = ['dependencyNames'];

      // Execute
      let injectableEntry1 = injectableManager.addInjectableEntry(name, resolver, dependencyNames);

      // Assert
      let injectableEntry2 = injectableManager.injectableEntries[0];
      expect(injectableEntry2).not.toBeUndefined();
      expect(injectableEntry2).not.toBeNull();
      expect(injectableEntry2.name).toEqual(name);
      expect(injectableEntry2.resolver).toEqual(resolver);
      expect(injectableEntry2.dependencyNames).toEqual(dependencyNames);
      expect(injectableEntry2.singleton).toEqual(true);
      expect(injectableEntry2).toEqual(injectableEntry1);
    });

    it('creates and adds a InjectableEntry with a setting of singleton as provided', () => {
      // Setup
      let name = 'test';
      let resolver = new InjectableResolver('resolver');
      let dependencyNames = ['dependencyNames'];
      let singleton = false;

      // Execute
      let injectableEntry1 = injectableManager.addInjectableEntry(name, resolver, dependencyNames, singleton);

      // Assert
      let injectableEntry2 = injectableManager.injectableEntries[0];
      expect(injectableEntry2).not.toBeUndefined();
      expect(injectableEntry2).not.toBeNull();
      expect(injectableEntry2.name).toEqual(name);
      expect(injectableEntry2.resolver).toEqual(resolver);
      expect(injectableEntry2.dependencyNames).toEqual(dependencyNames);
      expect(injectableEntry2.singleton).toEqual(singleton);
      expect(injectableEntry2).toEqual(injectableEntry1);
    });

    it('creates and adds a InjectableEntry to the default profile when no profiles are provided', () => {
      // Setup
      let name = 'test';
      let resolver = new InjectableResolver('resolver');
      let dependencyNames = ['dependencyNames'];
      let singleton = true;

      // Execute
      let injectableEntry1 = injectableManager.addInjectableEntry(name, resolver, dependencyNames);

      // Assert
      let injectableEntry2 = injectableManager.injectableEntries[0];
      expect(injectableEntry2).not.toBeUndefined();
      expect(injectableEntry2).not.toBeNull();
      expect(injectableEntry2.name).toEqual(name);
      expect(injectableEntry2.resolver).toEqual(resolver);
      expect(injectableEntry2.dependencyNames).toEqual(dependencyNames);
      expect(injectableEntry2.profiles).toEqual(['']);
      expect(injectableEntry2).toEqual(injectableEntry1);
    });

    it('creates and adds a InjectableEntry to multiple profiles when multiple profiles are provided', () => {
      // Setup
      let name = 'test';
      let resolver = new InjectableResolver('resolver');
      let dependencyNames = ['dependencyNames'];
      let singleton = true;
      let profile1 = 'profile1';
      let profile2 = 'profile2';
      let profiles = [profile1, profile2];

      // Execute
      let injectableEntry1 = injectableManager.addInjectableEntry(name, resolver, dependencyNames, singleton, profiles);

      // Assert
      let injectableEntry2 = injectableManager.injectableEntries[0];
      expect(injectableEntry2).not.toBeUndefined();
      expect(injectableEntry2).not.toBeNull();
      expect(injectableEntry2.name).toEqual(name);
      expect(injectableEntry2.resolver).toEqual(resolver);
      expect(injectableEntry2.dependencyNames).toEqual(dependencyNames);
      expect(injectableEntry2.singleton).toEqual(singleton);
      expect(injectableEntry2.profiles).toEqual(profiles);
      expect(injectableEntry2).toEqual(injectableEntry1);
    });

  });

  describe('getInjectableEntry()', function () {

    it('returns a InjectableEntry from the default profile when no profiles are provided', () => {
      // Setup
      let name = 'test';
      let resolver = new InjectableResolver('resolver');
      let dependencyNames = ['dependencyNames'];
      let injectableEntry1 = injectableManager.addInjectableEntry(name, resolver, dependencyNames);

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
      expect(injectableEntry2.dependencyNames).toEqual(dependencyNames);
      expect(injectableEntry2).toEqual(injectableEntry1);
    });

    it('returns a InjectableEntry from the a single profile when a single profile is provided', () => {
      // Setup
      let name = 'test';
      let resolver = new InjectableResolver('resolver');
      let dependencyNames = ['dependencyNames'];
      let profile1 = 'profile1';
      let profiles = [profile1];
      let injectableEntry1 = injectableManager.addInjectableEntry(name, resolver, dependencyNames, true, profiles);

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
      expect(injectableEntry2.dependencyNames).toEqual(dependencyNames);
      expect(injectableEntry2).toEqual(injectableEntry1);
    });

    it('returns a InjectableEntry from the default profile when a single profile is provided', () => {
      // Setup
      let name = 'test';
      let resolver = new InjectableResolver('resolver');
      let dependencyNames = ['dependencyNames'];
      let profile1 = 'profile1';
      let profiles = [profile1];
      let injectableEntry1 = injectableManager.addInjectableEntry(name, resolver, dependencyNames);

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
      expect(injectableEntry2.dependencyNames).toEqual(dependencyNames);
      expect(injectableEntry2).toEqual(injectableEntry1);
    });

    it('returns a InjectableEntry from multiple profiles when multiple profiles are provided', () => {
      // Setup
      let name = 'test';
      let resolver = new InjectableResolver('resolver');
      let dependencyNames = ['dependencyNames'];
      let profile1 = 'profile1';
      let profile2 = 'profile2';
      let profiles = [profile1, profile2];
      let injectableEntry1 = injectableManager.addInjectableEntry(name, resolver, dependencyNames, true, profiles);

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
      expect(injectableEntry2.dependencyNames).toEqual(dependencyNames);
      expect(injectableEntry2).toEqual(injectableEntry1);
    });

    it('returns a InjectableEntry from the default profile when multiple profiles are provided (resolved the same ModuleEntry)', () => {
      // Setup
      let name = 'test';
      let resolver = new InjectableResolver('resolver');
      let dependencyNames = ['dependencyNames'];
      let profile1 = 'profile1';
      let profile2 = 'profile2';
      let profiles = [profile1, profile2];
      let injectableEntry1 = injectableManager.addInjectableEntry(name, resolver, dependencyNames, true, profiles);

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
      expect(injectableEntry2.dependencyNames).toEqual(dependencyNames);
      expect(injectableEntry2).toEqual(injectableEntry1);
    });

    it('throws error when different ContainerEntries are resolved from different profiles', () => {
      // Setup
      let name = 'test';
      let resolver1 = new InjectableResolver('resolver');
      let resolver2 = new InjectableResolver('resolver');
      let dependencyNames = ['dependencyNames'];
      let profile1 = 'profile1';
      let profile2 = 'profile2';
      let profiles = [profile1, profile2];
      injectableManager.addInjectableEntry(name, resolver1, dependencyNames, true, [profile1]);
      injectableManager.addInjectableEntry(name, resolver2, dependencyNames, true, [profile2]);

      // Assert
      try {
        injectableManager.getInjectableEntry(name, profiles);
      }
      catch (e) {
        expect(e.message).toEqual('Duplicate injectable found in active profile scope: name=test');
      }
    });

  });

  describe('getInjectableEntries()', function () {

    it('returns a Map of ContainerEntries from the default profile when no profiles are provided', () => {
      // Setup
      let name = 'test';
      let resolver = new InjectableResolver('resolver');
      let dependencyNames = ['dependencyNames'];
      let injectableEntry = injectableManager.addInjectableEntry(name, resolver, dependencyNames);

      // Assert
      let injectableEntries = injectableManager.getInjectableEntries();
      expect(injectableEntries.has(injectableEntry)).toBeTruthy();
    });

    it('returns a Map of ContainerEntries from the default profile a profile is provided', () => {
      // Setup
      let name = 'test';
      let resolver = new InjectableResolver('resolver');
      let dependencyNames = ['dependencyNames'];
      let injectableEntry = injectableManager.addInjectableEntry(name, resolver, dependencyNames);

      // Assert
      let injectableEntries = injectableManager.getInjectableEntries(['profile']);
      expect(injectableEntries.has(injectableEntry)).toBeTruthy();
    });

    it('returns a Map of ContainerEntries with a InjectableEntry from a of provided profiles', () => {
      // Setup
      let name1 = 'name1';
      let name2 = 'name2';
      let resolver1 = new InjectableResolver('resolver');
      let resolver2 = new InjectableResolver('resolver');
      let resolver3 = new InjectableResolver('resolver');
      let dependencyNames = ['dependencyNames'];
      let profile1 = 'profile1';
      let profile2 = 'profile2';
      let injectableEntry1 = injectableManager.addInjectableEntry(name1, resolver1, dependencyNames);
      let injectableEntry2 = injectableManager.addInjectableEntry(name2, resolver2, dependencyNames, true, [profile1]);
      let injectableEntry3 = injectableManager.addInjectableEntry(name2, resolver3, dependencyNames, true, [profile2]);

      // Assert
      let injectableEntries = injectableManager.getInjectableEntries([profile1]);
      expect(injectableEntries.has(injectableEntry1)).toBeTruthy();
      expect(injectableEntries.has(injectableEntry2)).toBeTruthy();
      expect(injectableEntries.has(injectableEntry3)).toBeFalsy();
    });

    it('returns a Map of ContainerEntries without a InjectableEntry when a profile is provided does not have it available', () => {
      // Setup
      let name = 'test';
      let resolver = new InjectableResolver('resolver');
      let dependencyNames = ['dependencyNames'];
      let profile1 = 'profile1';
      let profile2 = 'profile2';
      let injectableEntry = injectableManager.addInjectableEntry(name, resolver, dependencyNames, true, [profile1]);

      // Assert
      let injectableEntries = injectableManager.getInjectableEntries([profile2]);
      expect(injectableEntries.has(injectableEntry)).toBeFalsy();
    });

  });

});