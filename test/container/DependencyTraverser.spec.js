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

describe('./injectableManager/DependencyTraverser.js', () => {

  let injectableEntries: Map<string, InjectableEntry>;
  let dependencyTraverser: DependencyTraverser;

  beforeEach(() => {
    injectableEntries = new Map();
    dependencyTraverser = new DependencyTraverser(injectableEntries);
  });

  describe('traverse()', function () {

    it('returns an ordered set of ContentEntries with no dependencies', () => {
      // Setup
      let name = 'test';
      let resolver = new InjectableResolver('resolver');
      let dependencies = [];
      let injectableEntry = new InjectableEntry(name, resolver, true, dependencies);
      injectableEntries.set(name, injectableEntry);

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
      let injectableEntry1 = new InjectableEntry(name1, resolver1, true, [name2]);
      let injectableEntry2 = new InjectableEntry(name2, resolver2, true, []);
      injectableEntries.set(name1, injectableEntry1);
      injectableEntries.set(name2, injectableEntry2);

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
      let injectableEntry1 = new InjectableEntry(name1, resolver1, true, [name2, name3]);
      let injectableEntry2 = new InjectableEntry(name2, resolver2, true, []);
      let injectableEntry3 = new InjectableEntry(name3, resolver3, true, []);
      injectableEntries.set(name1, injectableEntry1);
      injectableEntries.set(name2, injectableEntry2);
      injectableEntries.set(name3, injectableEntry3);

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
      let injectableEntry1 = new InjectableEntry(name1, resolver1, true, [name2, name3]);
      let injectableEntry2 = new InjectableEntry(name2, resolver2, true, [name3]);
      let injectableEntry3 = new InjectableEntry(name3, resolver3, true, []);
      injectableEntries.set(name1, injectableEntry1);
      injectableEntries.set(name2, injectableEntry2);
      injectableEntries.set(name3, injectableEntry3);

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
      let injectableEntry1 = new InjectableEntry(name1, resolver1, true, [name2, name3]);
      let injectableEntry2 = new InjectableEntry(name2, resolver2, true, []);
      let injectableEntry3 = new InjectableEntry(name3, resolver3, true, []);
      let injectableEntry4 = new InjectableEntry(name4, resolver4, true, [name3]);
      injectableEntries.set(name1, injectableEntry1);
      injectableEntries.set(name2, injectableEntry2);
      injectableEntries.set(name3, injectableEntry3);
      injectableEntries.set(name4, injectableEntry4);

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
      let injectableEntry1 = new InjectableEntry(name1, resolver1, true, [name2, name3]);
      let injectableEntry2 = new InjectableEntry(name2, resolver2, true, [name3]);
      injectableEntries.set(name1, injectableEntry1);
      injectableEntries.set(name2, injectableEntry2);

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
      let injectableEntry1 = new InjectableEntry(name1, resolver1, true, [name2]);
      let injectableEntry2 = new InjectableEntry(name2, resolver2, true, [name1]);
      injectableEntries.set(name1, injectableEntry1);
      injectableEntries.set(name2, injectableEntry2);

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