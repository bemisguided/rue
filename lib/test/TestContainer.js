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
import Container from '../container/Container';
import RueError from '../utils/RueError';

type TestReplacement = {
  name: string,
  parentName: ?string,
  instance: any
};

export default class TestContainer {

  container: Container;

  replacements: Array<TestReplacement>;

  constructor(container: ?Container) {
    // istanbul ignore next
    if (!container) {
      container = Container.singleton;
    }
    this.container = container;
    this.replacements = [];
  }

  swap(name: string, replacement: any, parentName: ?string): void {
    let existingReplacement = _findReplacement(name, parentName, this.replacements);
    if (existingReplacement) {
      throw new RueError(`Test replacement already exists: name=${name} parentName=${parentName ? parentName : ''}`);
    }
    let instance = this.container.replaceInstance(name, replacement, parentName);
    this.replacements.push({
      name: name,
      parentName: parentName,
      instance: instance,
    });
  }

  reset(): void {
    this.replacements.forEach((replacement) => {
      this.container.replaceInstance(replacement.name, replacement.instance, replacement.parentName);
    });
    this.replacements = [];
  }

}

function _findReplacement(name: string, parentName: ?string, replacements: Array<TestReplacement>): ?TestReplacement {
  for (let i = 0; i < replacements.length; i++) {
    let replacement = replacements[i];
    if (name === replacement.name && parentName === replacement.parentName) {
      return replacement;
    }
  }
  return null;
}