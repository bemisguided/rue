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
import ContainerManager from './ContainerManager';
import ContainerEntryResolver from './ContainerEntryResolver';

export default class Container {

  containerManager: ContainerManager;

  constructor() {
    this.containerManager = new ContainerManager();
  }

  register(name: string, resolver: ContainerEntryResolver, dependencies: ?Array<string>, profiles: ?Array<string>, singleton: ?boolean): void {
    this.containerManager.addContainerEntry(name, resolver, dependencies, singleton, profiles);
  }

  activate(profiles?: Array<string>): void {

  }

  get(name: string): any {

  }

}
