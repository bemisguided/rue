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
import ProfileManager from '../../lib/container/ProfileManager';
import ProfileEntry from '../../lib/container/ProfileEntry';

describe('./injectableManager/ProfileManager.js', () => {

  let profileManager: ProfileManager;

  beforeEach(function () {
    profileManager = new ProfileManager();
  });

  describe('addProfileEntry()', () => {

    it('creates a new ProfileEntry if one does not exist for the provided name', () => {
      // Execute
      let name = 'test';
      let profileEntry1 = profileManager.addProfileEntry(name);

      // Assert
      let profileEntry2 = profileManager.profileEntries[name];
      expect(profileEntry1).not.toBeUndefined();
      expect(profileEntry1).not.toBeNull();
      expect(profileEntry2).toEqual(profileEntry1);
    });

    it('returns the existing ProfileEntry for a provided name that already exists', () => {
      // Setup
      let name = 'test';
      let profileEntry1 = new ProfileEntry(name);
      profileManager.profileEntries[name] = profileEntry1;

      // Execute
      let profileEntry2 = profileManager.addProfileEntry(name);

      // Assert
      expect(profileEntry1).toEqual(profileEntry2);
    });

  });

  describe('getProfileEntry()', () => {

    it('does not return a ProfileEntry if one does not exist for the given name', () => {
      // Execute
      let name = 'test';
      let profileEntry = profileManager.getProfileEntry(name);

      // Assert
      expect(profileEntry).toBeUndefined();
    });

    it('returns the existing ProfileEntry for provided name ', function () {
      // Setup
      let name = 'test';
      let profileEntry1 = new ProfileEntry(name);
      profileManager.profileEntries[name] = profileEntry1;

      // Execute
      let profileEntry2 = profileManager.getProfileEntry(name);

      // Assert
      expect(profileEntry1).toEqual(profileEntry2);
    });

  });

  describe('getDefaultProfileEntry()', () => {

    it('returns the default ProfileEntry', function () {
      // Execute
      let profileEntry = profileManager.getDefaultProfileEntry();

      // Assert
      expect(profileEntry).not.toBeUndefined();
      expect(profileEntry).not.toBeNull();
      expect(profileEntry.name).toEqual('');
    });

  });

  describe('resolveProfileEntries()', () => {

    it('resolves the default ProfileEntry when no profiles are provided', () => {
      // Setup
      let defaultProfileEntry = profileManager.getDefaultProfileEntry();

      // Execute
      let profileEntries = profileManager.resolveProfileEntries();

      // Assert
      expect(profileEntries.size).toEqual(1);
      expect(profileEntries.has(defaultProfileEntry)).toEqual(true);
    });

    it('resolves the default ProfileEntry in addition to provided profiles', () => {
      // Setup
      let profile1 = 'profile1';
      let profileEntry = profileManager.addProfileEntry(profile1);
      let defaultProfileEntry = profileManager.getDefaultProfileEntry();

      // Execute
      let profileEntries = profileManager.resolveProfileEntries([profile1]);

      // Assert
      expect(profileEntries.size).toEqual(2);
      expect(profileEntries.has(defaultProfileEntry)).toEqual(true);
      expect(profileEntries.has(profileEntry)).toEqual(true);
    });

    it('resolves ProfileEntries when unknown profiles are provided', () => {
      // Setup
      let profile1 = 'profile1';
      let profile2 = 'profile2';
      let profileEntry = profileManager.addProfileEntry(profile1);
      let defaultProfileEntry = profileManager.getDefaultProfileEntry();

      // Execute
      let profileEntries = profileManager.resolveProfileEntries([profile1, profile2]);

      // Assert
      expect(profileEntries.size).toEqual(2);
      expect(profileEntries.has(defaultProfileEntry)).toEqual(true);
      expect(profileEntries.has(profileEntry)).toEqual(true);
    });

  });

});