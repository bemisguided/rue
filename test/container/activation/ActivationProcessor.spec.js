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

import ActivationProcessor from '../../../lib/container/activation/ActivationProcessor';
import InjectableEntry from '../../../lib/container/injectables/InjectableEntry';
import InjectableResolver from '../../../lib/container/injectables/InjectableResolver';
import PromiseHelper from '../../../lib/utils/PromiseHelper';

class StubInjectableResolver extends InjectableResolver {

  result: any;

  name: string;

  dependencies: Array<any>;

  constructor(result: any) {
    super();
    this.result = result;
  }

  resolve(name: string, dependencies: Array<any>): Promise<any> {
    this.name = name;
    this.dependencies = dependencies;
    return PromiseHelper.wrapResolved(this.result);
  }

}

describe('./container/activation/ActivationProcessor.js', () => {

  let activationProcessor: ActivationProcessor;

  beforeEach(() => {
    activationProcessor = new ActivationProcessor();
  });

  describe('ActivationProcessor.activate()', () => {

    it('activates an Object without any dependencies as a singleton that is Proxy wrapped', (done) => {
      // Setup
      let expected = {};
      let stubInjectableResolver = new StubInjectableResolver(expected);
      let name = 'test';
      let injectableEntry = new InjectableEntry(name, stubInjectableResolver);
      injectableEntry.singleton = true;
      injectableEntry.active = false;
      injectableEntry.lifecycle = {};

      // Execute
      let promise = activationProcessor.activate(injectableEntry, []);

      // Assert
      promise
        .then((injectable) => {
          expect(injectable).toEqual(expected);
          expect(injectable._$isProxy).toEqual(true);
          expect(stubInjectableResolver.name).toEqual(name);
          expect(stubInjectableResolver.dependencies).toEqual([]);
          expect(injectableEntry.active).toBeTruthy();
          expect(injectableEntry.instance).toEqual(expected);
          done();
        });

    });

    it('activates a Function without any dependencies as a singleton that is Proxy wrapped', (done) => {
      // Setup{
      let result = 'result';
      let fn = () => {
        return result;
      };
      let stubInjectableResolver = new StubInjectableResolver(fn);
      let name = 'test';
      let injectableEntry = new InjectableEntry(name, stubInjectableResolver);
      injectableEntry.singleton = true;
      injectableEntry.active = false;
      injectableEntry.lifecycle = {};

      // Execute
      let promise = activationProcessor.activate(injectableEntry, []);

      // Assert
      promise
        .then((injectable) => {
          expect(injectable()).toEqual(result);
          expect(injectable._$isProxy).toEqual(true);
          expect(stubInjectableResolver.name).toEqual(name);
          expect(stubInjectableResolver.dependencies).toEqual([]);
          expect(injectableEntry.active).toBeTruthy();
          expect(injectableEntry.instance()).toEqual(result);
          done();
        });

    });

    it('activates a string without any dependencies as a singleton that is not Proxy wrapped', (done) => {
      // Setup
      let expected = 'hello';
      let stubInjectableResolver = new StubInjectableResolver(expected);
      let name = 'test';
      let injectableEntry = new InjectableEntry(name, stubInjectableResolver);
      injectableEntry.singleton = true;
      injectableEntry.active = false;
      injectableEntry.lifecycle = {};

      // Execute
      let promise = activationProcessor.activate(injectableEntry, []);

      // Assert
      promise
        .then((injectable) => {
          expect(injectable).toEqual(expected);
          expect(injectable._$isProxy).toBeUndefined();
          expect(stubInjectableResolver.name).toEqual(name);
          expect(stubInjectableResolver.dependencies).toEqual([]);
          expect(injectableEntry.active).toBeTruthy();
          expect(injectableEntry.instance).toEqual(expected);
          done();
        });

    });

    it('activates an Object not as a singleton that is not Proxy wrapped', (done) => {
      // Setup
      let expected = {};
      let stubInjectableResolver = new StubInjectableResolver(expected);
      let name = 'test';
      let injectableEntry = new InjectableEntry(name, stubInjectableResolver);
      injectableEntry.singleton = false;
      injectableEntry.active = false;
      injectableEntry.lifecycle = {};

      // Execute
      let promise = activationProcessor.activate(injectableEntry, []);

      // Assert
      promise
        .then((injectable) => {
          expect(injectable).toEqual(expected);
          expect(injectable._$isProxy).toBeUndefined();
          expect(stubInjectableResolver.name).toEqual(name);
          expect(stubInjectableResolver.dependencies).toEqual([]);
          expect(injectableEntry.active).toBeTruthy();
          expect(injectableEntry.instance).toBeUndefined();
          done();
        });

    });

    it('activates an Object with dependencies as a singleton', (done) => {
      // Setup
      let expected = {};
      let stubInjectableResolver = new StubInjectableResolver(expected);
      let name = 'test';
      let injectableEntry = new InjectableEntry(name, stubInjectableResolver);
      injectableEntry.singleton = true;
      injectableEntry.active = false;
      injectableEntry.lifecycle = {};
      let dependencies = [{value: 'test'}];

      // Execute
      let promise = activationProcessor.activate(injectableEntry, dependencies);

      // Assert
      promise
        .then((injectable) => {
          expect(stubInjectableResolver.name).toEqual(name);
          expect(stubInjectableResolver.dependencies).toEqual(dependencies);
          done();
        });

    });

    it('returns the previous activated injectable when already activated', (done) => {
      // Setup
      let expected = {};
      let stubInjectableResolver = new StubInjectableResolver(expected);
      let name = 'test';
      let injectableEntry = new InjectableEntry(name, stubInjectableResolver);
      injectableEntry.singleton = true;
      injectableEntry.active = true;
      injectableEntry.instance = expected;
      injectableEntry.lifecycle = {};

      // Execute
      let promise = activationProcessor.activate(injectableEntry, []);

      // Assert
      promise
        .then((injectable) => {
          expect(injectable).toEqual(expected);
          done();
        });

    });

    it('re-activates an Object not as a singleton that is not Proxy wrapped when already activated', (done) => {
      // Setup
      let expected = {};
      let stubInjectableResolver = new StubInjectableResolver(expected);
      let name = 'test';
      let injectableEntry = new InjectableEntry(name, stubInjectableResolver);
      injectableEntry.singleton = false;
      injectableEntry.active = true;
      injectableEntry.lifecycle = {};

      // Execute
      let promise = activationProcessor.activate(injectableEntry, []);

      // Assert
      promise
        .then((injectable) => {
          expect(injectable).toEqual(expected);
          expect(injectable._$isProxy).toBeUndefined();
          expect(stubInjectableResolver.name).toEqual(name);
          expect(stubInjectableResolver.dependencies).toEqual([]);
          expect(injectableEntry.active).toBeTruthy();
          expect(injectableEntry.instance).toBeUndefined();
          done();
        });

    });

    it('activates an Object that is a singleton and calls the post-construct lifecycle method', (done) => {
      // Setup
      class Service {
        called: boolean;

        constructor() {
          this.called = false;
        }

        lifecyclePostConstruct() {
          this.called = true;
        }
      }
      let expected = new Service();
      let stubInjectableResolver = new StubInjectableResolver(expected);
      let name = 'test';
      let injectableEntry = new InjectableEntry(name, stubInjectableResolver);
      injectableEntry.singleton = true;
      injectableEntry.active = false;
      injectableEntry.lifecycle = {
        postConstruct: 'lifecyclePostConstruct',
      };

      // Execute
      let promise = activationProcessor.activate(injectableEntry, []);

      // Assert
      promise
        .then((injectable) => {
          expect(injectable.called).toEqual(true);
          done();
        });

    });

    it('activates an Object that is a non-singleton and calls the post-construct lifecycle method', (done) => {
      // Setup
      class Service {
        called: boolean;

        constructor() {
          this.called = false;
        }

        lifecyclePostConstruct() {
          this.called = true;
        }

      }
      let expected = new Service();
      let stubInjectableResolver = new StubInjectableResolver(expected);
      let name = 'test';
      let injectableEntry = new InjectableEntry(name, stubInjectableResolver);
      injectableEntry.singleton = false;
      injectableEntry.active = false;
      injectableEntry.lifecycle = {
        postConstruct: 'lifecyclePostConstruct',
      };

      // Execute
      let promise = activationProcessor.activate(injectableEntry, []);

      // Assert
      promise
        .then((injectable) => {
          expect(injectable).toEqual(expected);
          expect(injectable.called).toEqual(true);
          done();
        });

    });

    it('activates an Object calls the post-construct lifecycle method that returns a resolved Promise', (done) => {
      // Setup
      class Service {
        called: boolean;

        constructor() {
          this.called = false;
        }

        postConstruct() {
          return new Promise((resolve, reject) => {
            this.called = true;
            resolve();
          });
        }

      }
      let expected = new Service();
      let stubInjectableResolver = new StubInjectableResolver(expected);
      let name = 'test';
      let injectableEntry = new InjectableEntry(name, stubInjectableResolver);
      injectableEntry.singleton = true;
      injectableEntry.active = false;
      injectableEntry.lifecycle = {
        postConstruct: 'postConstruct',
      };

      // Execute
      let promise = activationProcessor.activate(injectableEntry, []);

      // Assert
      promise
        .then((injectable) => {
          expect(injectable.called).toEqual(true);
          done();
        });

    });

    it('activates an Object calls the post-construct lifecycle method that returns a rejected Promise', (done) => {
      // Setup
      let expected = 'error message';
      class Service {
        called: boolean;

        constructor() {
          this.called = false;
        }

        postConstruct() {
          return new Promise((resolve, reject) => {
            this.called = true;
            reject(expected);
          });
        }
      }
      let service = new Service();
      let stubInjectableResolver = new StubInjectableResolver(service);
      let name = 'test';
      let injectableEntry = new InjectableEntry(name, stubInjectableResolver);
      injectableEntry.singleton = true;
      injectableEntry.active = false;
      injectableEntry.lifecycle = {
        postConstruct: 'postConstruct',
      };

      // Execute
      let promise = activationProcessor.activate(injectableEntry, []);

      // Assert
      promise
        .then((injectable) => {
          expect(injectable.called).toEqual(true);
          done();
        })
        .catch((error) => {
          expect(error).toEqual(expected);
          done();
        });

    });

  });

});