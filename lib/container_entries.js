const RueError = require('./utils/rue_error');

class ContainerEntries {

  constructor() {
    this.profilesEntries = {};
  }

  addModuleEntry(name, module, dependencies, profiles) {
    let moduleEntry = new ModuleEntry(name, module, dependencies);
    if (!profiles) {
      this.getProfileEntry('').entries[name] = moduleEntry;
      return moduleEntry;
    }
    if (!Array.isArray(profiles)) {
      this.getProfileEntry(profiles).entries[name] = moduleEntry;
      return moduleEntry;
    }
    for (let i = 0; i < profiles.length; i++) {
      this.getProfileEntry(profiles[i]).entries[name] = moduleEntry;
    }
    return moduleEntry;
  }

  getModuleEntry(name, profiles) {
    profiles = normalizeProfiles(profiles);
    let module = null;
    for (let i = 0; i < profiles.length; i++) {
      let profileModule = this.getProfileEntry(profiles[i]).entries[name];
      if (!profileModule) {
        continue;
      }
      if (!module) {
        module = profileModule;
        continue;
      }
      if (module !== profileModule) {
        throw new RueError('Duplicate dependencies found: name=' + name);
      }
    }
    return module;
  }

  getModuleEntries(profiles) {
    profiles = normalizeProfiles(profiles);
    let result = new Set();
    let profileEntries = this.profilesEntries;
    profiles.forEach(function (name) {
      let profile = profileEntries[name];
      if (!profile) {
        return;
      }
      Object.keys(profile.entries).forEach(function(name) {
        result.add(profile.entries[name]);
      });
    });
    return result;
  }

  getProfileEntry(name) {
    let profile = this.profilesEntries[name];
    if (!profile) {
      profile = new ProfileEntry(name);
      this.profilesEntries[name] = profile;
    }
    return profile;
  }

  resolveDependencyOrder(profiles) {
    let resolved = new Set();
    let containerEntries = this;
    this.getModuleEntries(profiles).forEach(function (moduleEntry) {
      if (!resolved.has(moduleEntry.name)) {
        resolve(containerEntries, profiles, moduleEntry.name, resolved, new Set());
      }
    });
    return resolved;
  }

}

class ProfileEntry {

  constructor(name) {
    this.name = name;
    this.entries = {};
  }

}

class ModuleEntry {

  constructor(name, module, dependencies) {
    this.name = name;
    this.module = module;
    this.dependencies = dependencies;
  }

}

function normalizeProfiles(profiles) {
  if (!profiles) {
    profiles = [''];
  } else {
    if (!Array.isArray(profiles)) {
      profiles = ['', profiles];
    } else {
      profiles.push('');
    }
  }
  return profiles;
}

function resolve(containerEntries, profiles, name, resolved, unresolved) {
  unresolved.add(name);
  let entry = containerEntries.getModuleEntry(name, profiles);
  if (!entry) {
    throw new RueError('Dependency not available: name=' + name + " profiles=" + profiles);
  }
  let dependencies = entry.dependencies;
  for (let i = 0; i < dependencies.length; i++) {
    let dependency = dependencies[i];
    if (!resolved.has(dependency)) {
      if (unresolved.has(dependency)) {
        throw new RueError('Circular dependency found: name=' + name + ' dependency=' + dependency);
      }
      resolve(containerEntries, profiles, dependency, resolved, unresolved);
    }
  }
  resolved.add(name);
  unresolved.delete(name);
}


module.exports = ContainerEntries;