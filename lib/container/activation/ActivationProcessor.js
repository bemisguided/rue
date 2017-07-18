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
import InjectableEntry from '../injectables/InjectableEntry';
import ProxyHelper from '../../utils/ProxyHelper';
import PromiseHelper from '../../utils/PromiseHelper';

export default class ActivationProcessor {

  activate(injectableEntry: InjectableEntry, dependencies: Map<string, any>): Promise<any> {

    // Injectable is already active and a singleton return the instance
    if (injectableEntry.active && injectableEntry.singleton) {
      return PromiseHelper.wrapResolved(injectableEntry.instance);
    }

    // Resolve the injectable
    return injectableEntry.resolver.resolve(injectableEntry.name, [...dependencies.values()])
      .then((instance) => {

        // For Objects and Functions wrap in a Swapable Proxy
        if (ProxyHelper.isProxyable(instance)) {
          instance = ProxyHelper.swapableProxy(instance);
        }

        // Activate the injectable entity
        injectableEntry.active = true;

        // For non-singleton injectables just return it
        if (!injectableEntry.singleton) {
          return _postInit(injectableEntry, instance);
        }

        // Assign the dependencies to the injectable entry if a singleton
        injectableEntry.dependencies = dependencies;

        // Assign the instance to the injectable entry if a singleton
        injectableEntry.instance = instance;

        return _postInit(injectableEntry, instance);
      });

  }

}

function _postInit(injectableEntry: InjectableEntry, instance): Promise<any> {
  let postInit = injectableEntry.lifecycle.postInit;
  if (!postInit || !instance[postInit]) {
    return PromiseHelper.wrapResolved(instance);
  }
  let result = instance[postInit]();
  if (!PromiseHelper.isPromise(result)) {
    return PromiseHelper.wrapResolved(instance);
  }
  return result
    .then(() => {
      return PromiseHelper.wrapResolved(instance);
    });
}