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
import ModuleInjectableResolver from '../../lib/module/ModuleInjectableResolver';
import PromiseHelper from '../../lib/utils/PromiseHelper';

describe('./module/ModuleInjectableResolver.js', () => {

  it('resolves a module via a lifecycle init when result is a Promise', (done) => {
    // Setup
    let dependency1 = 'hello';
    let dependency2 = 'there';
    let module: { value1?: any, value2?: any, init: Function, } = {
      init(value1, value2) {
        this.value1 = value1;
        this.value2 = value2;
        return new Promise((resolve) => {
          resolve();
        });
      },
    };

    // Execute
    let resolver = new ModuleInjectableResolver(module, {init: 'init'});
    resolver.resolve('test', [dependency1, dependency2])
      .then((result) => {
        // Assert
        expect(result.value1).toEqual(dependency1);
        expect(result.value2).toEqual(dependency2);
        done();
      })
      .catch((error) => {
        throw error;
      });
  });

  it('resolves a module via a lifecycle init when result is not a Promise', (done) => {
    // Setup
    let dependency1 = 'hello';
    let dependency2 = 'there';
    let module: { value1?: any, value2?: any, init: Function, } = {
      init(value1, value2) {
        this.value1 = value1;
        this.value2 = value2;
      },
    };

    // Execute
    let resolver = new ModuleInjectableResolver(module, {init: 'init'});
    resolver.resolve('test', [dependency1, dependency2])
      .then((result) => {
        // Assert
        expect(result.value1).toEqual(dependency1);
        expect(result.value2).toEqual(dependency2);
        done();
      })
      .catch((error) => {
        throw error;
      });
  });

  it('handles errors on execution of an init function when no a Promise', () => {
    // Setup
    let dependency1 = 'hello';
    let dependency2 = 'there';
    let error = new Error('error');
    let module = {
      init: () => {
        throw error;
      },
    };

    // Execute
    let resolver = new ModuleInjectableResolver(module, {init: 'init'});
    let promise = resolver.resolve('test', [dependency1, dependency2]);

    // Assert
    expect(promise).rejects.toEqual(error);
  });

  it('handles errors on execution of an init function when a Promise is rejected', () => {
    // Setup
    let dependency1 = 'hello';
    let dependency2 = 'there';
    let error = new Error('error');
    let module = {
      init: () => {
        return PromiseHelper.wrapReject(error);
      },
    };

    // Execute
    let resolver = new ModuleInjectableResolver(module, {init: 'init'});
    let promise = resolver.resolve('test', [dependency1, dependency2]);

    // Assert
    expect(promise).rejects.toEqual(error);
  });

  it('rejects when no init function present', (done) => {
    // Setup
    let dependency1 = 'hello';
    let dependency2 = 'there';
    let module = {};

    // Execute
    let resolver = new ModuleInjectableResolver(module, {init: 'init'});
    resolver.resolve('test', [dependency1, dependency2])
      .catch((error) => {
        expect(error.message).toEqual('Cannot initialize dependency as initializer function not found: name=test function=init');
        done();
      });
  });

  it('rejects when no init function configured', (done) => {
    // Setup
    let dependency1 = 'hello';
    let dependency2 = 'there';
    let module = {
      init: () => {

      },
    };

    // Execute
    let resolver = new ModuleInjectableResolver(module, {});
    resolver.resolve('test', [dependency1, dependency2])
      .catch((error) => {
        expect(error.message).toEqual('No defined initialization method for dependency: name=test');
        done();
      });
  });

});
