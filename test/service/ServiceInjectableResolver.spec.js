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
import ServiceInjectableResolver from '../../lib/service/ServiceInjectableResolver';

describe('./injectableManager/ServiceInjectableResolver.js', () => {

  it('resolves a service class by forwarding dependencies to a constructor', () => {
    // Setup
    let dependency1 = 'hello';
    let dependency2 = 'world';
    class Service {
      value1: any;
      value2: any;

      constructor(value1: any, value2: any) {
        this.value1 = value1;
        this.value2 = value2;
      }
    }

    // Execute
    let resolver = new ServiceInjectableResolver(Service);
    let promise = resolver.resolve('test', [dependency1, dependency2]);

    // Assert
    expect(promise).resolves.toEqual({ value1: dependency1, value2: dependency2 });
  });

  it('handles errors on construction of a service class', () => {
    // Setup
    let dependency = 'hello';
    class Service {
      value: any;

      constructor(value: any) {
        throw { value: value };
      }
    }

    // Execute
    let resolver = new ServiceInjectableResolver(Service);
    let promise = resolver.resolve('test', [dependency]);

    // Assert
    expect(promise).rejects.toEqual({ value: dependency });
  });

});