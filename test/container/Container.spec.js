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
import Container from '../../lib/container/Container';
import InjectableResolver from '../../lib/container/injectables/InjectableResolver';
import PromiseHelper from '../../lib/utils/PromiseHelper';

class StubInjectableResolver extends InjectableResolver {

  result: any;

  dependencies: Array<any>;

  constructor(result: any) {
    super();
    this.result = result;
  }

  resolve(name: string, dependencies: Array<any>): Promise<any> {
    this.dependencies = dependencies;
    return PromiseHelper.wrapResolved(this.result);
  }

}

describe('./container/Container.js', () => {

  let container: Container;

  beforeEach(() => {
    container = new Container();
  });

  describe('Container.activate()', () => {

    describe('without profiles', () => {

      describe('with singletons', () => {

        it('activates injectable correctly with no dependencies then resolves the injectable', (done) => {
          // Setup
          let name = 'test';
          let expected = {value: name};

          // Register
          container.register(name, new StubInjectableResolver(expected), [], [], true);

          // Activate
          let promise = container.activate()
            .then(() => {

              // Retrieve the instance
              return container.getInstance(name);
            });

          // Assert
          promise
            .then((injectable) => {
              // Assert activated instance
              expect(injectable).toEqual(expected);

              // Assert mapped dependencies
              let injectableEntry = container.injectableManager.injectableEntries[0];
              expect(injectableEntry.dependencies.size).toEqual(0);
              done();
            })
            .catch((error) => {
              throw error;
            });

        });

        it('activates injectable correctly with a dependency then resolves the injectable', (done) => {
          // Setup
          let name1 = 'test1';
          let expected1 = {value: name1};
          let stubInjectableResolver1 = new StubInjectableResolver(expected1);
          let name2 = 'test2';
          let expected2 = {value: name2};
          let stubInjectableResolver2 = new StubInjectableResolver(expected2);

          // Register
          container.register(name1, stubInjectableResolver1, [name2], [], true);
          container.register(name2, stubInjectableResolver2, [], [], true);

          // Activate
          let promise = container.activate()
            .then(() => {

              // Retrieve the instance
              return container.getInstance(name1);
            });

          // Assert
          promise
            .then((injectable) => {
              // Assert injectable
              expect(injectable).toEqual(expected1);

              // Assert resolver dependencies
              expect(stubInjectableResolver1.dependencies).toEqual([expected2]);
              expect(stubInjectableResolver2.dependencies).toEqual([]);

              // Assert mapped dependencies
              let injectableEntry = container.injectableManager.injectableEntries[0];
              expect(injectableEntry.dependencies.get(name2)).toEqual(expected2);
              done();
            })
            .catch((error) => {
              throw error;
            });

        });

      });

      describe('with non-singleton', () => {

        it('activates injectable correctly with no dependencies then resolves the injectable', (done) => {
          // Setup
          let name = 'test';
          let expected = {value: name};

          // Register
          container.register(name, new StubInjectableResolver(expected), [], [], false);

          // Activate
          let promise = container.activate()
            .then(() => {

              // Retrieve the instance
              return container.getInstance(name);
            });

          // Assert
          promise
            .then((injectable) => {
              // Assert injectable
              expect(injectable).toEqual(expected);

              // Assert mapped dependencies
              let injectableEntry = container.injectableManager.injectableEntries[0];
              expect(injectableEntry.dependencies.size).toEqual(0);
              done();
            })
            .catch((error) => {
              throw error;
            });

        });

        it('activates non-singleton injectable correctly with a dependency then resolves the injectable', (done) => {
          // Setup
          let name1 = 'test1';
          let expected1 = {value: name1};
          let stubInjectableResolver1 = new StubInjectableResolver(expected1);
          let name2 = 'test2';
          let expected2 = {value: name2};
          let stubInjectableResolver2 = new StubInjectableResolver(expected2);

          // Register
          container.register(name1, stubInjectableResolver1, [name2], [], false);
          container.register(name2, stubInjectableResolver2, [], [], false);

          // Activate
          let promise = container.activate()
            .then(() => {

              // Retrieve the instance
              return container.getInstance(name1);
            });

          // Assert
          promise
            .then((injectable) => {
              // Assert injectable
              expect(injectable).toEqual(expected1);

              // Assert resolver dependencies
              expect(stubInjectableResolver1.dependencies).toEqual([expected2]);
              expect(stubInjectableResolver2.dependencies).toEqual([]);

              // Assert mapped dependencies
              let injectableEntry = container.injectableManager.injectableEntries[0];
              expect(injectableEntry.dependencies.get(name2)).toEqual(expected2);
              done();
            })
            .catch((error) => {
              throw error;
            });

        });
      });

    });

    describe('with profiles', () => {

      it('activates injectable correctly with no dependencies and active profile then resolves the injectable', (done) => {
        // Setup
        let name = 'test';
        let expected = {value: name};
        let profile1 = 'profile1';

        // Register
        container.register(name, new StubInjectableResolver(expected), [], [profile1], true);

        // Activate
        let promise = container.activate(profile1)
          .then(() => {

            // Retrieve the instance
            return container.getInstance(name);
          });

        // Assert
        promise
          .then((injectable) => {
            // Assert injectable
            expect(injectable).toEqual(expected);

            // Assert mapped dependencies
            let injectableEntry = container.injectableManager.injectableEntries[0];
            expect(injectableEntry.dependencies.size).toEqual(0);
            done();
          })
          .catch((error) => {
            throw error;
          });

      });

      it('activates injectable correctly with a dependency then resolves the injectable', (done) => {
        // Setup
        let name1 = 'test1';
        let expected1 = {value: name1};
        let stubInjectableResolver1 = new StubInjectableResolver(expected1);
        let name2 = 'test2';
        let expected2 = {value: name2};
        let stubInjectableResolver2 = new StubInjectableResolver(expected2);
        let profile1 = 'profile1';

        // Register
        container.register(name1, stubInjectableResolver1, [name2], [profile1], true);
        container.register(name2, stubInjectableResolver2, [], [profile1], true);

        // Activate
        let promise = container.activate(profile1)
          .then(() => {

            // Retrieve the instance
            return container.getInstance(name1);
          });

        // Assert
        promise
          .then((injectable) => {
            // Assert injectable
            expect(injectable).toEqual(expected1);

            // Assert resolver dependencies
            expect(stubInjectableResolver1.dependencies).toEqual([expected2]);
            expect(stubInjectableResolver2.dependencies).toEqual([]);

            // Assert mapped dependencies
            let injectableEntry = container.injectableManager.injectableEntries[0];
            expect(injectableEntry.dependencies.get(name2)).toEqual(expected2);
            done();
          })
          .catch((error) => {
            throw error;
          });

      });

    });

  });

  describe('Container.getInstance()', () => {

    it('throws error when a dependency is not found', (done) => {
      // Setup
      let name = 'test';
      let expected = {value: name};

      // Register
      container.register(name, new StubInjectableResolver(expected), [], [], true);

      // Activate
      let promise = container.activate()
        .then(() => {
          // Retrieve the instance
          return container.getInstance('fake');
        });

      // Assert
      promise
        .catch((error) => {
          expect(error.message).toEqual('Dependency is not found: name=fake');
          done();
        });

    });

  });

  describe('Container.replaceInstance()', () => {

    it('correctly replaces a singleton instance via proxy', (done) => {
      // Setup
      let name = 'test';
      let expected1 = {value1: name};
      let expected2 = {value2: name};

      // Register
      container.register(name, new StubInjectableResolver(expected1), [], [], true);

      // Activate
      let promise = container.activate()
        .then(() => {

          // Retrieve the instance
          return container.getInstance(name);
        });

      // Assert
      promise
        .then((injectable) => {
          // Assert activated instance
          expect(injectable).toEqual(expected1);

          // Replace
          container.replaceInstance(name, expected2);

          // Assert after replace
          expect(injectable).toEqual(expected2);
          done();
        })
        .catch((error) => {
          throw error;
        });

    });

    it('throws error when attempting to replace a dependency that is not a proxy', (done) => {
      // Setup
      let name = 'test';
      let expected1 = 'scalar';
      let expected2 = {value1: name};

      // Register
      container.register(name, new StubInjectableResolver(expected1), [], [], true);

      // Activate
      let promise = container.activate()
        .then(() => {

          // Retrieve the instance
          return container.getInstance(name);
        });

      // Assert
      promise
        .then((injectable) => {
          // Assert activated instance
          expect(injectable).toEqual(expected1);

          // Replace
          container.replaceInstance(name, expected2);
        })
        .catch((error) => {
          expect(error.message).toEqual('Dependency is not replaceable: name=test');
          done();
        });

    });

    it('throws error when attempting to replace a value that is not proxyable (i.e. not an Object or Function)', (done) => {
      // Setup
      let name = 'test';
      let expected1 = {value1: name};
      let expected2 = 'scalar';

      // Register
      container.register(name, new StubInjectableResolver(expected1), [], [], true);

      // Activate
      let promise = container.activate()
        .then(() => {

          // Retrieve the instance
          return container.getInstance(name);
        });

      // Assert
      promise
        .then((injectable) => {
          // Assert activated instance
          expect(injectable).toEqual(expected1);

          // Replace
          container.replaceInstance(name, expected2);
        })
        .catch((error) => {
          expect(error.message).toEqual('Dependency replacement is not of a suitable type');
          done();
        });

    });

    it('throws error when attempting to replace a non-singleton dependency', (done) => {
      // Setup
      let name = 'test';
      let expected1 = {value1: name};
      let expected2 = {value2: name};

      // Register
      container.register(name, new StubInjectableResolver(expected1), [], [], false);

      // Execute
      container.activate()
        .then(() => {

          // Replace
          container.replaceInstance(name, expected2);
        })
        .catch((error) => {
          expect(error.message).toEqual('Dependency is not a singleton: name=test');
          done();
        });

    });

    it('throws error when attempting to replace a non-active dependency', (done) => {
      // Setup
      let name = 'test';
      let expected1 = {value1: name};
      let expected2 = {value2: name};

      // Register
      container.register(name, new StubInjectableResolver(expected1), [], ['profile'], false);

      // Execute
      container.activate()
        .then(() => {

          // Replace
          container.replaceInstance(name, expected2);
        })
        .catch((error) => {
          expect(error.message).toEqual('Dependency is not found: name=test');
          done();
        });

    });

    it('throws error when attempting to replace a dependency that does not exist', (done) => {
      // Setup
      let name = 'test';
      let expected = {value1: name};

      // Assert
      container.activate()
        .then(() => {
          // Replace
          container.replaceInstance('fake', expected);
        })
        .catch((error) => {
          expect(error.message).toEqual('Dependency is not found: name=fake');
          done();
        });

    });

  });

});
