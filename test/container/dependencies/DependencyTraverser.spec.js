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
import DependencyProcessor from '../../../lib/container/dependencies/DependencyProcessor';
import InjectableEntry from '../../../lib/container/injectables/InjectableEntry';
import InjectableResolver from '../../../lib/container/injectables/InjectableResolver';

class StubDependencyProcessor extends DependencyProcessor {

  results: Map<string, InjectableEntry>;

  constructor(results: Map<string, InjectableEntry>) {
    super();
    this.results = results;
  }

  resolve(name: string): ?InjectableEntry  {
    return this.results.get(name);
  }

}

describe('./container/dependencies/DependencyTraverser.js', () => {

  let injectableEntryMap: Map<string, InjectableEntry>;
  let dependencyProcessor: StubDependencyProcessor;
  let dependencyTraverser: DependencyTraverser;

  beforeEach(() => {
    injectableEntryMap = new Map();
    dependencyProcessor = new StubDependencyProcessor(injectableEntryMap);
    dependencyTraverser = new DependencyTraverser(dependencyProcessor);
  });

  describe('traverse()', function () {

    it('returns an ordered set of ContentEntries with no dependencies', () => {
      // Setup
      let name = 'test';
      let resolver = new InjectableResolver('resolver');
      let dependencies = [];
      let injectableEntry = new InjectableEntry(name, resolver);
      injectableEntry.dependencies = dependencies;
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
      let resolver1 = new InjectableResolver('resolver');
      let injectableEntry1 = new InjectableEntry(name1, resolver1);
      injectableEntry1.dependencies = [name2];
      injectableEntryMap.set(name1, injectableEntry1);

      let resolver2 = new InjectableResolver('resolver');
      let injectableEntry2 = new InjectableEntry(name2, resolver2);
      injectableEntry2.dependencies = [];
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

      let resolver1 = new InjectableResolver('resolver');
      let injectableEntry1 = new InjectableEntry(name1, resolver1);
      injectableEntry1.dependencies = [name2, name3];
      injectableEntryMap.set(name1, injectableEntry1);

      let resolver2 = new InjectableResolver('resolver');
      let injectableEntry2 = new InjectableEntry(name2, resolver2);
      injectableEntry2.dependencies = [];
      injectableEntryMap.set(name2, injectableEntry2);

      let resolver3 = new InjectableResolver('resolver');
      let injectableEntry3 = new InjectableEntry(name3, resolver3);
      injectableEntry3.dependencies = [];
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
      let resolver1 = new InjectableResolver('resolver');
      let injectableEntry1 = new InjectableEntry(name1, resolver1);
      injectableEntry1.dependencies = [name2, name3];
      injectableEntryMap.set(name1, injectableEntry1);

      let resolver2 = new InjectableResolver('resolver');
      let injectableEntry2 = new InjectableEntry(name2, resolver2);
      injectableEntry2.dependencies = [name3];
      injectableEntryMap.set(name2, injectableEntry2);

      let resolver3 = new InjectableResolver('resolver');
      let injectableEntry3 = new InjectableEntry(name3, resolver3);
      injectableEntry3.dependencies = [];
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
      let resolver1 = new InjectableResolver('resolver');
      let injectableEntry1 = new InjectableEntry(name1, resolver1);
      injectableEntry1.dependencies = [name2, name3];
      injectableEntryMap.set(name1, injectableEntry1);

      let resolver2 = new InjectableResolver('resolver');
      let injectableEntry2 = new InjectableEntry(name2, resolver2);
      injectableEntry2.dependencies = [];
      injectableEntryMap.set(name2, injectableEntry2);

      let resolver3 = new InjectableResolver('resolver');
      let injectableEntry3 = new InjectableEntry(name3, resolver3);
      injectableEntry3.dependencies = [];
      injectableEntryMap.set(name3, injectableEntry3);

      let resolver4 = new InjectableResolver('resolver');
      let injectableEntry4 = new InjectableEntry(name4, resolver4);
      injectableEntry4.dependencies = [name3];
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

    it('throws error when a dependency cannot be resolved', () => {
      // Setup
      let name1 = 'test1';
      let name2 = 'test2';
      let name3 = 'test3';
      let resolver1 = new InjectableResolver('resolver');
      let injectableEntry1 = new InjectableEntry(name1, resolver1);
      injectableEntry1.dependencies = [name2, name3];
      injectableEntryMap.set(name1, injectableEntry1);

      let resolver2 = new InjectableResolver('resolver');
      let injectableEntry2 = new InjectableEntry(name2, resolver2);
      injectableEntry2.dependencies = [name3];
      injectableEntryMap.set(name1, injectableEntry2);

      // Assert
      try {
        dependencyTraverser.traverse(new Set(injectableEntryMap.values()));
      }
      catch (e) {
        expect(e.message).toEqual('Dependency not available: name=test3');
      }
    });

    it('throws error when there is a circular dependency', function () {
      // Setup
      let name1 = 'test1';
      let name2 = 'test2';
      let resolver1 = new InjectableResolver('resolver');
      let injectableEntry1 = new InjectableEntry(name1, resolver1);
      injectableEntry1.dependencies = [name2];
      injectableEntryMap.set(name1, injectableEntry1);

      let resolver2 = new InjectableResolver('resolver');
      let injectableEntry2 = new InjectableEntry(name2, resolver2);
      injectableEntry2.dependencies = [name1];
      injectableEntryMap.set(name2, injectableEntry2);

      // Assert
      try {
        dependencyTraverser.traverse(new Set(injectableEntryMap.values()));
      }
      catch (e) {
        expect(e.message).toEqual('Circular dependency found: name=test2 dependency=test1');
      }
    });

  });

});