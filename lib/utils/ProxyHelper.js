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
export default class ProxyHelper {

  static isProxyable(obj: any): boolean {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function');
  }

  static swapableProxy(proxiedTarget: any): any {

    return new Proxy(proxiedTarget, {

      proxiedTarget: proxiedTarget,

      apply: (target: any, context: any, args: Array<any>): any => {
        return Reflect.apply(proxiedTarget, context, args);
      },

      get: (target: any, propKey: string, receiver: any): any => {
        let property = proxiedTarget[propKey];

        if (propKey === '_$isProxy') {
          return true;
        }

        if (propKey === '_$swapTarget') {
          return (...args) => {
            proxiedTarget = args[0];
            return true;
          };
        }

        if (typeof property === 'function') {
          return (...args) => {
            return property.apply(this, args);
          };
        }

        return property;
      },

      set: (target: any, propKey: string, value: any, receiver: any): boolean => {
        proxiedTarget[propKey] = value;
        return true;
      }

    });

  }

}
