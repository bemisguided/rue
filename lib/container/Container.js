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

  register(name: string, resolver: InjectableResolver, dependencies: ?Array<string>, profiles: ?Array<string>, singleton: ?boolean): void {
    this.injectableManager.addInjectableEntry(name, resolver, dependencies, singleton, profiles);
  }

  activate(...profiles: Array<string>): Promise<any> {
    if (this.dependencyProcessor.activeProfiles) {
      return PromiseHelper.wrapReject(new RueError('Container is already activated'));
    }
    this.dependencyProcessor.activeProfiles = profiles;
    let injectableEntries = this.injectableManager.getInjectableEntries(profiles);
    let dependencyTraverser = new DependencyTraverser(this.dependencyProcessor);
    injectableEntries = dependencyTraverser.traverse(injectableEntries);
    let promise = PromiseHelper.wrapResolved();
    for (let injectableEntry of injectableEntries) {
      promise = promise
        .then(() => {
          return this.getDependencies(injectableEntry.name, injectableEntry.dependencyNames);
        })
        .then((dependencies) => {
          injectableEntry.dependencies = dependencies;
          return this.activationProcessor.activate(injectableEntry, [...dependencies.values()]);
        });
    }
    return promise
      .then(() => {
        return PromiseHelper.wrapResolved();
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
    return this.activationProcessor.activate(injectableEntry, [...injectableEntry.dependencies.values()]);
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
    let injectableEntry = this.dependencyProcessor.resolve(name);
    if (!injectableEntry) {
      throw new RueError('Dependency is not found: name=' + name);
    }
    if (!injectableEntry.singleton) {
      throw new RueError('Dependency is not a singleton: name=' + name);
    }
    let instance = injectableEntry.instance;
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
