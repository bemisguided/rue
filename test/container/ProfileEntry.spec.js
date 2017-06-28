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
import { beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import ProfileEntry from '../../lib/container/ProfileEntry';
import ContainerEntry from '../../lib/container/ContainerEntry';
import ContainerEntryResolver from '../../lib/container/resolvers/ContainerEntryResolver';

describe('./container/ProfileEntry.js', () => {

  let profileEntry: ProfileEntry;

  beforeEach(() => {
    profileEntry = new ProfileEntry('test');
  });

  describe('addContainerEntry()', () => {

    it('adds a ContainerEntry to the hash of content entries', () => {
      // Setup
      let name = 'name';
      let containerEntry1 = new ContainerEntry(name, new ContainerEntryResolver(''), true);

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
      let containerEntry1 = new ContainerEntry(name, new ContainerEntryResolver(''), true);
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
      let containerEntry1 = new ContainerEntry(name1, new ContainerEntryResolver(''), true);
      let containerEntry2 = new ContainerEntry(name2, new ContainerEntryResolver(''), true);
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
      let containerEntry1 = new ContainerEntry(name1, new ContainerEntryResolver(''), true);
      let containerEntry2 = new ContainerEntry(name2, new ContainerEntryResolver(''), true);
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
