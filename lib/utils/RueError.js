/**
 * @flow
 */
export default class RueError extends Error {

  rootError: any;
  details: any;

  constructor(message: string, options: ?Object) {
    super(message);
    this.name = 'RueError';
    if (options && options.rootError) {
      this.rootError = options.rootError;
    }
    if (options && options.details) {
      this.details = options.details;
    }
    Error.captureStackTrace(this, RueError);
  }

}
