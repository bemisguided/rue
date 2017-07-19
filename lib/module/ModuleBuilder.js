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
import Builder from '../container/Builder';
import Container from '../container/Container';
import ModuleInjectableResolver from './ModuleInjectableResolver';

export default class ModuleBuilder extends Builder {

  static create(name: string, container: ?Container): ModuleBuilder {
    return new ModuleBuilder(name, container);
  }

  constructor(name: string, container: ?Container) {
    super(name, container);
  }

  lifecycleInit(name: string): Builder {
    this.lifecycle.init = name;
    return this;
  }

  useModule(instance: any): Builder {
    this.resolver = new ModuleInjectableResolver(instance, this.lifecycle);
    return this;
  }

}