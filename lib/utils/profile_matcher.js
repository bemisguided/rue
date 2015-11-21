// Module exports -----------------------------------------

module.exports = _matchProfile;

// Main functions -----------------------------------------

function _matchProfile(profiles, targetProfiles) {
  if (!profiles) {
    if (!targetProfiles) {
      return true;
    }
    if (Array.isArray(targetProfiles) && targetProfiles.length === 0) {
      return true;
    }
    return false;
  }

  if (Array.isArray(profiles)) {
    for (var i = 0; i < profiles.length; i++) {
      var profile = profiles[i];
      if (_matchNonArrayProfile(profile, targetProfiles)) {
        return true;
      }
    }
    return false;
  }
  return _matchNonArrayProfile(profiles, targetProfiles);
}

// Support functions --------------------------------------

function _matchNonArrayProfile(profile, targetProfiles) {
  if (!targetProfiles) {
    // Default profile case
    return true;
  }
  if (Array.isArray(targetProfiles) && targetProfiles.indexOf(profile) > -1) {
    return true;
  }
  return profile === targetProfiles;
}
