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
import DependencyProcessor from './DependencyProcessor';
import InjectableEntry from '../injectables/InjectableEntry';
import RueError from '../../utils/RueError';

export default class DependencyTraverser {

  dependencyProcessor: DependencyProcessor;

  constructor(dependencyProcessor: DependencyProcessor) {
    this.dependencyProcessor = dependencyProcessor;
  }

  traverse(injectableEntries: Set<InjectableEntry>): Set<InjectableEntry> {
    let result: Set<InjectableEntry> = new Set();
    injectableEntries.forEach((injectableEntry) => {
      if (!result.has(injectableEntry)) {
        _traverse(this.dependencyProcessor, injectableEntry, result, new Set());
      }
    });
    return result;
  }

}

function _traverse(dependencyProcessor: DependencyProcessor, injectableEntry: InjectableEntry, result: Set<InjectableEntry>, unresolved: Set<string>) {
  unresolved.add(injectableEntry.name);

  let dependencies = injectableEntry.dependencies;
  if (dependencies) {
    dependencies.forEach(dependencyName => {
      let dependencyInjectableEntry = dependencyProcessor.resolve(dependencyName);
      if (!dependencyInjectableEntry) {
        throw new RueError('Dependency not available: name=' + dependencyName);
      }
      if (!result.has(dependencyInjectableEntry)) {
        if (unresolved.has(dependencyName)) {
          throw new RueError('Circular dependency found: name=' + injectableEntry.name + ' dependency=' + dependencyName);
        }
        _traverse(dependencyProcessor, dependencyInjectableEntry, result, unresolved);
      }
    });
  }
  result.add(injectableEntry);
  unresolved.delete(injectableEntry.name);
}
