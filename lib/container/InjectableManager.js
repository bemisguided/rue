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
import InjectableResolver from './injectables/InjectableResolver';
import RueError from '../utils/RueError';
import ProfileHelper from '../utils/ProfileHelper';

export default class InjectableManager {

  injectableEntries: Array<InjectableEntry>;

  constructor() {
    this.injectableEntries = [];
  }

  addInjectableEntry(name: string, resolver: InjectableResolver, dependencies: ?Array<string>, singleton: ?boolean, profiles: ?Array<string>): InjectableEntry {

    // Normalize singleton
    if (singleton === undefined || singleton === null) {
      singleton = true;
    }

    // Normalize dependencies
    if (!dependencies) {
      dependencies = [];
    }

    // Normalize profiles
    profiles = ProfileHelper.normalizeProfiles(profiles);

    // Create the injectable entry
    let injectableEntry = new InjectableEntry(name, resolver);
    injectableEntry.singleton = singleton;
    injectableEntry.dependencies = dependencies;
    injectableEntry.profiles = profiles;

    // Add the injectable entry to the map
    this.injectableEntries.push(injectableEntry);

    return injectableEntry;
  }

  getInjectableEntry(name: string, activeProfiles: ?Array<string>): ?InjectableEntry {

    // Normalize activeProfiles
    activeProfiles = ProfileHelper.normalizeActiveProfiles(activeProfiles);

    // Iterate and filter based on name & active profiles
    let result = null;
    for (let i = 0; i < this.injectableEntries.length; i++) {
      let injectableEntry = this.injectableEntries[i];
      if (name !== injectableEntry.name) {
        continue;
      }
      if (!ProfileHelper.filterProfiles(injectableEntry.profiles, activeProfiles)) {
        continue;
      }
      if (result !== null) {
        throw new RueError('Duplicate injectable found in active profile scope: name=' + name);
      }
      result = injectableEntry;
    }
    return result;
  }

  getInjectableEntries(activeProfiles: ?Array<string>): Map<string, InjectableEntry> {

    // Normalize activeProfiles
    activeProfiles = ProfileHelper.normalizeActiveProfiles(activeProfiles);

    // Iterate and file based on the active profiles
    let result = new Map;
    for (let i = 0; i < this.injectableEntries.length; i++) {
      let injectableEntry = this.injectableEntries[i];
      if (!ProfileHelper.filterProfiles(injectableEntry.profiles, activeProfiles)) {
        continue;
      }
      let name = injectableEntry.name;
      if (result.has(name)) {
        throw new RueError('Duplicate injectable found in active profile scope: name=' + name);
      }
      result.set(name, injectableEntry);
    }
    return result;
  }

}
