/**
 * Rue - nodejs dependency injection container
 *
 * Copyright 2017 Martin Crawford (@bemisguided)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @flow
 */
import RueError from '../../lib/utils/RueError';

describe('./util/RueError.js', () => {

  describe('new RueError()', () => {

    it('constructs a new RueError with a provided message', () => {
      // Setup
      let message = 'Hello error message';

      // Execute
      let error = new RueError(message);

      // Assert
      expect(error.message).toEqual(message);
    });

    it('constructs a new RueError and creates a stack trace', () => {
      // Execute
      let error = new RueError('');

      // Assert
      expect(error.stack).not.toBeNull();
      expect(error.stack).not.toBeUndefined();
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
      expect(error.rootError).toEqual(rootError);
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
      expect(error.details).toEqual(details);
    });

  });

});
