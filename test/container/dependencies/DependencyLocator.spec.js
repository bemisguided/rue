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
import DependencyLocator from '../../../lib/container/dependencies/DependencyLocator';
import InjectableResolver from '../../../lib/container/InjectableResolver';
import InjectableManager from '../../../lib/container/injectables/InjectableManager';
import DependencyNameMapper from '../../../lib/container/DependencyNameMapper';

class StubDependencyNameMapper extends DependencyNameMapper {

  replacement: string;

  dependencyName: string

  constructor(replacement: string) {
    super();
    this.replacement = replacement;
  }

  map(dependencyName: string): ?string {
    this.dependencyName = dependencyName;
    return this.replacement;
  }

}

describe('./container/dependencies/DependencyLocator', () => {

  let injectableManager: InjectableManager;
  let dependencyLocator: DependencyLocator;

  beforeEach(() => {
    injectableManager = new InjectableManager();
    dependencyLocator = new DependencyLocator(injectableManager, []);
    dependencyLocator.activeProfiles = [];
  });

  describe('resolve()', () => {

    it('resolve a dependency without any profiles provided', () => {
      // Setup
      let dependencyName = 'test';
      injectableManager.addInjectableEntry(dependencyName, new InjectableResolver(), {});

      // Execute
      let injectable = dependencyLocator.resolve(dependencyName);

      // Assert
      expect(injectable).not.toBeUndefined();
      expect(injectable).not.toBeNull();
      if (!injectable) {
        return;
      }
      expect(injectable.name).toEqual(dependencyName);
    });

    it('resolve a dependency when profiles are provided that correspond to the dependency', () => {
      // Setup
      let dependencyName = 'test';
      let profile = 'profile';
      let profiles = [profile];
      injectableManager.addInjectableEntry(dependencyName, new InjectableResolver(), {profileNames: profiles});
      dependencyLocator.activeProfiles = profiles;

      // Execute
      let injectable = dependencyLocator.resolve(dependencyName);

      // Assert
      expect(injectable).not.toBeUndefined();
      expect(injectable).not.toBeNull();
      if (!injectable) {
        return;
      }
      expect(injectable.name).toEqual(dependencyName);
    });

    it('does not resolve a dependency when profiles are provided do not correspond to the dependency', () => {
      // Setup
      let dependencyName = 'test';
      let profile = 'profile';
      let profiles = [profile];
      injectableManager.addInjectableEntry(dependencyName, new InjectableResolver(), {profileNames: profiles});

      // Execute
      let injectable = dependencyLocator.resolve(dependencyName);

      // Assert
      expect(injectable).toBeNull();
    });

    it('resolves a dependency with a name mapping and skips one that does not map', () => {
      // Setup
      let dependencyName = 'test';
      let preMappedName = 'other';
      injectableManager.addInjectableEntry(dependencyName, new InjectableResolver(), {});
      let dependencyNameMapper = new StubDependencyNameMapper(dependencyName);
      dependencyLocator.dependencyNameMappers.push(new DependencyNameMapper());
      dependencyLocator.dependencyNameMappers.push(dependencyNameMapper);

      // Execute
      let injectable = dependencyLocator.resolve(preMappedName);

      // Assert
      expect(injectable).not.toBeUndefined();
      expect(injectable).not.toBeNull();
      if (!injectable) {
        return;
      }
      expect(injectable.name).toEqual(dependencyName);
      expect(dependencyNameMapper.dependencyName).toEqual(preMappedName);
    });

  });

});
