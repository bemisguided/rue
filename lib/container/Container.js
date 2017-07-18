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
import RueError from '../utils/RueError';
import PromiseHelper from '../utils/PromiseHelper';
import ProxyHelper from '../utils/ProxyHelper';

import type { InjectableEntryOptions } from './injectables/InjectableEntryOptions';

export default class Container {

  static get singleton(): Container {
    return singleton;
  }

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

  register(name: string, resolver: InjectableResolver, options: ?InjectableEntryOptions): void {
    this.injectableManager.addInjectableEntry(name, resolver, options ? options : {});
  }

  activate(...profiles: Array<string>): Promise<Map<string, any>> {
    // Ensure that this container is not already active
    if (this.dependencyProcessor.activeProfiles) {
      return PromiseHelper.wrapReject(new RueError('Container is already activated'));
    }
    this.dependencyProcessor.activeProfiles = profiles;

    // Retrieve all the injectable entries for the given set of active profiles
    let injectableEntries = this.injectableManager.getInjectableEntries(profiles);

    // Traverse the injectable entries and resolve the order to instantiate the injectable entires
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
    if (!injectableEntry.active) {
      return PromiseHelper.wrapReject(new RueError('Dependency is not activated: name=' + name));
    }
    return this.getDependencies(injectableEntry.name, injectableEntry.dependencyNames)
      .then((dependencies) => {
        // Necessary for the @flow compiler
        if (!injectableEntry) {
          throw RueError('Injectable is null or undefined should never happen here');
        }
        return this.activationProcessor.activate(injectableEntry, dependencies);
      });
  }

  getDependencies(context: string, names: Array<string>): Promise<Map<string, any>> {
    let promise = PromiseHelper.wrapResolved();
    let result = new Map();
    for (let i = 0; i < names.length; i++) {
      let name = names[i];
      promise = promise
        .then(() => {
          return this.getInstance(name, context);
        })
        .then((dependency) => {
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

  replaceInstance(name: string, replacement: any, context: ?string): void {
    let instance: any;

    // Context implies we are looking for the named dependency of
    if (context) {
      let injectableEntry = this.dependencyProcessor.resolve(context);
      if (!injectableEntry) {
        throw new RueError('Dependency is not found: name=' + context);
      }
      instance = injectableEntry.dependencies.get(name);
    } else {
      let injectableEntry = this.dependencyProcessor.resolve(name);

      if (!injectableEntry) {
        throw new RueError('Dependency is not found: name=' + name);
      }
      if (!injectableEntry.singleton) {
        throw new RueError('Dependency is not a singleton: name=' + name);
      }
      instance = injectableEntry.instance;
    }
    if (!instance) {
      throw new RueError('Dependency is not found: name=' + name);
    }
    if (!ProxyHelper.isProxy(instance)) {
      throw new RueError('Dependency is not replaceable: name=' + name);
    }
    if (!ProxyHelper.isProxyable(replacement)) {
      throw new RueError('Dependency replacement is not of a suitable type');
    }
    ProxyHelper.swapProxyTarget(instance, replacement);
  }

}

const singleton = new Container();
