const ContainerEntries = require('container_entries');
const RueError = require('./utils/rue_error');

class Container {

  constructor() {
    this.containerEntries = new ContainerEntries();
  }

  module(name, module, dependencies, profiles) {
    if (!dependencies) {
      dependencies = [];
    }
    if (!profiles) {
    }
    this.entries[name] = new ModuleEntry(name, module, dependencies);
  }

  activate(profiles) {
    if (!profiles) {
      profiles = [];
    }
    let resolved = new Set();
    let container = this;
    Object.keys(this.entries).forEach(function (name) {
      if (!resolved.has(name)) {
        resolve(container, profiles, name, resolved, new Set());
      }
    });
    resolved.forEach(function(name){
      construct(container, name);
    });
  }

  get(name) {
    return this.modules[name];
  }

  put(name, module) {
    this.modules[name] = module;
  }

  getModuleEntry(name, profiles) {
    let entry = this.entries[name];
    if (!profiles || validateProfiles(profiles, entry.profiles)) {
      return entry;
    }
    return null;
  }

}


function construct(container, name) {
  let entry = container.getModuleEntry(name);
  let dependencies = [];
  for(let i = 0; i < dependencies.length; i++) {
    dependencies.push(container.get(dependencies[i]));
  }
  container.put(name, entry.module.call(dependencies));
}

function validateProfiles(activeProfiles, targetProfiles) {
  if (!targetProfiles || targetProfiles.length < 1) {
    return true;
  }
  for (let i = 0; i < activeProfiles.length; i++) {
    if (targetProfiles.indexOf(activeProfiles[i]) > -1) {
      return true;
    }
  }
  return false;
}

module.exports = Container;