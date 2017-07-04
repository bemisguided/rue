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
import ContainerEntry from '../../lib/container/ContainerEntry';
import ContainerEntryResolver from '../../lib/container/ContainerEntryResolver';

describe('./container/DependencyTraverser.js', () => {

  let containerEntries: Map<string, ContainerEntry>;
  let dependencyTraverser: DependencyTraverser;

  beforeEach(() => {
    containerEntries = new Map();
    dependencyTraverser = new DependencyTraverser(containerEntries);
  });

  describe('traverse()', function () {

    it('returns an ordered set of ContentEntries with no dependencies', () => {
      // Setup
      let name = 'test';
      let resolver = new ContainerEntryResolver('resolver');
      let dependencies = [];
      let containerEntry = new ContainerEntry(name, resolver, true, dependencies);
      containerEntries.set(name, containerEntry);

      // Execute
      let dependencyEntities = dependencyTraverser.traverse();

      // Assert
      let iterator = dependencyEntities.values();
      expect(iterator.next().value).toEqual(containerEntry);
    });

    it('returns an ordered set of ContentEntries with a single dependency', () => {
      // Setup
      let name1 = 'test1';
      let resolver1 = new ContainerEntryResolver('resolver');
      let name2 = 'test2';
      let resolver2 = new ContainerEntryResolver('resolver');
      let containerEntry1 = new ContainerEntry(name1, resolver1, true, [name2]);
      let containerEntry2 = new ContainerEntry(name2, resolver2, true, []);
      containerEntries.set(name1, containerEntry1);
      containerEntries.set(name2, containerEntry2);

      // Execute
      let dependencyEntities = dependencyTraverser.traverse();

      // Assert
      let iterator = dependencyEntities.values();
      expect(iterator.next().value).toEqual(containerEntry2);
      expect(iterator.next().value).toEqual(containerEntry1);
    });


    it('returns an ordered set of ContentEntries with multiple dependencies', () => {
      // Setup
      let name1 = 'test1';
      let resolver1 = new ContainerEntryResolver('resolver');
      let name2 = 'test2';
      let resolver2 = new ContainerEntryResolver('resolver');
      let name3 = 'test3';
      let resolver3 = new ContainerEntryResolver('resolver');
      let containerEntry1 = new ContainerEntry(name1, resolver1, true, [name2, name3]);
      let containerEntry2 = new ContainerEntry(name2, resolver2, true, []);
      let containerEntry3 = new ContainerEntry(name3, resolver3, true, []);
      containerEntries.set(name1, containerEntry1);
      containerEntries.set(name2, containerEntry2);
      containerEntries.set(name3, containerEntry3);

      // Execute
      let dependencyEntities = dependencyTraverser.traverse();

      // Assert
      let iterator = dependencyEntities.values();
      expect(iterator.next().value).toEqual(containerEntry2);
      expect(iterator.next().value).toEqual(containerEntry3);
      expect(iterator.next().value).toEqual(containerEntry1);
    });

    it('returns an ordered set of ContentEntries with multiple dependencies with dependencies', () => {
      // Setup
      let name1 = 'test1';
      let resolver1 = new ContainerEntryResolver('resolver');
      let name2 = 'test2';
      let resolver2 = new ContainerEntryResolver('resolver');
      let name3 = 'test3';
      let resolver3 = new ContainerEntryResolver('resolver');
      let containerEntry1 = new ContainerEntry(name1, resolver1, true, [name2, name3]);
      let containerEntry2 = new ContainerEntry(name2, resolver2, true, [name3]);
      let containerEntry3 = new ContainerEntry(name3, resolver3, true, []);
      containerEntries.set(name1, containerEntry1);
      containerEntries.set(name2, containerEntry2);
      containerEntries.set(name3, containerEntry3);

      // Execute
      let dependencyEntities = dependencyTraverser.traverse();

      // Assert
      let iterator = dependencyEntities.values();
      expect(iterator.next().value).toEqual(containerEntry3);
      expect(iterator.next().value).toEqual(containerEntry2);
      expect(iterator.next().value).toEqual(containerEntry1);
    });


    it('returns an ordered set of ContentEntries with separate dependency graphs', () => {
      // Setup
      let name1 = 'test1';
      let resolver1 = new ContainerEntryResolver('resolver');
      let name2 = 'test2';
      let resolver2 = new ContainerEntryResolver('resolver');
      let name3 = 'test3';
      let resolver3 = new ContainerEntryResolver('resolver');
      let name4 = 'test4';
      let resolver4 = new ContainerEntryResolver('resolver');
      let containerEntry1 = new ContainerEntry(name1, resolver1, true, [name2, name3]);
      let containerEntry2 = new ContainerEntry(name2, resolver2, true, []);
      let containerEntry3 = new ContainerEntry(name3, resolver3, true, []);
      let containerEntry4 = new ContainerEntry(name4, resolver4, true, [name3]);
      containerEntries.set(name1, containerEntry1);
      containerEntries.set(name2, containerEntry2);
      containerEntries.set(name3, containerEntry3);
      containerEntries.set(name4, containerEntry4);

      // Execute
      let dependencyEntities = dependencyTraverser.traverse();

      // Assert
      let iterator = dependencyEntities.values();
      expect(iterator.next().value).toEqual(containerEntry2);
      expect(iterator.next().value).toEqual(containerEntry3);
      expect(iterator.next().value).toEqual(containerEntry1);
      expect(iterator.next().value).toEqual(containerEntry4);
    });

    it('throws error when a dependency cannot be resolved', () => {
      // Setup
      let name1 = 'test1';
      let resolver1 = new ContainerEntryResolver('resolver');
      let name2 = 'test2';
      let resolver2 = new ContainerEntryResolver('resolver');
      let name3 = 'test3';
      let containerEntry1 = new ContainerEntry(name1, resolver1, true, [name2, name3]);
      let containerEntry2 = new ContainerEntry(name2, resolver2, true, [name3]);
      containerEntries.set(name1, containerEntry1);
      containerEntries.set(name2, containerEntry2);

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
      let resolver1 = new ContainerEntryResolver('resolver');
      let name2 = 'test2';
      let resolver2 = new ContainerEntryResolver('resolver');
      let containerEntry1 = new ContainerEntry(name1, resolver1, true, [name2]);
      let containerEntry2 = new ContainerEntry(name2, resolver2, true, [name1]);
      containerEntries.set(name1, containerEntry1);
      containerEntries.set(name2, containerEntry2);

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