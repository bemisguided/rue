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
import Q from 'q';
import PromiseHelper from '../../lib/utils/PromiseHelper';

describe('./util/PromiseHelper.js', () => {

  describe('isPromise()', () => {

    it('correctly identifies an ES6 Promise', () => {
      // Setup
      let promise = new Promise(() => {
      });

      // Execute
      let result = PromiseHelper.isPromise(promise);

      // Assert
      expect(result).toEqual(true);
    });

    it('correctly identifies a Q Promise', () => {
      // Setup
      let promise = Q.defer().promise;

      // Execute
      let result = PromiseHelper.isPromise(promise);

      // Assert
      expect(result).toEqual(true);
    });

    it('correctly identifies a string as not a Promise', () => {
      // Setup
      let value = 'test';

      // Execute
      let result = PromiseHelper.isPromise(value);

      // Assert
      expect(result).toEqual(false);
    });

    it('correctly identifies an Object as not a Promise', () => {
      // Setup
      let value = {};

      // Execute
      let result = PromiseHelper.isPromise(value);

      // Assert
      expect(result).toEqual(false);
    });

    it('correctly identifies a Function as not a Promise', () => {
      // Setup
      let value = () => {
      };

      // Execute
      let result = PromiseHelper.isPromise(value);

      // Assert
      expect(result).toEqual(false);
    });

  });

  describe('wrapResolve()', () => {

    it('correctly wraps a result with a resolved Promise', () => {
      // Setup
      let result = 'test';

      // Execute
      let promise = PromiseHelper.wrapResolved(result);

      // Assert
      expect(promise).resolves.toEqual(result);
    });

  });

  describe('wrapReject()', () => {

    it('correctly wraps an error with a rejected Promise', () => {
      // Setup
      let result = 'test';

      // Execute
      let promise = PromiseHelper.wrapReject(result);

      // Assert
      expect(promise).rejects.toEqual(result);
    });

  });

});