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
import DependencyResolver from '../../../lib/container/dependencies/DependencyResolver';
import DependencyProcessor from '../../../lib/container/dependencies/DependencyProcessor';
import InjectableEntry from '../../../lib/container/injectables/InjectableEntry';
import InjectableResolver from '../../../lib/container/injectables/InjectableResolver';
import InjectableManager from '../../../lib/container/injectables/InjectableManager';

class StubDependencyResolver extends DependencyResolver {

  context: DependencyContext;

  result: ?InjectableEntry;

  constructor(result: ?InjectableEntry) {
    super();
    this.result = result;
  }

  resolve(context: DependencyContext): ?InjectableEntry {
    this.context = context;
    return this.result;
  }

}

describe('./container/dependencies/DependencyProcessor', () => {

  describe('resolve()', () => {

    it('provides the activeProfiles and InjectableManager to the dependency resolver', () => {
      // Setup
      let name = 'test';
      let activeProfiles = ['profile1'];
      let injectableManager = new InjectableManager();
      let dependencyResolver = new StubDependencyResolver(null);
      let dependencyProcessor = new DependencyProcessor();
      dependencyProcessor.activeProfiles = activeProfiles;
      dependencyProcessor.injectableManager = injectableManager;
      dependencyProcessor.dependencyResolvers = [dependencyResolver];

      // Execute
      dependencyProcessor.resolve(name);

      // Assert
      expect(dependencyResolver.context.name).toEqual(name);
      expect(dependencyResolver.context.injectableManager).toEqual(injectableManager);
      expect(dependencyResolver.context.activeProfiles).toEqual(activeProfiles);
    });

    it('resolves with a single dependency resolver', () => {
      // Setup
      let name = 'test';
      let injectableEntry = new InjectableEntry(name, new InjectableResolver());
      let dependencyResolver = new StubDependencyResolver(injectableEntry);
      let dependencyProcessor = new DependencyProcessor();
      dependencyProcessor.dependencyResolvers = [dependencyResolver];

      // Execute
      let result = dependencyProcessor.resolve(name);

      // Assert
      expect(result).toEqual(injectableEntry);
      expect(dependencyResolver.context.name).toEqual(name);
    });

    it('resolves with multiple dependency resolvers and the first one resolves an InjectableResolver', () => {
      // Setup
      let name = 'test';
      let injectableEntry1 = new InjectableEntry(name, new InjectableResolver());
      let dependencyResolver1 = new StubDependencyResolver(injectableEntry1);
      let injectableEntry2 = new InjectableEntry(name, new InjectableResolver());
      let dependencyResolver2 = new StubDependencyResolver(injectableEntry2);
      let dependencyProcessor = new DependencyProcessor();
      dependencyProcessor.dependencyResolvers = [dependencyResolver1, dependencyResolver2];

      // Execute
      let result = dependencyProcessor.resolve(name);

      // Assert
      expect(result).toEqual(injectableEntry1);
      expect(dependencyResolver1.context.name).toEqual(name);
    });

    it('resolves with multiple dependency resolvers and the second one resolves an InjectableResolver', () => {
      // Setup
      let name = 'test';
      let dependencyResolver1 = new StubDependencyResolver(null);
      let injectableEntry = new InjectableEntry(name, new InjectableResolver());
      let dependencyResolver2 = new StubDependencyResolver(injectableEntry);
      let dependencyProcessor = new DependencyProcessor();
      dependencyProcessor.dependencyResolvers = [dependencyResolver1, dependencyResolver2];

      // Execute
      let result = dependencyProcessor.resolve(name);

      // Assert
      expect(result).toEqual(injectableEntry);
      expect(dependencyResolver2.context.name).toEqual(name);
    });

    it('resolves with multiple dependency resolvers and the third one resolves an InjectableResolver', () => {
      // Setup
      let name = 'test';
      let dependencyResolver1 = new StubDependencyResolver(null);
      let dependencyResolver2 = new StubDependencyResolver(null);
      let injectableEntry = new InjectableEntry(name, new InjectableResolver());
      let dependencyResolver3 = new StubDependencyResolver(injectableEntry);
      let dependencyProcessor = new DependencyProcessor();
      dependencyProcessor.dependencyResolvers = [dependencyResolver1, dependencyResolver2, dependencyResolver3];

      // Execute
      let result = dependencyProcessor.resolve(name);

      // Assert
      expect(result).toEqual(injectableEntry);
      expect(dependencyResolver3.context.name).toEqual(name);
    });

  });

});