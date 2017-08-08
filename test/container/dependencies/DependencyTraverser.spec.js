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
import DependencyTraverser from '../../../lib/container/dependencies/DependencyTraverser';
import DependencyLocator from '../../../lib/container/dependencies/DependencyLocator';
import InjectableEntry from '../../../lib/container/injectables/InjectableEntry';
import InjectableManager from '../../../lib/container/injectables/InjectableManager';
import StubInjectableResolver from '../../helper/StubInjectableResolver';

class StubDependencyLocator extends DependencyLocator {

  results: Map<string, InjectableEntry>;

  constructor(results: Map<string, InjectableEntry>) {
    super(new InjectableManager(), []);
    this.results = results;
  }

  resolve(name: string): ?InjectableEntry {
    return this.results.get(name);
  }

}

describe('./container/dependencies/DependencyTraverser.js', () => {

  let injectableEntryMap: Map<string, InjectableEntry>;
  let dependencyLocator: StubDependencyLocator;
  let dependencyTraverser: DependencyTraverser;

  beforeEach(() => {
    injectableEntryMap = new Map();
    dependencyLocator = new StubDependencyLocator(injectableEntryMap);
    dependencyTraverser = new DependencyTraverser(dependencyLocator);
  });

  describe('traverse()', () => {

    it('returns an ordered set of ContentEntries with no dependencies', () => {
      // Setup
      let name = 'test';
      let resolver = new StubInjectableResolver('resolver');
      let dependencies = [];
      let injectableEntry = new InjectableEntry(name, resolver);
      injectableEntry.dependencyNames = dependencies;
      injectableEntryMap.set(name, injectableEntry);

      // Execute
      let dependencyEntities = dependencyTraverser.traverse(new Set(injectableEntryMap.values()));

      // Assert
      let iterator = dependencyEntities.values();
      expect(iterator.next().value).toEqual(injectableEntry);
    });

    it('returns an ordered set of ContentEntries with a single dependency', () => {
      // Setup
      let name1 = 'test1';
      let name2 = 'test2';
      let resolver1 = new StubInjectableResolver('resolver');
      let injectableEntry1 = new InjectableEntry(name1, resolver1);
      injectableEntry1.dependencyNames = [name2];
      injectableEntryMap.set(name1, injectableEntry1);

      let resolver2 = new StubInjectableResolver('resolver');
      let injectableEntry2 = new InjectableEntry(name2, resolver2);
      injectableEntry2.dependencyNames = [];
      injectableEntryMap.set(name2, injectableEntry2);

      // Execute
      let dependencyEntities = dependencyTraverser.traverse(new Set(injectableEntryMap.values()));

      // Assert
      let iterator = dependencyEntities.values();
      expect(iterator.next().value).toEqual(injectableEntry2);
      expect(iterator.next().value).toEqual(injectableEntry1);
    });


    it('returns an ordered set of ContentEntries with multiple dependencies', () => {
      // Setup
      let name1 = 'test1';
      let name2 = 'test2';
      let name3 = 'test3';

      let resolver1 = new StubInjectableResolver('resolver');
      let injectableEntry1 = new InjectableEntry(name1, resolver1);
      injectableEntry1.dependencyNames = [name2, name3];
      injectableEntryMap.set(name1, injectableEntry1);

      let resolver2 = new StubInjectableResolver('resolver');
      let injectableEntry2 = new InjectableEntry(name2, resolver2);
      injectableEntry2.dependencyNames = [];
      injectableEntryMap.set(name2, injectableEntry2);

      let resolver3 = new StubInjectableResolver('resolver');
      let injectableEntry3 = new InjectableEntry(name3, resolver3);
      injectableEntry3.dependencyNames = [];
      injectableEntryMap.set(name3, injectableEntry3);

      // Execute
      let dependencyEntities = dependencyTraverser.traverse(new Set(injectableEntryMap.values()));

      // Assert
      let iterator = dependencyEntities.values();
      expect(iterator.next().value).toEqual(injectableEntry2);
      expect(iterator.next().value).toEqual(injectableEntry3);
      expect(iterator.next().value).toEqual(injectableEntry1);
    });

    it('returns an ordered set of ContentEntries with multiple dependencies with dependencies', () => {
      // Setup
      let name1 = 'test1';
      let name2 = 'test2';
      let name3 = 'test3';
      let resolver1 = new StubInjectableResolver('resolver');
      let injectableEntry1 = new InjectableEntry(name1, resolver1);
      injectableEntry1.dependencyNames = [name2, name3];
      injectableEntryMap.set(name1, injectableEntry1);

      let resolver2 = new StubInjectableResolver('resolver');
      let injectableEntry2 = new InjectableEntry(name2, resolver2);
      injectableEntry2.dependencyNames = [name3];
      injectableEntryMap.set(name2, injectableEntry2);

      let resolver3 = new StubInjectableResolver('resolver');
      let injectableEntry3 = new InjectableEntry(name3, resolver3);
      injectableEntry3.dependencyNames = [];
      injectableEntryMap.set(name3, injectableEntry3);

      // Execute
      let dependencyEntities = dependencyTraverser.traverse(new Set(injectableEntryMap.values()));

      // Assert
      let iterator = dependencyEntities.values();
      expect(iterator.next().value).toEqual(injectableEntry3);
      expect(iterator.next().value).toEqual(injectableEntry2);
      expect(iterator.next().value).toEqual(injectableEntry1);
    });


    it('returns an ordered set of ContentEntries with separate dependency graphs', () => {
      // Setup
      let name1 = 'test1';
      let name2 = 'test2';
      let name3 = 'test3';
      let name4 = 'test4';
      let resolver1 = new StubInjectableResolver('resolver');
      let injectableEntry1 = new InjectableEntry(name1, resolver1);
      injectableEntry1.dependencyNames = [name2, name3];
      injectableEntryMap.set(name1, injectableEntry1);

      let resolver2 = new StubInjectableResolver('resolver');
      let injectableEntry2 = new InjectableEntry(name2, resolver2);
      injectableEntry2.dependencyNames = [];
      injectableEntryMap.set(name2, injectableEntry2);

      let resolver3 = new StubInjectableResolver('resolver');
      let injectableEntry3 = new InjectableEntry(name3, resolver3);
      injectableEntry3.dependencyNames = [];
      injectableEntryMap.set(name3, injectableEntry3);

      let resolver4 = new StubInjectableResolver('resolver');
      let injectableEntry4 = new InjectableEntry(name4, resolver4);
      injectableEntry4.dependencyNames = [name3];
      injectableEntryMap.set(name4, injectableEntry4);

      // Execute
      let dependencyEntities = dependencyTraverser.traverse(new Set(injectableEntryMap.values()));

      // Assert
      let iterator = dependencyEntities.values();
      expect(iterator.next().value).toEqual(injectableEntry2);
      expect(iterator.next().value).toEqual(injectableEntry3);
      expect(iterator.next().value).toEqual(injectableEntry1);
      expect(iterator.next().value).toEqual(injectableEntry4);
    });

    it('ignores when a dependency cannot be resolved and is optional', () => {
      // Setup
      let name1 = 'test1';
      let name2 = 'test2';
      let name3 = 'test3';
      let resolver1 = new StubInjectableResolver('resolver');
      let injectableEntry1 = new InjectableEntry(name1, resolver1);
      injectableEntry1.dependencyNames = [name2, '?' + name3];
      injectableEntryMap.set(name1, injectableEntry1);

      let resolver2 = new StubInjectableResolver('resolver');
      let injectableEntry2 = new InjectableEntry(name2, resolver2);
      injectableEntry2.dependencyNames = ['+' + name3];
      injectableEntryMap.set(name2, injectableEntry2);

      // Execute
      let dependencyEntities = dependencyTraverser.traverse(new Set(injectableEntryMap.values()));

      // Assert
      let iterator = dependencyEntities.values();
      expect(iterator.next().value).toEqual(injectableEntry2);
      expect(iterator.next().value).toEqual(injectableEntry1);
    });

    it('throws error when a dependency cannot be resolved and is required', () => {
      // Setup
      let name1 = 'test1';
      let name2 = 'test2';
      let name3 = 'test3';
      let resolver1 = new StubInjectableResolver('resolver');
      let injectableEntry1 = new InjectableEntry(name1, resolver1);
      injectableEntry1.dependencyNames = [name2, name3];
      injectableEntryMap.set(name1, injectableEntry1);

      let resolver2 = new StubInjectableResolver('resolver');
      let injectableEntry2 = new InjectableEntry(name2, resolver2);
      injectableEntry2.dependencyNames = [name3];
      injectableEntryMap.set(name2, injectableEntry2);

      // Assert
      try {
        dependencyTraverser.traverse(new Set(injectableEntryMap.values()));
      } catch (e) {
        expect(e.message).toEqual('Dependency not available: name=test3');
        return;
      }
      throw new Error('Expect an error');
    });

    it('throws error when there is a circular dependency', () => {
      // Setup
      let name1 = 'test1';
      let name2 = 'test2';
      let resolver1 = new StubInjectableResolver('resolver');
      let injectableEntry1 = new InjectableEntry(name1, resolver1);
      injectableEntry1.dependencyNames = [name2];
      injectableEntryMap.set(name1, injectableEntry1);

      let resolver2 = new StubInjectableResolver('resolver');
      let injectableEntry2 = new InjectableEntry(name2, resolver2);
      injectableEntry2.dependencyNames = [name1];
      injectableEntryMap.set(name2, injectableEntry2);

      // Assert
      try {
        dependencyTraverser.traverse(new Set(injectableEntryMap.values()));
      } catch (e) {
        expect(e.message).toEqual('Circular dependency found: name=test2 dependency=test1');
        return;
      }
      throw new Error('Expect an error');
    });

  });

});
