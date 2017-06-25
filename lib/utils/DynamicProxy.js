export default class DynamicProxy {

  constructor(proxiedTarget) {
    this.proxiedTarget = proxiedTarget;
  }

  static proxy(proxiedTarget) {
    return new Proxy({}, new DynamicProxy(proxiedTarget));
  }

  get(target, propKey, receiver) {
    let property = this.proxiedTarget[propKey];

    if (propKey === '_$setProxyTarget') {
      return (...args) => {
        this.proxiedTarget = args[0];
        return true;
      };
    }

    if (typeof property === 'function') {
      return (...args) => {
        return property.apply(this, args);
      };
    }

    return property;
  }

  set(target, propKey, value, receiver) {
    this.proxiedTarget[propKey] = value;
    return true;
  }

}
