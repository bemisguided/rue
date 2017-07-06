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
import DependencyTraverser from '../../lib/container/DependencyTraverser';
import InjectableEntry from '../../lib/container/InjectableEntry';
import InjectableResolver from '../../lib/container/injectables/InjectableResolver';
import InjectableManager from '../../lib/container/InjectableManager';
import StandardDependencyResolver from '../../lib/container/dependencies/StandardDependencyResolver';

describe('./injectableManager/DependencyTraverser.js', () => {

  let injectableManager: InjectableManager;
  let dependencyTraverser: DependencyTraverser;

  beforeEach(() => {
    injectableManager = new InjectableManager();
    dependencyTraverser = new DependencyTraverser();
    dependencyTraverser.injectableManager = injectableManager;
    dependencyTraverser.activeProfiles = [];
    dependencyTraverser.dependencyResolvers = [new StandardDependencyResolver()];
  });

  describe('traverse()', function () {

    it('returns an ordered set of ContentEntries with no dependencies', () => {
      // Setup
      let name = 'test';
      let resolver = new InjectableResolver('resolver');
      let dependencies = [];
      let injectableEntry = new InjectableEntry(name, resolver);
      injectableEntry.dependencies = dependencies;
      injectableEntry.profiles = [''];
      injectableManager.injectableEntries.push(injectableEntry);

      // Execute
      let dependencyEntities = dependencyTraverser.traverse();

      // Assert
      let iterator = dependencyEntities.values();
      expect(iterator.next().value).toEqual(injectableEntry);
    });

    it('returns an ordered set of ContentEntries with a single dependency', () => {
      // Setup
      let name1 = 'test1';
      let resolver1 = new InjectableResolver('resolver');
      let name2 = 'test2';
      let resolver2 = new InjectableResolver('resolver');
      let injectableEntry1 = new InjectableEntry(name1, resolver1);
      injectableEntry1.dependencies = [name2];
      injectableEntry1.profiles = [''];
      let injectableEntry2 = new InjectableEntry(name2, resolver2);
      injectableEntry2.dependencies = [];
      injectableEntry2.profiles = [''];
      injectableManager.injectableEntries.push(injectableEntry1);
      injectableManager.injectableEntries.push(injectableEntry2);

      // Execute
      let dependencyEntities = dependencyTraverser.traverse();

      // Assert
      let iterator = dependencyEntities.values();
      expect(iterator.next().value).toEqual(injectableEntry2);
      expect(iterator.next().value).toEqual(injectableEntry1);
    });


    it('returns an ordered set of ContentEntries with multiple dependencies', () => {
      // Setup
      let name1 = 'test1';
      let resolver1 = new InjectableResolver('resolver');
      let name2 = 'test2';
      let resolver2 = new InjectableResolver('resolver');
      let name3 = 'test3';
      let resolver3 = new InjectableResolver('resolver');
      let injectableEntry1 = new InjectableEntry(name1, resolver1);
      injectableEntry1.dependencies = [name2, name3];
      injectableEntry1.profiles = [''];
      let injectableEntry2 = new InjectableEntry(name2, resolver2);
      injectableEntry2.dependencies = [];
      injectableEntry2.profiles = [''];
      let injectableEntry3 = new InjectableEntry(name3, resolver3);
      injectableEntry3.dependencies = [];
      injectableEntry3.profiles = [''];
      injectableManager.injectableEntries.push(injectableEntry1);
      injectableManager.injectableEntries.push(injectableEntry2);
      injectableManager.injectableEntries.push(injectableEntry3);

      // Execute
      let dependencyEntities = dependencyTraverser.traverse();

      // Assert
      let iterator = dependencyEntities.values();
      expect(iterator.next().value).toEqual(injectableEntry2);
      expect(iterator.next().value).toEqual(injectableEntry3);
      expect(iterator.next().value).toEqual(injectableEntry1);
    });

    it('returns an ordered set of ContentEntries with multiple dependencies with dependencies', () => {
      // Setup
      let name1 = 'test1';
      let resolver1 = new InjectableResolver('resolver');
      let name2 = 'test2';
      let resolver2 = new InjectableResolver('resolver');
      let name3 = 'test3';
      let resolver3 = new InjectableResolver('resolver');
      let injectableEntry1 = new InjectableEntry(name1, resolver1);
      injectableEntry1.dependencies = [name2, name3];
      injectableEntry1.profiles = [''];
      let injectableEntry2 = new InjectableEntry(name2, resolver2);
      injectableEntry2.dependencies = [name3];
      injectableEntry2.profiles = [''];
      let injectableEntry3 = new InjectableEntry(name3, resolver3);
      injectableEntry3.dependencies = [];
      injectableEntry3.profiles = [''];
      injectableManager.injectableEntries.push(injectableEntry1);
      injectableManager.injectableEntries.push(injectableEntry2);
      injectableManager.injectableEntries.push(injectableEntry3);

      // Execute
      let dependencyEntities = dependencyTraverser.traverse();

      // Assert
      let iterator = dependencyEntities.values();
      expect(iterator.next().value).toEqual(injectableEntry3);
      expect(iterator.next().value).toEqual(injectableEntry2);
      expect(iterator.next().value).toEqual(injectableEntry1);
    });


    it('returns an ordered set of ContentEntries with separate dependency graphs', () => {
      // Setup
      let name1 = 'test1';
      let resolver1 = new InjectableResolver('resolver');
      let name2 = 'test2';
      let resolver2 = new InjectableResolver('resolver');
      let name3 = 'test3';
      let resolver3 = new InjectableResolver('resolver');
      let name4 = 'test4';
      let resolver4 = new InjectableResolver('resolver');
      let injectableEntry1 = new InjectableEntry(name1, resolver1);
      injectableEntry1.dependencies = [name2, name3];
      injectableEntry1.profiles = [''];
      let injectableEntry2 = new InjectableEntry(name2, resolver2);
      injectableEntry2.dependencies = [];
      injectableEntry2.profiles = [''];
      let injectableEntry3 = new InjectableEntry(name3, resolver3);
      injectableEntry3.dependencies = [];
      injectableEntry3.profiles = [''];
      let injectableEntry4 = new InjectableEntry(name4, resolver4);
      injectableEntry4.dependencies = [name3];
      injectableEntry4.profiles = [''];
      injectableManager.injectableEntries.push(injectableEntry1);
      injectableManager.injectableEntries.push(injectableEntry2);
      injectableManager.injectableEntries.push(injectableEntry3);
      injectableManager.injectableEntries.push(injectableEntry4);

      // Execute
      let dependencyEntities = dependencyTraverser.traverse();

      // Assert
      let iterator = dependencyEntities.values();
      expect(iterator.next().value).toEqual(injectableEntry2);
      expect(iterator.next().value).toEqual(injectableEntry3);
      expect(iterator.next().value).toEqual(injectableEntry1);
      expect(iterator.next().value).toEqual(injectableEntry4);
    });

    it('throws error when a dependency cannot be resolved', () => {
      // Setup
      let name1 = 'test1';
      let resolver1 = new InjectableResolver('resolver');
      let name2 = 'test2';
      let resolver2 = new InjectableResolver('resolver');
      let name3 = 'test3';
      let injectableEntry1 = new InjectableEntry(name1, resolver1);
      injectableEntry1.dependencies = [name2, name3];
      injectableEntry1.profiles = [''];
      let injectableEntry2 = new InjectableEntry(name2, resolver2);
      injectableEntry2.dependencies = [name3];
      injectableEntry2.profiles = [''];
      injectableManager.injectableEntries.push(injectableEntry1);
      injectableManager.injectableEntries.push(injectableEntry2);

      // Assert
      try {
        dependencyTraverser.traverse();
      }
      catch (e) {
        expect(e.message).toEqual('Dependency not available: name=test3');
      }
    });

    it('throws error when there is a circular dependency', function () {
      // Setup
      let name1 = 'test1';
      let resolver1 = new InjectableResolver('resolver');
      let name2 = 'test2';
      let resolver2 = new InjectableResolver('resolver');
      let injectableEntry1 = new InjectableEntry(name1, resolver1);
      injectableEntry1.dependencies = [name2];
      injectableEntry1.profiles = [''];
      let injectableEntry2 = new InjectableEntry(name2, resolver2);
      injectableEntry2.dependencies = [name1];
      injectableEntry2.profiles = [''];
      injectableManager.injectableEntries.push(injectableEntry1);
      injectableManager.injectableEntries.push(injectableEntry2);

      // Assert
      try {
        dependencyTraverser.traverse();
      }
      catch (e) {
        expect(e.message).toEqual('Circular dependency found: name=test2 dependency=test1');
      }
    });

  });

});