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
import DependencyContext from './DependencyContext';
import DependencyResolver from './DependencyResolver';
import InjectableManager from '../injectables/InjectableManager';
import InjectableEntry from '../injectables/InjectableEntry';

export default class DependencyProcessor {

  activeProfiles: Array<string>;

  dependencyResolvers: Array<DependencyResolver>;

  injectableManager: InjectableManager;

  constructor() {
  }

  resolve(name: string): ?InjectableEntry {
    let result: ?InjectableEntry;

    let dependencyContext = new DependencyContext();
    dependencyContext.name = name;
    dependencyContext.injectableManager = this.injectableManager;
    dependencyContext.activeProfiles = this.activeProfiles;
    for (let i = 0; i < this.dependencyResolvers.length; i++) {
      result = this.dependencyResolvers[i].resolve(dependencyContext);
      if (!result) {
        continue;
      }
      break;
    }
    return result;
  }

}