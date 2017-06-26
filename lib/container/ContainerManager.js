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
import ContainerEntry from './ContainerEntry';
import ContainerEntryResolver from './ContainerEntryResolver';
import RueError from '../utils/RueError';

export default class ContainerManager {

  profileManager: ProfileManager;

  constructor() {
    this.profileManager = new ProfileManager();
  }

  addContainerEntry(name: string, dependencyResolver: ContainerEntryResolver, dependencies: ?Array<string>, profiles: ?Array<string>): ContainerEntry {
    let containerEntry = new ContainerEntry(name, dependencyResolver, dependencies);
    if (!profiles) {
      this.profileManager.getDefaultProfileEntry().addContainerEntry(containerEntry);
      return containerEntry;
    }
    if (!Array.isArray(profiles)) {
      this.profileManager.addProfileEntry(profiles).addContainerEntry(containerEntry);
      return containerEntry;
    }
    for (let i = 0; i < profiles.length; i++) {
      this.profileManager.addProfileEntry(profiles[i]).addContainerEntry(containerEntry);
    }
    return containerEntry;
  }

  getContainerEntry(name: string, profiles: ?Array<string>): ?ContainerEntry {
    let profileEntries = this.profileManager.resolveProfileEntries(profiles);
    let containerEntry = undefined;
    profileEntries.forEach((profileEntry) => {
      let resolveContainerEntry = profileEntry.getContainerEntry(name);
      if (!resolveContainerEntry) {
        return;
      }
      if (resolveContainerEntry) {
        containerEntry = resolveContainerEntry;
        return;
      }
      if (containerEntry !== resolveContainerEntry) {
        throw new RueError('Duplicate dependencies found: name=' + name);
      }
    });
    return containerEntry;
  }

  getContainerEntries(profiles: ?Array<string>): Map<string, ContainerEntry> {
    let result = new Map;
    let profileEntries = this.profileManager.resolveProfileEntries(profiles);
    profileEntries.forEach(profileEntry => {
      profileEntry.getContainerEntries().forEach(containerEntry => {
        result.set(containerEntry.name, containerEntry);
      });
    });
    return result;
  }

}
