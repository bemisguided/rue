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
import Environment from '../../lib/utils/Environment';

describe('./utils/Environment.js', () => {

  beforeEach(() => {
    delete process.env.NODE_ENV;
    delete process.env.RUE_PROFILES;
  });

  describe('Environment.profiles()', () => {

    it('adds the NODE_ENV profile to the runtime profiles', () => {
      // Setup
      process.env.NODE_ENV = 'test';

      // Retrieve profiles
      let profiles = Environment.profiles();

      // Assert
      expect(profiles).toEqual(['env:test']);
    });

    it('adds a single RUE_PROFILES profile to the runtime profiles', () => {
      // Setup
      process.env.RUE_PROFILES = 'profile1';

      // Retrieve profiles
      let profiles = Environment.profiles();

      // Assert
      expect(profiles).toEqual(['profile1']);
    });

    it('adds a comma separated RUE_PROFILES profiles to the runtime profiles', () => {
      // Setup
      process.env.RUE_PROFILES = 'profile1,profile2';

      // Retrieve profiles
      let profiles = Environment.profiles();

      // Assert
      expect(profiles).toEqual(['profile1', 'profile2']);
    });

    it('normalizes whitespace in comma separated RUE_PROFILES profiles', () => {
      // Setup
      process.env.RUE_PROFILES = ' profile1, profile2     ';

      // Retrieve profiles
      let profiles = Environment.profiles();

      // Assert
      expect(profiles).toEqual(['profile1', 'profile2']);
    });

    it('normalizes empty profiles in comma separated RUE_PROFILES profiles', () => {
      // Setup
      process.env.RUE_PROFILES = ' profile1, profile2  ,   ';

      // Retrieve profiles
      let profiles = Environment.profiles();

      // Assert
      expect(profiles).toEqual(['profile1', 'profile2']);
    });

    it('returns an empty profiles array when nothing defined in environment variables', () => {
      // Retrieve profiles
      let profiles = Environment.profiles();

      // Assert
      expect(profiles).toEqual([]);
    });

  });

});
