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
import ProfileHelper from '../../lib/utils/ProfileHelper';

describe('./util/ProfileHelper.js', () => {

  describe('ProfileHelper.filterProfiles()', () => {

    it('filters array of profiles for a provided array of active profiles', () => {
      // Setup
      let profile1 = 'profile1';
      let profile2 = 'profile2';

      // Execute
      let result = ProfileHelper.filterProfiles([profile1], [profile1, profile2]);

      // Assert
      expect(result).toEqual(true);
    });

    it('filters array of profiles with the not (!) operator for a provided array of active profiles', () => {
      // Setup
      let profile1 = 'profile1';
      let profile2 = 'profile2';

      // Execute
      let result = ProfileHelper.filterProfiles(['!other'], [profile1, profile2]);

      // Assert
      expect(result).toEqual(true);
    });

    it('returns false when an array profiles does not match for a provided array of active profiles', () => {
      // Setup
      let profile1 = 'profile1';
      let profile2 = 'profile2';

      // Execute
      let result = ProfileHelper.filterProfiles(['other'], [profile1, profile2]);

      // Assert
      expect(result).toEqual(false);
    });

    it('returns false when an array profiles does not match with the not (!) operator for a provided array of active profiles', () => {
      // Setup
      let profile1 = 'profile1';
      let profile2 = 'profile2';

      // Execute
      let result = ProfileHelper.filterProfiles(['!' + profile1], [profile1, profile2]);

      // Assert
      expect(result).toEqual(false);
    });

  });

  describe('ProfileHelper.hasProfile()', () => {

    it('matches a profile for a provided array of active profiles', () => {
      // Setup
      let profile1 = 'profile1';
      let profile2 = 'profile2';

      // Execute
      let result = ProfileHelper.hasProfile(profile1, [profile1, profile2]);

      // Assert
      expect(result).toEqual(true);
    });

    it('returns false when a profile does not match for a provided array of active profiles', () => {
      // Setup
      let profile1 = 'profile1';
      let profile2 = 'profile2';

      // Execute
      let result = ProfileHelper.hasProfile('other', [profile1, profile2]);

      // Assert
      expect(result).toEqual(false);
    });

  });

  describe('ProfileHelper.hasProfileNot()', () => {

    it('returns false when a profile matches for a provided array of active profiles', () => {
      // Setup
      let profile1 = 'profile1';
      let profile2 = 'profile2';

      // Execute
      let result = ProfileHelper.hasProfileNot(profile1, [profile1, profile2]);

      // Assert
      expect(result).toEqual(false);
    });

    it('returns true when a profile does not match for a provided array of active profiles', () => {
      // Setup
      let profile1 = 'profile1';
      let profile2 = 'profile2';

      // Execute
      let result = ProfileHelper.hasProfileNot('other', [profile1, profile2]);

      // Assert
      expect(result).toEqual(true);
    });

  });

  describe('ProfileHelper.normalizeActiveProfiles()', () => {

    it('normalizes the active profiles with a default only if no profiles provided', () => {
      // Execute
      let result = ProfileHelper.normalizeActiveProfiles();

      // Assert
      expect(result).toEqual([ProfileHelper.PROFILE_DEFAULT]);
    });

    it('normalizes the active profiles with a default if no default provided', () => {
      // Setup
      let profile1 = 'profile1';

      // Execute
      let result = ProfileHelper.normalizeActiveProfiles([profile1]);

      // Assert
      expect(result).toEqual([profile1, ProfileHelper.PROFILE_DEFAULT]);
    });

    it('normalizes the active profiles without adding a default if default already provided', () => {
      // Setup
      let profile1 = 'profile1';

      // Execute
      let result = ProfileHelper.normalizeActiveProfiles([profile1, ProfileHelper.PROFILE_DEFAULT]);

      // Assert
      expect(result).toEqual([profile1, ProfileHelper.PROFILE_DEFAULT]);
    });

  });
  describe('ProfileHelper.normalizeProfiles()', () => {

    it('normalizes the profiles with a default only if no profiles provided', () => {
      // Execute
      let result = ProfileHelper.normalizeProfiles();

      // Assert
      expect(result).toEqual([ProfileHelper.PROFILE_DEFAULT]);
    });

    it('normalizes the profiles without a default', () => {
      // Setup
      let profile1 = 'profile1';

      // Execute
      let result = ProfileHelper.normalizeProfiles([profile1]);

      // Assert
      expect(result).toEqual([profile1]);
    });

  });

});
