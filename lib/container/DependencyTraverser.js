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
import ContainerEntry from './ContainerEntry';
import RueError from '../utils/RueError';

export default class DependencyTraverser {

  containerEntries: Map<string, ContainerEntry>;

  constructor(containerEntries: Map<string, ContainerEntry>) {
    this.containerEntries = containerEntries;
  }

  traverse(): Set<ContainerEntry> {
    let result: Set<ContainerEntry> = new Set();
    this.containerEntries.forEach((containerEntry) => {
      if (!result.has(containerEntry)) {
        _traverse(this.containerEntries, containerEntry, result, new Set());
      }
    });
    return result;
  }

}


function _traverse(containerEntries: Map<string, ContainerEntry>, containerEntry: ContainerEntry, result: Set<ContainerEntry>, unresolved: Set<string>) {
  unresolved.add(containerEntry.name);

  let dependencies = containerEntry.dependencies;
  if (dependencies) {
    dependencies.forEach(dependency => {
      let dependencyContainerEntry = containerEntries.get(dependency);
      if (!dependencyContainerEntry) {
        throw new RueError('Dependency not available: name=' + dependency);
      }
      if (!result.has(dependencyContainerEntry)) {
        if (unresolved.has(dependency)) {
          throw new RueError('Circular dependency found: name=' + containerEntry.name + ' dependency=' + dependency);
        }
        _traverse(containerEntries,dependencyContainerEntry, result, unresolved);
      }
    });
  }
  result.add(containerEntry);
  unresolved.delete(containerEntry.name);
}
