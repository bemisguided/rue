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
import TestContainer from '../../lib/test/TestContainer';

class StubContainer extends Container {

  instance: any;

  name: string;

  parent: ?string;

  replacement: any;

  replaceInstance(name: string, replacement: any, parent: ?string): any {
    this.name = name;
    this.parent = parent;
    this.replacement = replacement;
    return this.instance;
  }

}

describe('./test/TestContainer.js', () => {

  let testContainer: TestContainer;
  let stubContainer: StubContainer;

  beforeEach(() => {
    stubContainer = new StubContainer();
    testContainer = new TestContainer(stubContainer);
  });

  describe('swap()', () => {

    it('correctly swaps a direct instance and records the replacement', () => {
      // Setup
      let name = 'test';
      let expected1 = {value1: name};
      let expected2 = {value2: name};
      stubContainer.instance = expected1;

      // Execute
      testContainer.swap(name, expected2);

      // Assert
      expect(stubContainer.name).toEqual(name);
      expect(stubContainer.parent).toBeUndefined();
      expect(stubContainer.replacement).toEqual(expected2);
      expect(testContainer.replacements[0]).toEqual({
        name: name,
        parent: undefined,
        instance: expected1,
      });
    });

    it('correctly swaps an indirect instance and records the replacement', () => {
      // Setup
      let name = 'test';
      let parent = 'testParent';
      let expected1 = {value1: name};
      let expected2 = {value2: name};
      stubContainer.instance = expected1;

      // Execute
      testContainer.swap(name, expected2, parent);

      // Assert
      expect(stubContainer.name).toEqual(name);
      expect(stubContainer.parent).toEqual(parent);
      expect(stubContainer.replacement).toEqual(expected2);
      expect(testContainer.replacements[0]).toEqual({
        name: name,
        parent: parent,
        instance: expected1,
      });
    });

    it('throws error when swaping a duplicate direct instance', () => {
      // Setup
      let name = 'test';
      let expected1 = {value1: name};
      let expected2 = {value2: name};
      stubContainer.instance = expected1;
      testContainer.swap(name, expected2);

      // Execute
      try {
        testContainer.swap(name, expected2);
      } catch (error) {
        expect(error.message).toEqual('Test replacement already exists: name=test parent=');
        return;
      }
      throw 'Expect an error';
    });

    it('throws error when swaping a duplicate indirect instance', () => {
      // Setup
      let name = 'test';
      let parent = 'testParent';
      let expected1 = {value1: name};
      let expected2 = {value2: name};
      stubContainer.instance = expected1;
      testContainer.swap(name, expected2, parent);

      // Execute
      try {
        testContainer.swap(name, expected2, parent);
      } catch (error) {
        expect(error.message).toEqual('Test replacement already exists: name=test parent=testParent');
        return;
      }
      throw 'Expect an error';
    });

  });

  describe('resetSwaps()', () => {

    it('correctly resets replaced instances', () => {
      // Setup
      let name = 'test';
      let parent = 'testParent';
      let expected1 = {value1: name};
      let expected2 = {value2: name};
      stubContainer.instance = expected2;
      let replacement = {
        name: name,
        parent: parent,
        instance: expected1,
      };
      testContainer.replacements.push(replacement);

      // Execute
      testContainer.resetSwaps();

      // Assert
      expect(stubContainer.name).toEqual(name);
      expect(stubContainer.parent).toEqual(parent);
      expect(stubContainer.replacement).toEqual(expected1);
      expect(testContainer.replacements.length).toEqual(0);
    });

  });

});