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
import ProfileEntry from '../../lib/container/ProfileEntry';
import InjectableEntry from '../../lib/container/InjectableEntry';
import InjectableResolver from '../../lib/container/injectables/InjectableResolver';

describe('./injectableManager/ProfileEntry.js', () => {

  let profileEntry: ProfileEntry;

  beforeEach(() => {
    profileEntry = new ProfileEntry('test');
  });

  describe('addInjectableEntry()', () => {

    it('adds a InjectableEntry to the hash of content entries', () => {
      // Setup
      let name = 'name';
      let injectableEntry1 = new InjectableEntry(name, new InjectableResolver(''), true);

      // Execute
      profileEntry.addInjectableEntry(injectableEntry1);

      // Assert
      let injectableEntry2 = profileEntry.injectableEntries[name];
      expect(injectableEntry2).toEqual(injectableEntry1);
    });

  });

  describe('getInjectableEntry()', () => {

    it('returns a InjectableEntry by a provided name from the hash of content entries', () => {
      // Setup
      let name = 'name';
      let injectableEntry1 = new InjectableEntry(name, new InjectableResolver(''), true);
      profileEntry.injectableEntries[name] = injectableEntry1;

      // Execute
      let injectableEntry2 = profileEntry.getInjectableEntry(name);

      // Assert
      expect(injectableEntry2).toEqual(injectableEntry1);
    });

  });

  describe('getInjectableEntries()', () => {

    it('returns an array of InjectableEntry from the hash of content entries', () => {
      // Setup
      let name1 = 'name1';
      let name2 = 'name2';
      let injectableEntry1 = new InjectableEntry(name1, new InjectableResolver(''), true);
      let injectableEntry2 = new InjectableEntry(name2, new InjectableResolver(''), true);
      profileEntry.injectableEntries[name1] = injectableEntry1;
      profileEntry.injectableEntries[name2] = injectableEntry2;

      // Execute
      let injectableEntries = profileEntry.getContainerEntries();

      // Assert
      expect(injectableEntries.indexOf(injectableEntry1)).toBeGreaterThan(-1);
      expect(injectableEntries.indexOf(injectableEntry2)).toBeGreaterThan(-1);
    });

  });

  describe('getContainerNames()', () => {

    it('returns an array of InjectableEntry names from the hash of content entries', () => {
      // Setup
      let name1 = 'name1';
      let name2 = 'name2';
      let injectableEntry1 = new InjectableEntry(name1, new InjectableResolver(''), true);
      let injectableEntry2 = new InjectableEntry(name2, new InjectableResolver(''), true);
      profileEntry.injectableEntries[name1] = injectableEntry1;
      profileEntry.injectableEntries[name2] = injectableEntry2;

      // Execute
      let injectableEntries = profileEntry.getContainerNames();

      // Assert
      expect(injectableEntries.indexOf(name1)).toBeGreaterThan(-1);
      expect(injectableEntries.indexOf(name2)).toBeGreaterThan(-1);
    });

  });

});
