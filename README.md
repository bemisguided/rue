# rue
[![Build Status](https://travis-ci.org/bemisguided/rue.svg?branch=rewrite-es6)](https://travis-ci.org/bemisguided/rue)

nodejs dependency injection injectableManager


### Sample Rue Configuration
```javascript 1.7
const rue = require('rue');
rue
  .factory('SomeApiService')
  .module(require('./api/SomeApiService'))
  .withProfiles('production')
  .build();

rue
  .factory('SomeApiService')
  .module(require('./api/StubSomeApiService'))
  .withProfiles('test')
  .build();

rue
  .service('SomeBusinessService')
  .module(require('./service/SomeBusinessService'))
  .withDependencies('SomeApiService')
  .build();

rue
  .activate('production')
  .then(() => {
     console.log('You application is up and running');
  });
```

### SomeApiService
```javascript 1.7
module.exports = () => {
  return {
    getUser: () => {
      return {id: 'userId'};
    }
  };
}
```

### SomeBusinessService
```javascript 1.7
module.exports = SomeBusinessService;

class SomeBusinessService {
  
  someApiService;
  
  constructor(someApiSerivce) {
    this.someApiService = someApiSerivce;
  }
  
  getMeAUser() {
    return someApiService.getUser();
  }
  
}
```