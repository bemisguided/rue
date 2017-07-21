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
import Container from '../../lib/container/Container';
import FactoryBuilder from '../../lib/factory/FactoryBuilder';

describe('./factory/FactoryBuilder.js', () => {

  let container: Container;
  let builder: FactoryBuilder;
  let name: string;

  beforeEach(() => {
    name = 'test';
    container = new Container();
    builder = new FactoryBuilder(name, container);
  });

  describe('useFunction()', () => {

    it('correctly sets the factory Function provided with a FactoryInjectableResolver', () => {

      // Execute
      let result = builder.useFunction(() => {
      });

      // Assert
      expect(builder.resolver.constructor.name).toEqual('FactoryInjectableResolver');
      expect(result).toEqual(builder);
    });

  });

});
