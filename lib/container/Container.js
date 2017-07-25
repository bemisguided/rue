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
import ActivationProcessor from './activation/ActivationProcessor';
import DependencyProcessor from './dependencies/DependencyProcessor';
import DependencyResolver from './dependencies/DependencyResolver';
import DependencyTraverser from './dependencies/DependencyTraverser';
import StandardDependencyResolver from './dependencies/StandardDependencyResolver';
import InjectableManager from './injectables/InjectableManager';
import InjectableResolver from './injectables/InjectableResolver';
import DependencyNotationHelper from '../utils/DependencyNotationHelper';
import PromiseHelper from '../utils/PromiseHelper';
import ProxyHelper from '../utils/ProxyHelper';
import RueError from '../utils/RueError';

import type { InjectableEntryOptions } from './injectables/InjectableEntryOptions';
import InjectableEntry from './injectables/InjectableEntry';

export default class Container {

  activationProcessor: ActivationProcessor;

  dependencyProcessor: DependencyProcessor;

  dependencyResolvers: Array<DependencyResolver>;

  injectableManager: InjectableManager;

  constructor() {
    this.activationProcessor = new ActivationProcessor();
    this.injectableManager = new InjectableManager();
    this.dependencyResolvers = [new StandardDependencyResolver()];
    this.dependencyProcessor = new DependencyProcessor();
    this.dependencyProcessor.dependencyResolvers = this.dependencyResolvers;
    this.dependencyProcessor.injectableManager = this.injectableManager;
  }

  activate(...profileNames: Array<string>): Promise<Map<string, any>> {
    // Ensure that this container is not already active
    if (this.dependencyProcessor.activeProfiles) {
      return PromiseHelper.wrapReject(new RueError('Container is already activated'));
    }
    this.dependencyProcessor.activeProfiles = profileNames;

    // Retrieve all the injectable entries for the given set of active profile names
    let injectableEntries = this.injectableManager.getInjectableEntries(profileNames);

    // Traverse the injectable entries and resolve the order to instantiate the injectable entries
    let dependencyTraverser = new DependencyTraverser(this.dependencyProcessor);
    injectableEntries = dependencyTraverser.traverse(injectableEntries);

    // Iterate dependencies and activate them in order
    let promise = PromiseHelper.wrapResolved();
    let result = new Map();
    for (let injectableEntry of injectableEntries) {
      promise = promise
        .then(() => {
          // Resolve the dependencies for the injectable
          return this.getDependencies(injectableEntry.name, injectableEntry.dependencyNames);
        })
        .then((dependencies) => {
          // Activate the injectable
          return this.activationProcessor.activate(injectableEntry, dependencies);
        })
        .then((instance) => {
          // Assign the instance to the result if a singleton
          if (injectableEntry.singleton) {
            result.set(injectableEntry.name, instance);
          }
          return PromiseHelper.wrapResolved();
        });
    }
    return promise
      .then(() => {
        return PromiseHelper.wrapResolved(result);
      });
  }

  getInstance(name: string, context: ?string): Promise<any> {
    let injectableEntry = this.dependencyProcessor.resolve(name);
    if (!injectableEntry) {
      return PromiseHelper.wrapReject(new RueError('Dependency is not found: name=' + name));
    }
    return _activateInjectableEntry(this, injectableEntry);
  }

  getDependencies(context: string, names: Array<string>): Promise<Map<string, any>> {
    let promise = PromiseHelper.wrapResolved();
    let result = new Map();
    for (let i = 0; i < names.length; i++) {
      let name = names[i];

      // Handle dependency notation
      // (i.e. ? = optional & skip, + = optional replace with undefined)
      let optional = DependencyNotationHelper.isOptional(name);
      let skip = DependencyNotationHelper.isSkipOptional(name);
      name = DependencyNotationHelper.normalizeDependencyName(name);

      // Resolve the dependency injectable entry
      let injectableEntry = this.dependencyProcessor.resolve(name);
      if (!injectableEntry) {

        // When not optional throw an error
        if (!optional) {
          return PromiseHelper.wrapReject(new RueError('Dependency is not found: name=' + name));
        }

        // When skip then just passover
        if (skip) {
          continue;
        }

        // Append the undefined to the dependency map
        promise = promise
          .then(() => {
            result.set(name, undefined);
          });
        continue;
      }

      // Handle retrieval/activation of the dependency
      promise = promise
        .then(() => {
          // @flow workaround
          // istanbul ignore next
          if (!injectableEntry) {
            throw new RueError('Exception that should never happen');
          }
          return _activateInjectableEntry(this, injectableEntry);
        })
        .then((dependency) => {
          // @flow workaround
          // istanbul ignore next
          if (!injectableEntry) {
            throw new RueError('Exception that should never happen');
          }
          // Handle filter if present
          if (injectableEntry.filter) {
            dependency = injectableEntry.filter.filter(context, name, dependency);
          }
          // TODO not sure how this would be null/undefined now
          if (dependency) {
            result.set(name, dependency);
          }
        });
    }
    return promise
      .then(() => {
        return PromiseHelper.wrapResolved(result);
      });
  }

  registerDependency(name: string, resolver: InjectableResolver, options: ?InjectableEntryOptions): void {
    this.injectableManager.addInjectableEntry(name, resolver, options ? options : {});
  }

  replaceInstance(name: string, replacement: any, parent: ?string): any {
    let proxy: any;

    // Context implies we are looking for the named dependency of
    if (parent) {
      let injectableEntry = this.dependencyProcessor.resolve(parent);
      if (!injectableEntry) {
        throw new RueError('Dependency is not found: name=' + parent);
      }
      proxy = injectableEntry.dependencies.get(name);
    } else {
      let injectableEntry = this.dependencyProcessor.resolve(name);

      if (!injectableEntry) {
        throw new RueError('Dependency is not found: name=' + name);
      }
      if (!injectableEntry.singleton) {
        throw new RueError('Dependency is not a singleton: name=' + name);
      }
      proxy = injectableEntry.instance;
    }
    if (!proxy) {
      throw new RueError('Dependency is not found: name=' + name);
    }
    if (!ProxyHelper.isProxy(proxy)) {
      throw new RueError('Dependency is not replaceable: name=' + name);
    }
    if (!ProxyHelper.isProxyable(replacement)) {
      throw new RueError('Dependency replacement is not of a suitable type');
    }
    let instance = ProxyHelper.getProxyTarget(proxy);
    ProxyHelper.swapProxyTarget(proxy, replacement);
    return instance;
  }

}

function _activateInjectableEntry(container: Container, injectableEntry: InjectableEntry): Promise<any> {
  return container.getDependencies(injectableEntry.name, injectableEntry.dependencyNames)
    .then((dependencies) => {
      return container.activationProcessor.activate(injectableEntry, dependencies);
    });
}
