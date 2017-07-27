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
import InjectableResolver from '../../../lib/container/InjectableResolver';

describe('./injectableManager/injectables/InjectableResolver.js', () => {

  describe('resolve()', () => {

    it('always returns the injectable without operation', () => {
      // Setup
      let expected = {
        value: 'test',
      };

      let resolver = new InjectableResolver(expected);

      // Execute
      let target = resolver.resolve('name1', ['name2', 'name3']);

      // Assert
      expect(target).toEqual(expected);
    });

  });

});
