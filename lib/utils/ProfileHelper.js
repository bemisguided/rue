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
export default class ProfileHelper {

  static get PROFILE_DEFAULT(): string {
    return '';
  }

  static filterProfiles(targetProfiles: Array<string>, activeProfiles: Array<string>): boolean {
    activeProfiles = ProfileHelper.normalizeActiveProfiles(activeProfiles);
    for (let i = 0; i < targetProfiles.length; i++) {
      let targetProfile = targetProfiles[i];
      if (targetProfile.substring(0, 1) === '!') {
        targetProfile = targetProfile.substring(1);
        if (ProfileHelper.hasProfileNot(targetProfile, activeProfiles)) {
          return true;
        }
        break;
      }
      if (ProfileHelper.hasProfile(targetProfile, activeProfiles)) {
        return true;
      }
    }
    return false;
  }

  static hasProfile(targetProfile: string, activeProfiles: Array<string>): boolean {
    return activeProfiles.indexOf(targetProfile) > -1;
  }

  static hasProfileNot(targetProfile: string, activeProfiles: Array<string>): boolean {
    return !ProfileHelper.hasProfile(targetProfile, activeProfiles);
  }

  static normalizeActiveProfiles(profiles: ?Array<string>): Array<string> {
    if (!profiles) {
      return [ProfileHelper.PROFILE_DEFAULT];
    }
    if (!Array.isArray(profiles)) {
      return [ProfileHelper.PROFILE_DEFAULT, profiles];
    }
    if (profiles.indexOf(ProfileHelper.PROFILE_DEFAULT) < 0) {
      profiles.push(ProfileHelper.PROFILE_DEFAULT);
    }
    return profiles;
  }

  static normalizeProfiles(profiles: ?Array<string>): Array<string> {
    if (!profiles || !Array.isArray(profiles) || profiles.length === 0) {
      return [ProfileHelper.PROFILE_DEFAULT];
    }
    return profiles;
  }

}