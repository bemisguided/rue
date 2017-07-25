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
import RueError from './RueError';

const PROP_IS_PROXY = '_$isProxy';
const PROP_SWAP_TARGET = '_$swapTarget';
const PROP_TARGET = '_$target';

export default class ProxyHelper {

  static getProxyTarget(obj: any): any {
    return obj[PROP_TARGET];
  }

  static isProxyable(obj: any): boolean {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function');
  }

  static isProxy(obj: any): boolean {
    return !!obj && !!obj[PROP_IS_PROXY];
  }

  static isSwapableProxy(obj: any): boolean {
    return ProxyHelper.isProxy(obj) && !!obj[PROP_SWAP_TARGET];
  }

  static swapProxyTarget(proxy: any, proxyTarget: any): void {
    if (!ProxyHelper.isSwapableProxy(proxy)) {
      throw new RueError('Not a swapable proxy');
    }
    if (!ProxyHelper.isProxyable(proxyTarget)) {
      throw new RueError('Target not swapped must be either Object or Function: ' + _toTypeOf(proxyTarget));
    }
    proxy[PROP_SWAP_TARGET](proxyTarget);
  }

  static swapableProxy(proxyTarget: any): any {

    if (!ProxyHelper.isProxyable(proxyTarget)) {
      throw new RueError('Target not proxyable must be either Object or Function: ' + _toTypeOf(proxyTarget));
    }

    return new Proxy(proxyTarget, {

      apply: (target: any, context: any, args: Array<any>): any => {
        return Reflect.apply(proxyTarget, proxyTarget, args);
      },

      get: (target: any, propKey: string, receiver: any): any => {
        let property = proxyTarget[propKey];

        if (propKey === PROP_IS_PROXY) {
          return true;
        }

        if (propKey === PROP_SWAP_TARGET) {
          return (...args) => {
            proxyTarget = args[0];
            return true;
          };
        }

        if (propKey === PROP_TARGET) {
          return proxyTarget;
        }

        if (typeof property === 'function') {
          return (...args) => {
            return property.apply(proxyTarget, args);
          };
        }

        return property;
      },

      getOwnPropertyDescriptor: function (target, propKey) {
        return Object.getOwnPropertyDescriptor(proxyTarget, propKey);
      },

      ownKeys: (target: any) => {
        return Object.getOwnPropertyNames(proxyTarget);
      },

      set: (target: any, propKey: string, value: any, receiver: any): boolean => {
        proxyTarget[propKey] = value;
        return true;
      },

    });

  }

}

function _toTypeOf(value: any): string {
  if (value === null) {
    return 'typeof=null';
  }
  if (value === undefined) {
    return 'typeof=undefined';
  }
  return 'typeof=' + typeof value;
}
