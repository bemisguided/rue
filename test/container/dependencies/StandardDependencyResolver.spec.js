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
import DependencyContext from '../../../lib/container/dependencies/DependencyContext';
import StandardDependencyResolver from '../../../lib/container/dependencies/StandardDependencyResolver';
import Container from '../../../lib/container/Container';
import InjectableResolver from '../../../lib/container/injectables/InjectableResolver';

describe('./injectableManager/dependencies/StandardDependencyResolver.js', () => {

  let container: Container;
  let context: DependencyContext;

  describe('resolve()', () => {

    beforeEach(() => {
      container = new Container();
      context = new DependencyContext();
      context.injectableManager = container.injectableManager;
    });

    it('resolve a dependency without any profiles provided', () => {
      // Setup
      let name = 'test';
      container.registerDependency(name, new InjectableResolver());
      context.name = name;
      let resolver = new StandardDependencyResolver();

      // Execute
      let injectable = resolver.resolve(context);

      // Assert
      expect(injectable).not.toBeUndefined();
      expect(injectable).not.toBeNull();
      if (!injectable) {
        return;
      }
      expect(injectable.name).toEqual(name);
    });

    it('resolve a dependency when profiles are provided that correspond to the dependency', () => {
      // Setup
      let name = 'test';
      let profile = 'profile';
      let profiles = [profile];
      container.registerDependency(name, new InjectableResolver(), {profileNames: profiles});
      context.name = name;
      context.activeProfiles = profiles;
      let resolver = new StandardDependencyResolver();

      // Execute
      let injectable = resolver.resolve(context);

      // Assert
      expect(injectable).not.toBeUndefined();
      expect(injectable).not.toBeNull();
      if (!injectable) {
        return;
      }
      expect(injectable.name).toEqual(name);
    });

    it('does not resolve a dependency when profiles are provided do not correspond to the dependency', () => {
      // Setup
      let name = 'test';
      let profile = 'profile';
      let profiles = [profile];
      container.registerDependency(name, new InjectableResolver(), {profileNames: profiles});
      context.name = name;
      let resolver = new StandardDependencyResolver();

      // Execute
      let injectable = resolver.resolve(context);

      // Assert
      expect(injectable).toBeNull();
    });

  });

});
