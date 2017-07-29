# rue
[![npm](https://img.shields.io/npm/v/rue.svg)](https://www.npmjs.com/package/rue)
[![state](https://img.shields.io/badge/state-beta-orange.svg)](https://github.com/bemisguided/rue)
[![npm](https://img.shields.io/npm/l/rue.svg)](https://github.com/bemisguided/rue)
[![node](https://img.shields.io/node/v/rue.svg)](https://github.com/bemisguided/rue)
[![David](https://img.shields.io/david/bemisguided/rue.svg)](https://github.com/bemisguided/rue)
[![Build Status](https://travis-ci.org/bemisguided/rue.svg)](https://travis-ci.org/bemisguided/rue)

**rue** a not (too) opinionated dependency injection container for nodejs  

# Overview

**rue** is a dependency injection container for nodejs that borrows concepts from
both [AngularJS](https://angularjs.com) and [Spring Framework](https://springframework.org).
At the core of **rue** is the goal to decouple configuration and application code.
One should be able to easily add **rue** to an existing project without having to greatly re-tool the main
application code.

## Features

- **Dependency injection** with minimalistic configuration

- Configuration is **decoupled and unintrusive** from application code
- **Module**, **service** and **factory** injection patterns supported

- **Singleton** and **non-singleton** patterns supported

- **Asynchronous** activation and/or deactivation of dependencies with **Promise** support

- Isolate dependencies using **activation profiles**

- Leverages ES6 Proxies to enable **swapping mocks and stubs** for testing

- Additional injection solutions with extension components (i.e. configuration via
  [rue-config](https://github.com/bemisguided/rue-config))

## Documentation

Full documentation is available at [http://ruenode.io](http://ruenode.io)
