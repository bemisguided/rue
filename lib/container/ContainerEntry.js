/**
 * @flow
 */
export default class ContainerEntry {

  name: string;
  module: any;
  dependencies: ?Array<string>;

  constructor(name: string, module: any, dependencies: ?Array<string>) {
    this.name = name;
    this.module = module;
    this.dependencies = dependencies;
  }

  toString() {
    return `ContainerEntry[${this.name}]`;
  }

}