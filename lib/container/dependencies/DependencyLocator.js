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
import DependencyNameMapper from '../DependencyNameMapper';
import InjectableManager from '../injectables/InjectableManager';
import InjectableEntry from '../injectables/InjectableEntry';

export default class DependencyLocator {

  activeProfiles: Array<string>;

  dependencyNameMappers: Array<DependencyNameMapper>;

  injectableManager: InjectableManager;

  constructor(injectableManager: InjectableManager, dependencyNameMappers: Array<DependencyNameMapper>) {
    this.dependencyNameMappers = dependencyNameMappers;
    this.injectableManager = injectableManager;
  }

  resolve(dependencyName: string): ?InjectableEntry {
    let resolvedDependencyName = dependencyName;
    for (let dependencyNameMapper of this.dependencyNameMappers) {
      let tempDependencyName = dependencyNameMapper.map(dependencyName);
      if (!tempDependencyName) {
        continue;
      }
      resolvedDependencyName = tempDependencyName;
      break;
    }
    return this.injectableManager.getInjectableEntry(resolvedDependencyName, this.activeProfiles);
  }

}
