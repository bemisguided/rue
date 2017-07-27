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
import InjectableResolver from '../InjectableResolver';
import PreInjectionFilter from '../PreInjectionFilter';

import type { InjectableLifecycleConfig } from './InjectableLifecycleConfig';

export default class InjectableEntry {

  active: boolean;

  dependencies: Map<string, any>;

  dependencyNames: Array<string>;

  filter: ?PreInjectionFilter;

  instances: Array<any>;

  lifecycle: InjectableLifecycleConfig;

  name: string;

  resolver: InjectableResolver;

  profileNames: Array<string>;

  singleton: boolean;

  constructor(name: string, resolver: InjectableResolver) {
    this.name = name;
    this.resolver = resolver;
    this.active = false;
    this.instances = [];
  }

  get instance(): any {
    if (!this.singleton || !this.instances || this.instances.length < 1) {
      return undefined;
    }
    return this.instances[0];
  }

  set instance(instance: any) {
    this.instances[0] = instance;
  }

}
