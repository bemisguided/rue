/**
 * @flow
 */
import { beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import DependencyResolver from '../../lib/container/DependencyResolver';
import ContainerEntry from '../../lib/container/ContainerEntry';

describe('./DependencyResolver.js', () => {

  let containerEntries: Map<string, ContainerEntry>;
  let dependencyResolver: DependencyResolver;

  beforeEach(() => {
    containerEntries = new Map();
    dependencyResolver = new DependencyResolver(containerEntries);
  });

  describe('resolve()', function () {

    it('returns an ordered set of ContentEntries with no dependencies', () => {
      // Setup
      let name = 'test';
      let module = 'module';
      let dependencies = [];
      let containerEntry = new ContainerEntry(name, module, dependencies);
      containerEntries.set(name, containerEntry);

      // Execute
      let dependencyEntities = dependencyResolver.resolve();

      // Assert
      let iterator = dependencyEntities.values();
      expect(iterator.next().value).to.equal(containerEntry);
    });

    it('returns an ordered set of ContentEntries with a single dependency', () => {
      // Setup
      let name1 = 'test1';
      let module1 = 'module1';
      let name2 = 'test2';
      let module2 = 'module2';
      let containerEntry1 = new ContainerEntry(name1, module, [name2]);
      let containerEntry2 = new ContainerEntry(name2, module, []);
      containerEntries.set(name1, containerEntry1);
      containerEntries.set(name2, containerEntry2);

      // Execute
      let dependencyEntities = dependencyResolver.resolve();

      // Assert
      let iterator = dependencyEntities.values();
      expect(iterator.next().value).to.equal(containerEntry2);
      expect(iterator.next().value).to.equal(containerEntry1);
    });


    it('returns an ordered set of ContentEntries with multiple dependencies', () => {
      // Setup
      let name1 = 'test1';
      let module1 = 'module1';
      let name2 = 'test2';
      let module2 = 'module2';
      let name3 = 'test3';
      let module3 = 'module3';
      let containerEntry1 = new ContainerEntry(name1, module1, [name2, name3]);
      let containerEntry2 = new ContainerEntry(name2, module2, []);
      let containerEntry3 = new ContainerEntry(name3, module3, []);
      containerEntries.set(name1, containerEntry1);
      containerEntries.set(name2, containerEntry2);
      containerEntries.set(name3, containerEntry3);

      // Execute
      let dependencyEntities = dependencyResolver.resolve();

      // Assert
      let iterator = dependencyEntities.values();
      expect(iterator.next().value).to.equal(containerEntry2);
      expect(iterator.next().value).to.equal(containerEntry3);
      expect(iterator.next().value).to.equal(containerEntry1);
    });

    it('returns an ordered set of ContentEntries with multiple dependencies with dependencies', () => {
      // Setup
      let name1 = 'test1';
      let module1 = 'module1';
      let name2 = 'test2';
      let module2 = 'module2';
      let name3 = 'test3';
      let module3 = 'module3';
      let containerEntry1 = new ContainerEntry(name1, module1, [name2, name3]);
      let containerEntry2 = new ContainerEntry(name2, module2, [name3]);
      let containerEntry3 = new ContainerEntry(name3, module3, []);
      containerEntries.set(name1, containerEntry1);
      containerEntries.set(name2, containerEntry2);
      containerEntries.set(name3, containerEntry3);

      // Execute
      let dependencyEntities = dependencyResolver.resolve();

      // Assert
      let iterator = dependencyEntities.values();
      expect(iterator.next().value).to.equal(containerEntry3);
      expect(iterator.next().value).to.equal(containerEntry2);
      expect(iterator.next().value).to.equal(containerEntry1);
    });


    it('returns an ordered set of ContentEntries with separate dependency graphs', () => {
      // Setup
      let name1 = 'test1';
      let module1 = 'module1';
      let name2 = 'test2';
      let module2 = 'module2';
      let name3 = 'test3';
      let module3 = 'module3';
      let name4 = 'test4';
      let module4 = 'module4';
      let containerEntry1 = new ContainerEntry(name1, module1, [name2, name3]);
      let containerEntry2 = new ContainerEntry(name2, module2, []);
      let containerEntry3 = new ContainerEntry(name3, module3, []);
      let containerEntry4 = new ContainerEntry(name4, module4, [name3]);
      containerEntries.set(name1, containerEntry1);
      containerEntries.set(name2, containerEntry2);
      containerEntries.set(name3, containerEntry3);
      containerEntries.set(name4, containerEntry4);

      // Execute
      let dependencyEntities = dependencyResolver.resolve();

      // Assert
      let iterator = dependencyEntities.values();
      expect(iterator.next().value).to.equal(containerEntry2);
      expect(iterator.next().value).to.equal(containerEntry3);
      expect(iterator.next().value).to.equal(containerEntry1);
      expect(iterator.next().value).to.equal(containerEntry4);
    });

    it('throws error when a dependency cannot be resolved', () => {
      // Setup
      let name1 = 'test1';
      let module1 = 'module1';
      let name2 = 'test2';
      let module2 = 'module2';
      let name3 = 'test3';
      let module3 = 'module3';
      let containerEntry1 = new ContainerEntry(name1, module1, [name2, name3]);
      let containerEntry2 = new ContainerEntry(name2, module2, [name3]);
      containerEntries.set(name1, containerEntry1);
      containerEntries.set(name2, containerEntry2);

      // Assert
      try {
        dependencyResolver.resolve();
      }
      catch (e) {
        expect(e.message).to.equal('Dependency not available: name=test3');
      }
    });

    it('throws error when there is a circular dependency', function () {
      // Setup
      let name1 = 'test1';
      let module1 = 'module1';
      let name2 = 'test2';
      let module2 = 'module2';
      let containerEntry1 = new ContainerEntry(name1, module1, [name2]);
      let containerEntry2 = new ContainerEntry(name2, module2, [name1]);
      containerEntries.set(name1, containerEntry1);
      containerEntries.set(name2, containerEntry2);

      // Assert
      try {
        dependencyResolver.resolve();
      }
      catch (e) {
        expect(e.message).to.equal('Circular dependency found: name=test2 dependency=test1');
      }
    });

  });

});