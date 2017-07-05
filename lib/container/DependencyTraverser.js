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

export default class DependencyTraverser {

  injectableEntries: Map<string, InjectableEntry>;

  constructor(injectableEntries: Map<string, InjectableEntry>) {
    this.injectableEntries = injectableEntries;
  }

  traverse(): Set<InjectableEntry> {
    let result: Set<InjectableEntry> = new Set();
    this.injectableEntries.forEach((injectableEntry) => {
      if (!result.has(injectableEntry)) {
        _traverse(this.injectableEntries, injectableEntry, result, new Set());
      }
    });
    return result;
  }

}

function _traverse(injectableEntries: Map<string, InjectableEntry>, injectableEntry: InjectableEntry, result: Set<InjectableEntry>, unresolved: Set<string>) {
  unresolved.add(injectableEntry.name);

  let dependencies = injectableEntry.dependencies;
  if (dependencies) {
    dependencies.forEach(dependency => {
      let dependencyInjectableEntry = injectableEntries.get(dependency);
      if (!dependencyInjectableEntry) {
        throw new RueError('Dependency not available: name=' + dependency);
      }
      if (!result.has(dependencyInjectableEntry)) {
        if (unresolved.has(dependency)) {
          throw new RueError('Circular dependency found: name=' + injectableEntry.name + ' dependency=' + dependency);
        }
        _traverse(injectableEntries, dependencyInjectableEntry, result, unresolved);
      }
    });
  }
  result.add(injectableEntry);
  unresolved.delete(injectableEntry.name);
}
