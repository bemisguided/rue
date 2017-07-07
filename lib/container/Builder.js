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
import InjectableResolver from './injectables/InjectableResolver';
import RueError from '../utils/RueError';

export default class Builder {

  container: Container;

  name: string;

  resolver: InjectableResolver;

  profiles: ?Array<string>;

  dependencies: ?Array<string>;

  singleton: ?boolean;

  constructor(name: string, container: ?Container) {
    if (!container) {
      container = Container.singleton;
    }
    this.container = container;
    this.name = name;
  }

  build(): void {
    if (!this.resolver) {
      throw new RueError('No module specified: name=' + this.name);
    }
    this.container.register(this.name, this.resolver, this.dependencies, this.profiles, this.singleton);
  }

  isSingleton(singleton: boolean): Builder {
    this.singleton = singleton;
    return this;
  }

  withDependencies(...dependencies: Array<string>): Builder {
    this.dependencies = dependencies;
    return this;
  }

  withProfiles(...profiles: Array<string>): Builder {
    this.profiles = profiles;
    return this;
  }

}