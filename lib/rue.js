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
 */
const Container = require('./container/Container').default;
const FactoryBuilder = require('./factory/FactoryBuilder').default;
const ServiceBuilder = require('./service/ServiceBuilder').default;

module.exports = new Container();

// Constructor to create new instances of rue
module.exports.Rue = Container;

module.exports.factory = (name, container) => {

  if (!container) {
    return new FactoryBuilder(module.exports, name);
  }

  return new FactoryBuilder(container, name);

};

module.exports.service = (name, container) => {

  if (!container) {
    return new ServiceBuilder(module.exports, name);
  }

  return new ServiceBuilder(container, name);

};