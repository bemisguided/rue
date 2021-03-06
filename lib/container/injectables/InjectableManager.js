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
import InjectableResolver from '../InjectableResolver';
import ProfileHelper from '../../utils/ProfileHelper';
import RueError from '../../utils/RueError';

import type { InjectableEntryOptions } from './InjectableEntryOptions';

export default class InjectableManager {

  injectableEntries: Array<InjectableEntry>;

  constructor() {
    this.injectableEntries = [];
  }

  addInjectableEntry(name: string, resolver: InjectableResolver, options: InjectableEntryOptions): InjectableEntry {

    // Normalize singleton
    let singleton = options.singleton;
    if (singleton === undefined || singleton === null) {
      singleton = true;
    }

    // Normalize dependencies
    let dependencyNames = options.dependencyNames;
    if (!dependencyNames) {
      dependencyNames = [];
    }

    // Normalize profiles
    let profileNames = ProfileHelper.normalizeProfiles(options.profileNames);

    // Normalize lifecycle method names
    let lifecycle = options.lifecycle;
    if (!lifecycle) {
      lifecycle = {};
    }

    // Create the injectable entry
    let injectableEntry = new InjectableEntry(name, resolver);
    injectableEntry.singleton = singleton;
    injectableEntry.dependencyNames = dependencyNames;
    injectableEntry.profileNames = profileNames;
    injectableEntry.lifecycle = lifecycle;
    injectableEntry.filter = options.filter;

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
      if (!ProfileHelper.filterProfiles(injectableEntry.profileNames, activeProfiles)) {
        continue;
      }
      if (result !== null) {
        throw new RueError('Duplicate injectable found in active profile scope: name=' + name);
      }
      result = injectableEntry;
    }
    return result;
  }

  getInjectableEntries(activeProfiles: ?Array<string>): Set<InjectableEntry> {

    // Normalize activeProfiles
    activeProfiles = ProfileHelper.normalizeActiveProfiles(activeProfiles);

    // Iterate and file based on the active profiles
    let result = new Map();
    for (let i = 0; i < this.injectableEntries.length; i++) {
      let injectableEntry = this.injectableEntries[i];
      if (!ProfileHelper.filterProfiles(injectableEntry.profileNames, activeProfiles)) {
        continue;
      }
      let name = injectableEntry.name;
      if (result.has(name)) {
        throw new RueError('Duplicate injectable found in active profile scope: name=' + name);
      }
      result.set(name, injectableEntry);
    }
    return new Set(result.values());
  }

}
