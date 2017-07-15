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
import ProxyHelper from '../../lib/utils/ProxyHelper';

describe('./util/ProxyHelper.js', () => {

  describe('ProxyHelper.isProxyable()', () => {

    it('correctly identifies an Object as being proxyable', () => {
      // Setup
      let target = {
        test: 'test',
      };

      // Execute
      let result = ProxyHelper.isProxyable(target);

      // Assert
      expect(result).toEqual(true);

    });

    it('correctly identifies a Function as being proxyable', () => {
      // Setup
      let target = () => {
      };

      // Execute
      let result = ProxyHelper.isProxyable(target);

      // Assert
      expect(result).toEqual(true);

    });

    it('correctly identifies null as not being proxyable', () => {
      // Setup
      let target = null;

      // Execute
      let result = ProxyHelper.isProxyable(target);

      // Assert
      expect(result).toEqual(false);

    });

    it('correctly identifies undefined as not being proxyable', () => {
      // Setup
      let target = undefined;

      // Execute
      let result = ProxyHelper.isProxyable(target);

      // Assert
      expect(result).toEqual(false);

    });

    it('correctly identifies a string as not being proxyable', () => {
      // Setup
      let target = 'test';

      // Execute
      let result = ProxyHelper.isProxyable(target);

      // Assert
      expect(result).toEqual(false);

    });

    it('correctly identifies a number as not being proxyable', () => {
      // Setup
      let target = 42;

      // Execute
      let result = ProxyHelper.isProxyable(target);

      // Assert
      expect(result).toEqual(false);

    });

  });

  describe('ProxyHelper.isProxy()', () => {

    it('correctly identifies itself as a Proxy', () => {
      // Setup
      let target = {
        test: 'hello',
      };
      let proxy = ProxyHelper.swapableProxy(target);

      // Execute
      expect(ProxyHelper.isProxy(proxy)).toEqual(true);
    });

    it('correctly identifies a non-Proxy object as not a Proxy', () => {
      // Execute
      expect(ProxyHelper.isProxy({})).toEqual(false);
    });

    it('correctly identifies a null as not a Proxy', () => {
      // Execute
      expect(ProxyHelper.isProxy(null)).toEqual(false);
    });

    it('correctly identifies a undefined as not a Proxy', () => {
      // Execute
      expect(ProxyHelper.isProxy(undefined)).toEqual(false);
    });

  });

  describe('ProxyHelper.isSwapableProxy()', () => {

    it('correctly identifies itself as a Swapable Proxy', () => {
      // Setup
      let target = {
        test: 'hello',
      };
      let proxy = ProxyHelper.swapableProxy(target);

      // Execute
      expect(ProxyHelper.isSwapableProxy(proxy)).toEqual(true);
    });

    it('correctly identifies a non-Proxy object as not a Swapable Proxy', () => {
      // Execute
      expect(ProxyHelper.isSwapableProxy({})).toEqual(false);
    });

  });

  describe('ProxyHelper.swapableProxy()', () => {

    it('can proxy an Object with a function property passing through their arguments', () => {
      // Setup
      let target = {
        test: (message) => message,
      };

      // Execute
      let proxy = ProxyHelper.swapableProxy(target);
      let expected = 'hello';
      let result = proxy.test(expected);

      // Assert
      expect(result).toEqual(expected);
    });

    it('can proxy an Object getting a property', () => {
      // Setup
      let expected = 'hello';
      let target = {
        test: expected,
      };

      // Execute
      let proxy = ProxyHelper.swapableProxy(target);
      let result = proxy.test;

      // Assert
      expect(result).toEqual(expected);
    });

    it('can proxy an Object setting a property', () => {
      // Setup
      let expected = 'hello';
      let target = {
        test: 'goodbye',
      };

      // Execute
      let proxy = ProxyHelper.swapableProxy(target);
      proxy.test = expected;

      // Assert
      expect(proxy.test).toEqual(expected);
    });

    it('can proxy a Function passing through it\'s arguments', () => {
      // Setup
      let expected = 'hello';
      let target = (value) => value;

      // Execute
      let proxy = ProxyHelper.swapableProxy(target);

      // Assert
      expect(proxy(expected)).toEqual(expected);
    });

    it('throws exception when attempting to proxy a scalar', () => {
      // Setup
      let target = 'scalar';

      // Execute
      try {
        ProxyHelper.swapableProxy(target);
      } catch (error) {
        expect(error.message).toEqual('Target not proxyable must be either Object or Function: typeof=string');
      }
    });

    it('throws exception when attempting to proxy a null', () => {
      // Setup
      let target = null;

      // Execute
      try {
        ProxyHelper.swapableProxy(target);
      } catch (error) {
        expect(error.message).toEqual('Target not proxyable must be either Object or Function: typeof=null');
      }
    });

    it('throws exception when attempting to proxy an undefined', () => {
      // Setup
      let target = undefined;

      // Execute
      try {
        ProxyHelper.swapableProxy(target);
      } catch (error) {
        expect(error.message).toEqual('Target not proxyable must be either Object or Function: typeof=undefined');
      }
    });

    describe('$proxy._$isProxy()', () => {

      it('correctly identifies itself as a Proxy', () => {
        // Setup
        let target = {
          test: 'hello',
        };
        let proxy = ProxyHelper.swapableProxy(target);

        // Execute
        expect(proxy._$isProxy).toEqual(true);

      });

    });

    describe('$proxy._$swapTarget()', () => {

      it('can change an Object proxy target', () => {
        // Setup
        let expected = 'hello';
        let target1 = {
          test: 'goodbye',
        };
        let target2 = {
          test: expected,
        };
        let proxy = ProxyHelper.swapableProxy(target1);

        // Execute
        expect(proxy.test).not.toEqual(expected);
        proxy._$swapTarget(target2);

        // Assert
        expect(proxy.test).toEqual(expected);

      });

      it('can change a Function proxy target', () => {
        // Setup
        let expected = 'hello';
        let target1 = (value) => 'goodbye';
        let target2 = (value) => value;
        let proxy = ProxyHelper.swapableProxy(target1);

        // Execute
        expect(proxy(expected)).not.toEqual(expected);
        proxy._$swapTarget(target2);

        // Assert
        expect(proxy(expected)).toEqual(expected);

      });

    });

    describe('$proxy._$target()', () => {

      it('correctly retrieves the proxy target', () => {
        // Setup
        let target = {
          test: 'hello',
        };
        let proxy = ProxyHelper.swapableProxy(target);

        // Execute
        expect(proxy._$target).toEqual(target);

      });

    });

  });

  describe('ProxyHelper.swapProxyTarget()', () => {

    it('can change a target Object for a Swapable Proxy', () => {
      // Setup
      let expected = 'hello';
      let target1 = {
        test: 'goodbye',
      };
      let target2 = {
        test: expected,
      };
      let proxy = ProxyHelper.swapableProxy(target1);

      // Execute
      expect(proxy.test).not.toEqual(expected);
      ProxyHelper.swapProxyTarget(proxy, target2);

      // Assert
      expect(proxy.test).toEqual(expected);

    });

    it('can change a target Function for a Swapable Proxy', () => {
      // Setup
      let expected = 'hello';
      let target1 = (value) => 'goodbye';
      let target2 = (value) => value;
      let proxy = ProxyHelper.swapableProxy(target1);

      // Execute
      expect(proxy(expected)).not.toEqual(expected);
      ProxyHelper.swapProxyTarget(proxy, target2);

      // Assert
      expect(proxy(expected)).toEqual(expected);

    });

    it('throws exception when attempting to swap proxy with a scalar', () => {
      // Setup
      let target1 = {
        test: 'goodbye',
      };
      let target2 = 'scalar';
      let proxy = ProxyHelper.swapableProxy(target1);

      // Execute
      try {
        ProxyHelper.swapProxyTarget(proxy, target2);
      } catch (error) {
        expect(error.message).toEqual('Target not swapped must be either Object or Function: typeof=string');
      }
    });

    it('throws exception when attempting to swap proxy with a null', () => {
      // Setup
      let target1 = {
        test: 'goodbye',
      };
      let target2 = null;
      let proxy = ProxyHelper.swapableProxy(target1);

      // Execute
      try {
        ProxyHelper.swapProxyTarget(proxy, target2);
      } catch (error) {
        expect(error.message).toEqual('Target not swapped must be either Object or Function: typeof=null');
      }
    });

    it('throws exception when attempting to swap proxy with a undefined', () => {
      // Setup
      let target1 = {
        test: 'goodbye',
      };
      let target2 = undefined;
      let proxy = ProxyHelper.swapableProxy(target1);

      // Execute
      try {
        ProxyHelper.swapProxyTarget(proxy, target2);
      } catch (error) {
        expect(error.message).toEqual('Target not swapped must be either Object or Function: typeof=undefined');
      }
    });

    it('throws exception when attempting to swap proxy with not a swapable proxy', () => {
      // Setup
      let target = undefined;
      let proxy = {};

      // Execute
      try {
        ProxyHelper.swapProxyTarget(proxy, target);
      } catch (error) {
        expect(error.message).toEqual('Not a swapable proxy');
      }
    });

  });

});
