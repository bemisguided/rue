/**
 * @flow
 */
import ContainerEntry from './ContainerEntry';

export default class ProfileEntry {

  name: string;
  containerEntries: { [string]: ContainerEntry };

  constructor(name: string) {
    this.name = name;
    this.containerEntries = {};
  }

  addContainerEntry(containerEntry: ContainerEntry): void {
    this.containerEntries[containerEntry.name] = containerEntry;
  }

  getContainerEntry(name: string): ContainerEntry {
    return this.containerEntries[name];
  }

  getContainerEntries(): Array<ContainerEntry> {
    let result = [];
    Object.keys(this.containerEntries).forEach((name) => {
      result.push(this.containerEntries[name]);
    });
    return result;
  }

  getContainerNames(): Array<string> {
    return Object.keys(this.containerEntries);
  }

  toString() {
    return `ProfileEntry[${this.name}]`;
  }

}