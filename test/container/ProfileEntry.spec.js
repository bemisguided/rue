/**
 * @flow
 */
import { beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import ProfileEntry from '../../lib/container/ProfileEntry';
import ContainerEntry from '../../lib/container/ContainerEntry';

describe('./ProfileEntry.spec.js', () => {

  let profileEntry: ProfileEntry;

  beforeEach(() => {
    profileEntry = new ProfileEntry('test');
  });

  describe('addContainerEntry()', () => {

    it('adds a ContainerEntry to the hash of content entries', () => {
      // Setup
      let name = 'name';
      let containerEntry1 = new ContainerEntry(name, () => {
      });

      // Execute
      profileEntry.addContainerEntry(containerEntry1);

      // Assert
      let containerEntry2 = profileEntry.containerEntries[name];
      expect(containerEntry2).to.equal(containerEntry1);
    });

  });

  describe('getContainerEntry()', () => {

    it('returns a ContainerEntry by a provided name from the hash of content entries', () => {
      // Setup
      let name = 'name';
      let containerEntry1 = new ContainerEntry(name, () => {
      });
      profileEntry.containerEntries[name] = containerEntry1;

      // Execute
      let containerEntry2 = profileEntry.getContainerEntry(name);

      // Assert
      expect(containerEntry2).to.equal(containerEntry1);
    });

  });

  describe('getContainerEntries()', () => {

    it('returns an array of ContainerEntry from the hash of content entries', () => {
      // Setup
      let name1 = 'name1';
      let name2 = 'name2';
      let containerEntry1 = new ContainerEntry(name1, () => {
      });
      let containerEntry2 = new ContainerEntry(name2, () => {
      });
      profileEntry.containerEntries[name1] = containerEntry1;
      profileEntry.containerEntries[name2] = containerEntry2;

      // Execute
      let containerEntries = profileEntry.getContainerEntries();

      // Assert
      expect(containerEntries.indexOf(containerEntry1)).to.be.greaterThan(-1);
      expect(containerEntries.indexOf(containerEntry2)).to.be.greaterThan(-1);
    });

  });

  describe('getContainerNames()', () => {

    it('returns an array of ContainerEntry names from the hash of content entries', () => {
      // Setup
      let name1 = 'name1';
      let name2 = 'name2';
      let containerEntry1 = new ContainerEntry(name1, () => {
      });
      let containerEntry2 = new ContainerEntry(name2, () => {
      });
      profileEntry.containerEntries[name1] = containerEntry1;
      profileEntry.containerEntries[name2] = containerEntry2;

      // Execute
      let containerEntries = profileEntry.getContainerNames();

      // Assert
      expect(containerEntries.indexOf(name1)).to.be.greaterThan(-1);
      expect(containerEntries.indexOf(name2)).to.be.greaterThan(-1);
    });

  });

});
