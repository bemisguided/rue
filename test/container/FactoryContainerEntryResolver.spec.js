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
import { beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import FactoryContainerEntryResolver from '../../lib/container/FactoryContainerEntryResolver';
describe('./container/FactoryContainerEntryResolver.js', () => {

  it('resolves a factory method by forwarding dependencies', () => {
    // Setup
    let dependency = 'hello';
    let factory = (value) => {
      return {
        value: value,
      };
    };

    // Execute
    let resolver = new FactoryContainerEntryResolver(factory);
    let result = resolver.resolve(dependency);

    // Assert
    expect(result.value).to.equal(dependency);
  });

});