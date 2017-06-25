/**
 * @flow
 */
import ProfileManager from './ProfileManager';
import ContainerEntry from './ContainerEntry';
import RueError from '../utils/RueError';

export default class ContainerManager {

  profileManager: ProfileManager;

  constructor() {
    this.profileManager = new ProfileManager();
  }

  addContainerEntry(name: string, module: any, dependencies: ?Array<string>, profiles: ?Array<string>): ContainerEntry {
    let containerEntry = new ContainerEntry(name, module, dependencies);
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

  //
  // getProfileEntry(name) {
  //   let profile = this.profilesEntries[name];
  //   if (!profile) {
  //     profile = new ProfileEntry(name);
  //     this.profilesEntries[name] = profile;
  //   }
  //   return profile;
  // }
  //
  // resolveDependencyOrder(profiles) {
  //   let resolved = new Set();
  //   let containerEntries = this;
  //   this.getModuleEntries(profiles).forEach(function (moduleEntry) {
  //     if (!resolved.has(moduleEntry.name)) {
  //       resolve(containerEntries, profiles, moduleEntry.name, resolved, new Set());
  //     }
  //   });
  //   return resolved;
  // }

}
