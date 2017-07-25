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
import Container from './Container';
import InjectableFilter from './injectables/InjectableFilter';
import InjectableResolver from './injectables/InjectableResolver';
import RueError from '../utils/RueError';

import type { InjectableLifecycleConfig } from './injectables/InjectableLifecycleConfig';

export default class Builder {

  container: Container;

  dependencyNames: Array<string>;

  filter: ?InjectableFilter;

  lifecycle: InjectableLifecycleConfig;

  name: string;

  resolver: InjectableResolver;

  profileNames: Array<string>;

  singleton: boolean;

  constructor(name: string, container: Container) {
    this.container = container;
    this.name = name;
    this.lifecycle = {
      init: 'init',
      postInit: 'postInit',
      preDeinit: 'preDeinit',
      deinit: 'deinit',
    };
  }

  done(): void {
    if (!this.resolver) {
      throw new RueError('No module specified: name=' + this.name);
    }
    this.container.registerDependency(this.name, this.resolver, {
      dependencyNames: this.dependencyNames,
      lifecycle: this.lifecycle,
      profileNames: this.profileNames,
      singleton: this.singleton,
      filter: this.filter,
    });
  }

  isSingleton(singleton: boolean): Builder {
    this.singleton = singleton;
    return this;
  }

  lifecyclePostInit(name: string): Builder {
    this.lifecycle.postInit = name;
    return this;
  }

  withDependencies(...dependencyNames: Array<string>): Builder {
    this.dependencyNames = dependencyNames;
    return this;
  }

  withFilter(filter: InjectableFilter): Builder {
    this.filter = filter;
    return this;
  }

  withProfiles(...profiles: Array<string>): Builder {
    this.profileNames = profiles;
    return this;
  }

}
