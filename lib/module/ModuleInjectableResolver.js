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
import InjectableResolver from '../container/injectables/InjectableResolver';
import PromiseHelper from '../utils/PromiseHelper';
import RueError from '../utils/RueError';

import type { InjectableLifecycleConfig } from '../container/injectables/InjectableLifecycleConfig';

export default class ModuleInjectableResolver extends InjectableResolver {

  lifecycle: InjectableLifecycleConfig;

  constructor(target: any, lifecycle: InjectableLifecycleConfig) {
    super(target);
    this.lifecycle = lifecycle;
  }

  resolve(name: string, dependencies: Array<any>): Promise<any> {
    try {
      let init = this.lifecycle.init;
      if (!init) {
        return PromiseHelper.wrapReject(new RueError(`No defined initialization method for dependency: name=${name}`));
      }
      let fn = this.target[init];
      if (!fn) {
        return PromiseHelper.wrapReject(new RueError(`Cannot initialize dependency as initializer function not found: name=${name} function=${init}`));
      }
      let result = Reflect.apply(fn, this.target, dependencies);
      if (!PromiseHelper.isPromise(result)) {
        return PromiseHelper.wrapResolved(this.target);
      }
      return result
        .then(() => {
          return PromiseHelper.wrapResolved(this.target);
        });
    } catch (error) {
      return PromiseHelper.wrapReject(error);
    }
  }

}