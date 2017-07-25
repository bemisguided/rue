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
export default class Environment {

  static profiles(): Array<string> {
    let result = [];
    let nodeEnv = process.env.NODE_ENV;
    if (nodeEnv) {
      result.push('env:' + nodeEnv);
    }
    let rueProfiles = process.env.RUE_PROFILES;
    if (rueProfiles) {
      let profiles = rueProfiles.split(',');
      for (let profile of profiles) {
        profile = profile.trim();
        if (profile && profile.length > 0) {
          result.push(profile);
        }
      }
    }
    return result;
  }

}
