var strategies = appRequire('./strategies');
var serviceStrategy = appRequire('./strategies/service_strategy');

describe('./strategies/index.js', function() {

  describe('get()', function() {

    it('returns the correct strategy for a give type', function() {
      strategies.get(strategies.TYPES.SERVICE).should.be.eql(serviceStrategy);
    });

    it('throws an error if the strategy type could not be resolved', function() {
      (function() {
        strategies.get('blah');
      }).should.throw('Unsupported dependency type "blah"');
    });

  });

});
