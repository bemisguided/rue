# rue
[![npm](https://img.shields.io/npm/v/rue.svg)](https://www.npmjs.com/package/rue)
[![state](https://img.shields.io/badge/state-alpha-yellow.svg)](https://github.com/bemisguided/rue)
[![npm](https://img.shields.io/npm/l/rue.svg)](https://github.com/bemisguided/rue)
[![node](https://img.shields.io/node/v/rue.svg)](https://github.com/bemisguided/rue)
[![David](https://img.shields.io/david/bemisguided/rue.svg)](https://github.com/bemisguided/rue)
[![Build Status](https://travis-ci.org/bemisguided/rue.svg)](https://travis-ci.org/bemisguided/rue)

**rue** a not (too) opinionated dependency injection container for nodejs.

## Features

- Dependency injection with minimalistic configuration
- Configuration is decoupled and unintrusive from application code
- Service and factory patterns supported
- Singleton and non-singleton patterns supported
- Asynchronous activation of dependencies via Promises
- Separate activation profiles supported
- Leverages ES6 Proxies to enable swapping mocks and stubs for testing

## Sample Usage

**./RueConfiguration.js**
```javascript 1.7
const rue = require('rue');

// Configure a module for any profile (the default) to be initialized
// using the function `start` (default is `init`)
rue
  .module('SomeModule')
  .useObject(require('./lib/SomeModule'))
  .lifecycleInit('start')
  .done();

// Configures some API service that is constructed with a factory method
// available only in the `production` profile as a singletone (the default)
rue
  .factory('SomeApiService')
  .useFunction(require('./api/SomeApiService'))
  .withProfiles('production')
  .done();

// Configures a test stub for the API service that is only in 
// available in the `test` profile
rue
  .factory('SomeApiService')
  .useFunction(require('./api/StubSomeApiService'))
  .isSingleton(false)
  .withProfiles('test')
  .done();

// Configures a business service that is a pure class/construct pattern 
// Object. The API service is injected as a dependency to the constructor. This
// business service is available to all profiles (the default).
rue
  .service('SomeBusinessService')
  .useObject(require('./service/SomeBusinessService'))
  .withDependencies('SomeApiService')
  .done();

// Activate the application and then wait for the promise to complete
rue
  .activate('production')
  .then(() => {
     console.log('You application is up and running');
  })
  .catch((error) => {
     console.log('Failed to load the application due to error', error);
  });
```

**./api/SomeApiService.js**
```javascript 1.7
module.exports = () => {
  return {
    getUser: () => {
      return {id: 'userId'};
    }
  };
}
```

**./service/SomeBusinessService.js**
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
