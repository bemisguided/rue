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

  activate(injectableEntry: InjectableEntry, dependencies: Array<any>): Promise<any> {

    // Injectable is already active and a singleton return the instance
    if (injectableEntry.active && injectableEntry.singleton) {
      return PromiseHelper.wrapResolved(injectableEntry.instance);
    }

    // Resolve the injectable
    return injectableEntry.resolver.resolve(injectableEntry.name, dependencies)
      .then((instance) => {

        // For non-singleton injectables just mark as activated and return it
        if (!injectableEntry.singleton) {
          injectableEntry.active = true;
          return _postConstruct(injectableEntry, instance);
        }

        // For singleton injectables wrap those that can be in a swapable proxy
        if (ProxyHelper.isProxyable(instance)) {
          instance = ProxyHelper.swapableProxy(instance);
        }

        // Update the instance
        injectableEntry.active = true;
        injectableEntry.instance = instance;

        return _postConstruct(injectableEntry, instance);
      });

  }

}

function _postConstruct(injectableEntry: InjectableEntry, instance): Promise<any> {
  let postConstruct = injectableEntry.lifecycle.postConstruct;
  if (!postConstruct || !instance[postConstruct]) {
    return PromiseHelper.wrapResolved(instance);
  }
  let result = instance[postConstruct]();
  if (!PromiseHelper.isPromise(result)) {
    return PromiseHelper.wrapResolved(instance);
  }
  return result
    .then(() => {
      return PromiseHelper.wrapResolved(instance);
    });
}