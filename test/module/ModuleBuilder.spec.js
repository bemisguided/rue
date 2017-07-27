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
import ModuleBuilder from '../../lib/module/ModuleBuilder';

describe('./module/ModuleBuilder.js', () => {

  let container: Container;
  let builder: ModuleBuilder;
  let name: string;

  beforeEach(() => {
    name = 'test';
    container = new Container();
    builder = new ModuleBuilder(name, container);
  });

  describe('lifecycleInit()', () => {

    it('correctly sets the lifecycle init function name', () => {
      // Setup
      let fn = 'initDat';

      // Execute
      let result = builder.lifecycleInit(fn);

      // Assert
      expect(builder.lifecycle.init).toEqual(fn);
      expect(result).toEqual(builder);
    });

  });

  describe('isSingleton()', () => {

    it('returns itself when set to true', () => {
      // Execute
      let result = builder.isSingleton(true);

      // Assert
      expect(result).toEqual(builder);
    });

    it('throws error when attempting to configure as non-singleton', () => {

      // Execute
      try {
        builder.isSingleton(false);
      } catch (error) {
        expect(error.message).toEqual('Cannot configure a module to be a non-singleton');
        return;
      }
      throw new Error('Expect an error');
    });

  });

  describe('useModule()', () => {

    it('correctly sets the module provided with a ModuleInjectableResolver', () => {

      // Execute
      let result = builder.useModule({});

      // Assert
      expect(builder.resolver.constructor.name).toEqual('ModuleInjectableResolver');
      expect(result).toEqual(builder);
    });

  });

  describe('done()', () => {

    it('sets singleton to true', () => {
      // Setup
      builder.useModule({});
      expect(builder.singleton).toBeFalsy();

      // Execute
      builder.done();

      // Assert
      expect(builder.singleton).toBeTruthy();
    });

  });

});
