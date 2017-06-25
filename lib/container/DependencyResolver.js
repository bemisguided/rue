/**
 * @flow
 **/
import ContainerEntry from './ContainerEntry';
import RueError from '../utils/RueError';

export default class DependencyResolver {

  containerEntries: Map<string, ContainerEntry>;

  constructor(containerEntries: Map<string, ContainerEntry>) {
    this.containerEntries = containerEntries;
  }

  resolve(): Set<ContainerEntry> {
    let result: Set<ContainerEntry> = new Set();
    this.containerEntries.forEach((containerEntry) => {
      if (!result.has(containerEntry)) {
        _resolve(this.containerEntries, containerEntry, result, new Set());
      }
    });
    return result;
  }

}


function _resolve(containerEntries: Map<string, ContainerEntry>, containerEntry: ContainerEntry, result: Set<ContainerEntry>, unresolved: Set<string>) {
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
        _resolve(containerEntries,dependencyContainerEntry, result, unresolved);
      }
    });
  }
  result.add(containerEntry);
  unresolved.delete(containerEntry.name);
}
