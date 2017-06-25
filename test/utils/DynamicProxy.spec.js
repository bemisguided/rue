/**
 * @flow
 */
import { beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import DynamicProxy from '../../lib/utils/DynamicProxy';

describe('DynamicProxy()', () => {

  describe('DynamicProxy.proxy()', () => {

    it('can proxy a function with arguments', () => {
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

    it('can proxy getting a property', () => {
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

    it('can proxy setting a property', () => {
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

  });

  describe('DynamicProxy.proxy()', () => {

    it('can change the proxy target', () => {
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

  });

});
