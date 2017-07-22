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
import Builder from './container/Builder';
import Container from './container/Container';
import DependencyContext from './container/dependencies/DependencyContext';
import DependencyResolver from './container/dependencies/DependencyResolver';
import Environment from './utils/Environment';
import FactoryBuilder from './factory/FactoryBuilder';
import InjectableEntry from './container/injectables/InjectableEntry';
import InjectableFilter from './container/injectables/InjectableFilter';
import InjectableResolver from './container/injectables/InjectableResolver';
import ModuleBuilder from './module/ModuleBuilder';
import ServiceBuilder from './service/ServiceBuilder';
import TestContainer from './test/TestContainer';

const singleton = new Container();

module.exports = {
  // Properties
  environment: Environment,
  singleton: singleton,
  test: new TestContainer(singleton),

  // Methods
  activate: (...profileNames: Array<string>) => {
    return singleton.activate(...profileNames);
  },
  factory: (name: string, container: ?Container) => {
    return new FactoryBuilder(name, container? container : singleton);
  },
  module: (name: string, container: ?Container) => {
    return new ModuleBuilder(name, container? container : singleton);
  },
  service: (name: string, container: ?Container) => {
    return new ServiceBuilder(name, container? container : singleton);
  },

  // Classes
  Builder: Builder,
  Container: Container,
  DependencyResolver: DependencyResolver,
  DependencyContext: DependencyContext,
  InjectableFilter: InjectableFilter,
  InjectableEntry: InjectableEntry,
  InjectableResolver: InjectableResolver,
  TestContainer: TestContainer,
};
