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
import Builder from '../container/builder/Builder';
import Container from '../container/Container';
import ServiceInjectableResolver from './ServiceInjectableResolver';

export default class ServiceBuilder extends Builder {

  constructor(container: Container, name: string) {
    super(container, name);
  }

  module(object: Object): Builder {
    this.resolver = new ServiceInjectableResolver(object);
    return this;
  }

}