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
import ProfileManager from './ProfileManager';
import InjectableEntry from './InjectableEntry';
import InjectableResolver from './injectables/InjectableResolver';
import RueError from '../utils/RueError';

export default class InjectableManager {

  profileManager: ProfileManager;

  constructor() {
    this.profileManager = new ProfileManager();
  }

  addInjectableEntry(name: string, resolver: InjectableResolver, dependencies: ?Array<string>, singleton: ?boolean, profiles: ?Array<string>): InjectableEntry {
    if (singleton === undefined || singleton === null) {
      singleton = true;
    }
    let injectableEntry = new InjectableEntry(name, resolver, singleton, dependencies);
    if (!profiles) {
      this.profileManager.getDefaultProfileEntry().addInjectableEntry(injectableEntry);
      return injectableEntry;
    }
    if (!Array.isArray(profiles)) {
      this.profileManager.addProfileEntry(profiles).addInjectableEntry(injectableEntry);
      return injectableEntry;
    }
    for (let i = 0; i < profiles.length; i++) {
      this.profileManager.addProfileEntry(profiles[i]).addInjectableEntry(injectableEntry);
    }
    return injectableEntry;
  }

  getInjectableEntry(name: string, profiles: ?Array<string>): ?InjectableEntry {
    let profileEntries = this.profileManager.resolveProfileEntries(profiles);
    let injectableEntry = null;
    profileEntries.forEach((profileEntry) => {
      let resolvedInjectableEntry = profileEntry.getInjectableEntry(name);
      if (!resolvedInjectableEntry) {
        return;
      }
      if (resolvedInjectableEntry) {
        injectableEntry = resolvedInjectableEntry;
        return;
      }
      // TODO REVIEW ME this doesn't look right
      if (injectableEntry !== resolvedInjectableEntry) {
        throw new RueError('Duplicate dependencies found: name=' + name);
      }
    });
    return injectableEntry;
  }

  getInjectableEntries(profiles: ?Array<string>): Map<string, InjectableEntry> {
    let result = new Map;
    let profileEntries = this.profileManager.resolveProfileEntries(profiles);
    profileEntries.forEach(profileEntry => {
      profileEntry.getContainerEntries().forEach(injectableEntry => {
        result.set(injectableEntry.name, injectableEntry);
      });
    });
    return result;
  }

}
