var profileMatcher = appRequire('./utils/profile_matcher');

describe('./utils/profile_matcher.js', function() {

  it('null/undefined profile that should match target profiles', function() {
    profileMatcher().should.be.true();
    profileMatcher(null, null).should.be.true();
    profileMatcher(null, []).should.be.true();
  });

  it('null/undefined profile that should not match target profiles', function() {
    profileMatcher(null, 'test').should.be.false();
    profileMatcher(null, ['test']).should.be.false();
  });

  it('non-array profile that should match target profiles', function() {
    profileMatcher('test', null).should.be.true();
    profileMatcher('test', 'test').should.be.true();
    profileMatcher('test', ['test', 'other']).should.be.true();
  });

  it('non-array profile that should not match target profiles', function() {
    profileMatcher('test', 'other').should.be.false();
    profileMatcher('test', ['some', 'other']).should.be.false();
  });

  it('array profiles that should match target profiles', function() {
    profileMatcher(['test', 'other'], 'test').should.be.true();
    profileMatcher(['test', 'other'], ['test', 'other']).should.be.true();
    profileMatcher(['test', 'some', 'other'], ['test', 'other']).should.be.true();
    profileMatcher(['test', 'other'], ['test', 'some', 'other']).should.be.true();
  });

  it('array profiles should not match target profiles', function() {
    profileMatcher(['test', 'other'], 'some').should.be.false();
    profileMatcher(['test', 'other'], ['some', 'where']).should.be.false();
  });

});
