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
import DynamicProxy from '../../lib/utils/DynamicProxy';

describe('./util/DynamicProxy.js', () => {

  describe('DynamicProxy.proxy()', () => {

    it('can proxy an Object with a function property passing through their arguments', () => {
      // Setup
      let target = {
        test: (message) => message,
      };

      // Execute
      let proxy = DynamicProxy.proxy(target);
      let expected = 'hello';
      let result = proxy.test(expected);

      // Assert
      expect(result).to.equal(expected);
    });

    it('can proxy an Object getting a property', () => {
      // Setup
      let expected = 'hello';
      let target = {
        test: expected,
      };

      // Execute
      let proxy = DynamicProxy.proxy(target);
      let result = proxy.test;

      // Assert
      expect(result).to.equal(expected);
    });

    it('can proxy an Object setting a property', () => {
      // Setup
      let expected = 'hello';
      let target = {
        test: 'goodbye',
      };

      // Execute
      let proxy = DynamicProxy.proxy(target);
      proxy.test = expected;

      // Assert
      expect(proxy.test).to.equal(expected);
    });

    it('can proxy a Function passing through it\'s arguments', () => {
      // Setup
      let expected = 'hello';
      let target = (value) => value;

      // Execute
      let proxy = DynamicProxy.proxy(target);

      // Assert
      expect(proxy(expected)).to.equal(expected);
    });

  });

  describe('DynamicProxy.proxy()', () => {

    it('can change an Object proxy target', () => {
      // Setup
      let expected = 'hello';
      let target1 = {
        test: 'goodbye',
      };
      let target2 = {
        test: expected,
      };
      let proxy = DynamicProxy.proxy(target1);

      // Execute
      expect(proxy.test).to.not.equal(expected);
      proxy._$setProxyTarget(target2);

      // Assert
      expect(proxy.test).to.equal(expected);

    });

    it('can change a Function proxy target', () => {
      // Setup
      let expected = 'hello';
      let target1 = (value) => 'goodbye';
      let target2 = (value) => value;
      let proxy = DynamicProxy.proxy(target1);

      // Execute
      expect(proxy(expected)).to.not.equal(expected);
      proxy._$setProxyTarget(target2);

      // Assert
      expect(proxy(expected)).to.equal(expected);

    });

  });

});
