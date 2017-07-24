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
import InjectableFilter from '../../lib/container/injectables/InjectableFilter';
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

class StubFactoryInjectableResolver extends InjectableResolver {

  factory: Function;

  dependencies: Array<any>;

  constructor(factory: Function) {
    super();
    this.factory = factory;
  }

  resolve(name: string, dependencies: Array<any>): Promise<any> {
    this.dependencies = dependencies;
    let result = Reflect.apply(this.factory, this, dependencies);
    return PromiseHelper.wrapResolved(result);
  }

}

class StubInjectableFilter extends InjectableFilter {

  name: string;

  dependencyName: string;

  instance: any;

  filter(name: string, dependencyName: string, instance: any): any {
    this.name = name;
    this.dependencyName = dependencyName;
    this.instance = instance;
    return instance;
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
          container.registerDependency(name, new StubInjectableResolver(expected), {singleton: true});

          // Activate
          container.activate()
            .then((injectables) => {
              let injectable = injectables.get(name);

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
          container.registerDependency(name1, stubInjectableResolver1, {dependencyNames: [name2], singleton: true});
          container.registerDependency(name2, stubInjectableResolver2, {singleton: true});

          // Activate
          container.activate()
            .then((injectables) => {
              let injectable = injectables.get(name1);

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
          container.registerDependency(name, new StubInjectableResolver(expected), {singleton: false});

          // Activate
          container.activate()
            .then(() => {
              // Retrieve a new created instance
              return container.getInstance(name);
            })
            .then((injectable) => {
              // Assert injectable
              expect(injectable).toEqual(expected);

              // Assert mapped dependencies
              let injectableEntry = container.injectableManager.injectableEntries[0];
              expect(injectableEntry.dependencies).toBeUndefined();
              done();
            })
            .catch((error) => {
              console.log(error.stack);
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
          container.registerDependency(name1, stubInjectableResolver1, {dependencyNames: [name2], singleton: false});
          container.registerDependency(name2, stubInjectableResolver2, {singleton: false});

          // Activate
          container.activate()
            .then(() => {
              // Retrieve a new created instance
              return container.getInstance(name1);
            })
            .then((injectable) => {
              // Assert injectable
              expect(injectable).toEqual(expected1);

              // Assert resolver dependencies
              expect(stubInjectableResolver1.dependencies).toEqual([expected2]);
              expect(stubInjectableResolver2.dependencies).toEqual([]);

              // Assert mapped dependencies
              let injectableEntry = container.injectableManager.injectableEntries[0];
              expect(injectableEntry.dependencies).toBeUndefined();
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
        container.registerDependency(name, new StubInjectableResolver(expected), {
          profileNames: [profile1],
          singleton: true,
        });

        // Activate
        container.activate(profile1)
          .then((injectables) => {
            let injectable = injectables.get(name);

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
        container.registerDependency(name1, stubInjectableResolver1, {
          dependencyNames: [name2],
          profileNames: [profile1],
          singleton: true,
        });
        container.registerDependency(name2, stubInjectableResolver2, {profileNames: [profile1], singleton: true});

        // Activate
        container.activate(profile1)
          .then((injectables) => {
            let injectable = injectables.get(name1);

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

    describe('with dependency notation', () => {

      it('activates injectable correctly with an option dependency using the ? notation then resolves the injectable', (done) => {
        // Setup
        let name1 = 'test1';
        let expected1 = {value: name1};
        let stubInjectableResolver1 = new StubInjectableResolver(expected1);
        let name2 = 'test2';
        let expected2 = {value: name2};
        let stubInjectableResolver2 = new StubInjectableResolver(expected2);

        // Register
        container.registerDependency(name1, stubInjectableResolver1, {
          dependencyNames: ['?fake', name2],
          singleton: true,
        });
        container.registerDependency(name2, stubInjectableResolver2, {singleton: true});

        // Activate
        container.activate()
          .then((injectables) => {
            let injectable = injectables.get(name1);

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

      it('activates injectable correctly with an option dependency using the + notation then resolves the injectable', (done) => {
        // Setup
        let name1 = 'test1';
        let expected1 = {value: name1};
        let stubInjectableResolver1 = new StubInjectableResolver(expected1);
        let name2 = 'test2';
        let expected2 = {value: name2};
        let stubInjectableResolver2 = new StubInjectableResolver(expected2);

        // Register
        container.registerDependency(name1, stubInjectableResolver1, {
          dependencyNames: ['+fake', name2],
          singleton: true,
        });
        container.registerDependency(name2, stubInjectableResolver2, {singleton: true});

        // Activate
        container.activate()
          .then((injectables) => {
            let injectable = injectables.get(name1);

            // Assert injectable
            expect(injectable).toEqual(expected1);

            // Assert resolver dependencies
            expect(stubInjectableResolver1.dependencies).toEqual([undefined, expected2]);
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

    describe('with filter', () => {

      it('', (done) => {
        // Setup
        let name = 'injectable';
        let dependencyName = 'dependency';
        let expected = {value: name};
        let filter = new StubInjectableFilter();

        // Register
        container.registerDependency(dependencyName, new StubInjectableResolver(expected), {filter: filter});
        container.registerDependency(name, new StubInjectableResolver(expected), {dependencyNames: [dependencyName]});

        // Activate
        container.activate()
          .then((injectables) => {
            let injectable = injectables.get(name);

            // Assert activated instance
            expect(injectable).toEqual(expected);

            // Assert mapped dependencies
            expect(filter.name).toEqual(name);
            expect(filter.dependencyName).toEqual(dependencyName);
            expect(filter.instance).toEqual(expected);
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
      container.registerDependency(name, new StubInjectableResolver(expected), {singleton: true});

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

    describe('replacing singleton dependencies', () => {

      it('correctly replaces a singleton instance via proxy', (done) => {
        // Setup
        let name = 'test';
        let expected1 = {value1: name};
        let expected2 = {value2: name};

        // Register
        container.registerDependency(name, new StubInjectableResolver(expected1), {singleton: true});

        // Activate
        container.activate()
          .then((injectables) => {
            let injectable = injectables.get(name);

            // Assert activated instance
            expect(injectable).toEqual(expected1);

            // Replace
            let oldInstance = container.replaceInstance(name, expected2);

            // Assert after replace
            expect(injectable).toEqual(expected2);
            expect(oldInstance).toEqual(expected1);
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
        container.registerDependency(name, new StubInjectableResolver(expected1), {singleton: true});

        // Activate
        container.activate()
          .then((injectables) => {
            let injectable = injectables.get(name);

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
        container.registerDependency(name, new StubInjectableResolver(expected1), {singleton: true});

        // Activate
        container.activate()
          .then((injectables) => {
            let injectable = injectables.get(name);

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
        container.registerDependency(name, new StubInjectableResolver(expected1), {singleton: false});

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
        container.registerDependency(name, new StubInjectableResolver(expected1), {
          profileNames: ['profile'],
          singleton: false,
        });

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

  describe('replacing non-singleton dependencies', () => {

    it('correctly replaces a non-singleton dependency of a singleton instance via proxy', (done) => {
      // Setup
      let name1 = 'test1';
      let name2 = 'test2';
      let singleton = (dependency) => {
        return {
          value: dependency,
        };
      };
      let expected1 = {value1: name1};
      let expected2 = {value2: name1};

      // Register
      container.registerDependency(name1, new StubFactoryInjectableResolver(singleton), {
        singleton: true,
        dependencyNames: [name2],
      });
      container.registerDependency(name2, new StubInjectableResolver(expected1), {singleton: false});

      // Activate
      container.activate()
        .then((dependencies) => {

          // Assert singleton instance dependency
          let instance = dependencies.get(name1);
          if (!instance) {
            throw new Error('no instance');
          }
          expect(instance.value).toEqual(expected1);

          // Replace
          let oldInstance = container.replaceInstance(name2, expected2, name1);

          // Assert after replace
          expect(instance.value).toEqual(expected2);
          expect(oldInstance).toEqual(expected1);
          done();
        })
        .catch((error) => {
          throw error;
        });

    });

    it('throws error when attempting to replace a dependency that does not exist', (done) => {
      // Setup
      let name1 = 'test1';
      let name2 = 'test2';
      let singleton = (dependency) => {
        return {
          value: dependency,
        };
      };
      let expected1 = {value1: name1};
      let expected2 = {value2: name1};

      // Register
      container.registerDependency(name1, new StubFactoryInjectableResolver(singleton), {
        singleton: true,
        dependencyNames: [name2],
      });
      container.registerDependency(name2, new StubInjectableResolver(expected1), {singleton: false});

      // Assert
      container.activate()
        .then(() => {
          // Replace
          container.replaceInstance('fake', expected2, name1);
        })
        .catch((error) => {
          expect(error.message).toEqual('Dependency is not found: name=fake');
          done();
        });

    });

    it('throws error when attempting to replace a dependency that does not exist', (done) => {
      // Setup
      let name1 = 'test1';
      let name2 = 'test2';
      let singleton = (dependency) => {
        return {
          value: dependency,
        };
      };
      let expected1 = {value1: name1};
      let expected2 = {value2: name1};

      // Register
      container.registerDependency(name1, new StubFactoryInjectableResolver(singleton), {
        singleton: true,
        dependencyNames: [name2],
      });
      container.registerDependency(name2, new StubInjectableResolver(expected1), {singleton: false});

      // Assert
      container.activate()
        .then(() => {
          // Replace
          container.replaceInstance(name1, expected2, 'fake');
        })
        .catch((error) => {
          expect(error.message).toEqual('Dependency is not found: name=fake');
          done();
        });

    });

  });

});
