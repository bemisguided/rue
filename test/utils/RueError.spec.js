/**
 * @flow
 */
import { beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import RueError from '../../lib/utils/RueError';

describe('RueError()', () => {

  describe('new RueError()', () => {

    it('constructs a new RueError with a provided message', () => {
      // Setup
      let message = 'Hello error message';

      // Execute
      let error = new RueError(message);

      // Assert
      expect(error.message).to.equal(message);
    });

    it('constructs a new RueError and creates a stack trace', () => {
      // Execute
      let error = new RueError('');

      // Assert
      expect(error.stack).to.not.null;
      expect(error.stack).to.not.undefined;
    });

    it('constructs a new RueError with a root error', () => {
      // Setup
      let message = 'Hello error message';
      let rootError = 'I am a root error';
      let options = {
        rootError: rootError,
      };

      // Execute
      let error = new RueError(message, options);

      // Assert
      expect(error.rootError).to.equal(rootError);
    });

    it('constructs a new RueError with details', () => {
      // Setup
      let message = 'Hello error message';
      let details = 'I am details';
      let options = {
        details: details,
      };

      // Execute
      let error = new RueError(message, options);

      // Assert
      expect(error.details).to.equal(details);
    });

  });

});
