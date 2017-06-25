/**
 * @flow
 */
import ContainerManager from './ContainerManager';

export default class Container {

  containerEntries: ContainerManager;

  constructor() {
    this.containerEntries = new ContainerManager();
  }

  module(name: string, module: () => mixed, dependencies: ?Array<string>, profiles: ?Array<string>): void {

  }

  activate(profiles?: Array<string>): void {

  }

  get(name: string): any {

  }

}
