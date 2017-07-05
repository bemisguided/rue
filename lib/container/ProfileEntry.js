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

export default class ProfileEntry {

  name: string;
  injectableEntries: { [string]: InjectableEntry };

  constructor(name: string) {
    this.name = name;
    this.injectableEntries = {};
  }

  addInjectableEntry(injectableEntry: InjectableEntry): void {
    this.injectableEntries[injectableEntry.name] = injectableEntry;
  }

  getInjectableEntry(name: string): InjectableEntry {
    return this.injectableEntries[name];
  }

  getContainerEntries(): Array<InjectableEntry> {
    let result = [];
    Object.keys(this.injectableEntries).forEach((name) => {
      result.push(this.injectableEntries[name]);
    });
    return result;
  }

  getContainerNames(): Array<string> {
    return Object.keys(this.injectableEntries);
  }

  toString() {
    return `ProfileEntry[${this.name}]`;
  }

}