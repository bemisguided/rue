/**
 * @flow
 */
import ContainerEntryResolver from './ContainerEntryResolver';

export default class ContainerEntry {

  name: string;
  resolver: ContainerEntryResolver;
  dependencies: ?Array<string>;

  constructor(name: string, resolver: ContainerEntryResolver, dependencies: ?Array<string>) {
    this.name = name;
    this.resolver = resolver;
    this.dependencies = dependencies;
  }

  toString() {
    return `ContainerEntry[${this.name}]`;
  }

}