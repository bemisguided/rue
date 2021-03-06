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
import FactoryInjectableResolver from '../../lib/factory/FactoryInjectableResolver';

describe('./factory/FactoryInjectableResolver.js', () => {

  it('resolves a factory method by forwarding dependencies when result is a Promise', () => {
    // Setup
    let dependency1 = 'hello';
    let dependency2 = 'there';
    let factory = (value1, value2) => {
      return new Promise((resolve) => {
        resolve({
          value1: value1,
          value2: value2,
        });
      });
    };

    // Execute
    let resolver = new FactoryInjectableResolver(factory);
    let promise = resolver.resolve('test', [dependency1, dependency2]);

    // Assert
    expect(promise).resolves.toEqual({ value1: dependency1, value2: dependency2 });
  });

  it('resolves a factory method by forwarding dependencies when result is not a Promise', () => {
    // Setup
    let dependency1 = 'hello';
    let dependency2 = 'there';
    let factory = (value1, value2) => {
      return {
        value1: value1,
        value2: value2,
      };
    };

    // Execute
    let resolver = new FactoryInjectableResolver(factory);
    let promise = resolver.resolve('test', [dependency1, dependency2]);

    // Assert
    expect(promise).resolves.toEqual({ value1: dependency1, value2: dependency2 });
  });

  it('handles errors on execution of a factory method', () => {
    // Setup
    let dependency = 'hello';
    let error = new Error(dependency);
    let factory = () => {
      throw error;
    };

    // Execute
    let resolver = new FactoryInjectableResolver(factory);
    let promise = resolver.resolve('test', [dependency]);

    // Assert
    expect(promise).rejects.toEqual(error);
  });

});
