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