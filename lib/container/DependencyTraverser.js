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
import InjectableEntry from './InjectableEntry';
import RueError from '../utils/RueError';
import DependencyContext from './dependencies/DependencyContext';
import InjectableManager from './InjectableManager';
import DependencyResolver from './dependencies/DependencyResolver';

export default class DependencyTraverser {

  activeProfiles: Array<string>;
  dependencyResolvers: Array<DependencyResolver>;
  injectableManager : InjectableManager;

  constructor() {
  }

  traverse(): Set<InjectableEntry> {
    let injectableEntries = this.injectableManager.getInjectableEntries(this.activeProfiles);
    let result: Set<InjectableEntry> = new Set();
    injectableEntries.forEach((injectableEntry) => {
      if (!result.has(injectableEntry)) {
        _traverse(this.dependencyResolvers, this.injectableManager, this.activeProfiles, injectableEntry, result, new Set());
      }
    });
    return result;
  }

}

function _resolve(dependencyResolvers: Array<DependencyResolver>, injectableManager: InjectableManager, activeProfiles: Array<string>, name: string): ?InjectableEntry {
  let result: ?InjectableEntry;

  let dependencyContext = new DependencyContext();
  dependencyContext.name = name;
  dependencyContext.injectableManager = injectableManager;
  dependencyContext.profiles = activeProfiles;
  for (let i = 0; i < dependencyResolvers.length; i++) {
    result = dependencyResolvers[i].resolve(dependencyContext);
    if (!result) {
      break;
    }
  }
  return result;
}

function _traverse(dependencyResolvers: Array<DependencyResolver>, injectableManager: InjectableManager, activeProfiles: Array<string>, injectableEntry: InjectableEntry, result: Set<InjectableEntry>, unresolved: Set<string>) {
  unresolved.add(injectableEntry.name);

  let dependencies = injectableEntry.dependencies;
  if (dependencies) {
    dependencies.forEach(dependencyName => {
      let dependencyInjectableEntry = _resolve(dependencyResolvers, injectableManager, activeProfiles, dependencyName);
      if (!dependencyInjectableEntry) {
        throw new RueError('Dependency not available: name=' + dependencyName);
      }
      if (!result.has(dependencyInjectableEntry)) {
        if (unresolved.has(dependencyName)) {
          throw new RueError('Circular dependency found: name=' + injectableEntry.name + ' dependency=' + dependencyName);
        }
        _traverse(dependencyResolvers, injectableManager, activeProfiles, dependencyInjectableEntry, result, unresolved);
      }
    });
  }
  result.add(injectableEntry);
  unresolved.delete(injectableEntry.name);
}
