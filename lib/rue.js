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
import Container from './container/Container';
import Builder from './container/Builder';
import InjectableResolver from './container/injectables/InjectableResolver';
import DependencyResolver from './container/dependencies/DependencyResolver';
import FactoryBuilder from './factory/FactoryBuilder';
import ServiceBuilder from './service/ServiceBuilder';

module.exports = {
  Container: Container,
  factory: FactoryBuilder.create,
  service: ServiceBuilder.create,
  Builder: Builder,
  DependencyResolver: DependencyResolver,
  InjectableResolver: InjectableResolver,
};
