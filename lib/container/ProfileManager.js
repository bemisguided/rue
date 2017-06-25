/**
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

