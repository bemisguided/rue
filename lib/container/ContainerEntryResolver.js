/**
 * @flow
 **/
export default class ContentEntryDependencyCalculator {

  target: any;

  constructor(target: any) {
    this.target = target;
  }

  resolve(...dependencies: any) {
    return this.target;
  }

}
