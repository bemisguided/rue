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
import ProfileEntry from './ProfileEntry';

const PROFILE_DEFAULT: string = '';

export default class ProfileManager {

  profileEntries: { [string]: ProfileEntry };

  constructor() {
    this.profileEntries = {};
    this.addProfileEntry(PROFILE_DEFAULT);
  }

  addProfileEntry(name: string): ProfileEntry {
    let profileEntry = this.getProfileEntry(name);
    if (profileEntry) {
      return profileEntry;
    }
    profileEntry = new ProfileEntry(name);
    this.profileEntries[name] = profileEntry;
    return profileEntry;
  }

  getProfileEntry(name: string): ProfileEntry {
    return this.profileEntries[name];
  }

  getDefaultProfileEntry(): ProfileEntry {
    return this.getProfileEntry(PROFILE_DEFAULT);
  }

  resolveProfileEntries(profiles: ?Array<string>): Set<ProfileEntry> {
    profiles = _normalizeProfiles(profiles);
    let result = new Set();
    let profileEntries = this.profileEntries;
    profiles.forEach(name => {
      let profileEntry = profileEntries[name];
      if (!profileEntry) {
        return;
      }
      result.add(profileEntry);
    });
    return result;
  }

}

function _normalizeProfiles(profiles: ?Array<string>): Array<string> {
  if (!profiles) {
    return [PROFILE_DEFAULT];
  }
  if (!Array.isArray(profiles)) {
    return [PROFILE_DEFAULT, profiles];
  }
  if (profiles.indexOf(PROFILE_DEFAULT) < 0) {
    profiles.push(PROFILE_DEFAULT);
  }
  return profiles;
}

