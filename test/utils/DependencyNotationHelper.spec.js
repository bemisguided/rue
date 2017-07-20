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
import DependencyNotationHelper from '../../lib/utils/DependencyNotationHelper';

describe('./utils/DependencyNotationHelper.js', () => {

  describe('DependencyNotationHelper.normalizeDependencyName()', () => {

    it('normalizes a dependency name w/o dependency notation prefix', () => {
      // Retrieve profiles
      let profile = DependencyNotationHelper.normalizeDependencyName('profile');

      // Assert
      expect(profile).toEqual('profile');
    });

    it('normalizes a dependency name /w dependency notation + prefix', () => {
      // Retrieve profiles
      let profile = DependencyNotationHelper.normalizeDependencyName('+profile');

      // Assert
      expect(profile).toEqual('profile');
    });

    it('normalizes a dependency name /w dependency notation ? prefix', () => {
      // Retrieve profiles
      let profile = DependencyNotationHelper.normalizeDependencyName('?profile');

      // Assert
      expect(profile).toEqual('profile');
    });

  });

  describe('DependencyNotationHelper.isOptional()', () => {

    it('indicates that a dependency name is not optional when no dependency notation included', () => {
      // Execute
      let result = DependencyNotationHelper.isOptional('profile');

      // Assert
      expect(result).toEqual(false);
    });

    it('indicates that a dependency name is optional when the ? dependency notation prefix is included', () => {
      // Execute
      let result = DependencyNotationHelper.isOptional('?profile');

      // Assert
      expect(result).toEqual(true);
    });

    it('indicates that a dependency name is optional when the + dependency notation prefix is included', () => {
      // Execute
      let result = DependencyNotationHelper.isOptional('+profile');

      // Assert
      expect(result).toEqual(true);
    });

  });

  describe('DependencyNotationHelper.isSkipOptional()', () => {

    it('indicates that a dependency name is not skip optional when no dependency notation included', () => {
      // Execute
      let result = DependencyNotationHelper.isSkipOptional('profile');

      // Assert
      expect(result).toEqual(false);
    });

    it('indicates that a dependency name is skipp optional when the ? dependency notation prefix is included', () => {
      // Execute
      let result = DependencyNotationHelper.isSkipOptional('?profile');

      // Assert
      expect(result).toEqual(true);
    });

    it('indicates that a dependency name is not skip optional when the + dependency notation prefix is included', () => {
      // Execute
      let result = DependencyNotationHelper.isSkipOptional('+profile');

      // Assert
      expect(result).toEqual(false);
    });

  });

});