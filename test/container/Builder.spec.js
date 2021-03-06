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
import Builder from '../../lib/container/Builder';
import Container from '../../lib/container/Container';
import PreInjectionFilter from '../../lib/container/PreInjectionFilter';
import InjectableResolver from '../../lib/container/InjectableResolver';

describe('./container/Builder.js', () => {

  let container: Container;
  let builder: Builder;
  let name: string;

  beforeEach(() => {
    name = 'test';
    container = new Container();
    builder = new Builder(name, container);
  });

  describe('isSingleton()', () => {

    it('correctly sets the singleton property when true provided', () => {

      // Execute
      let result = builder.isSingleton(true);

      // Assert
      expect(builder.singleton).toEqual(true);
      expect(result).toEqual(builder);
    });

    it('correctly sets the singleton property when false provided', () => {

      // Execute
      let result = builder.isSingleton(false);

      // Assert
      expect(builder.singleton).toEqual(false);
      expect(result).toEqual(builder);
    });

  });

  describe('lifecyclePostInit()', () => {

    it('correctly sets the lifecycle post-construct method', () => {
      // Setup
      let expected = 'postit';

      // Execute
      let result = builder.lifecyclePostInit(expected);

      // Assert
      expect(builder.lifecycle.postInit).toEqual(expected);
      expect(result).toEqual(builder);
    });

  });

  describe('withDependencies()', () => {

    it('correctly sets the dependencies provided', () => {
      // Setup
      let dependency1 = 'dependency1';
      let dependency2 = 'dependency2';
      let dependencyNames = [dependency1, dependency2];

      // Execute
      let result = builder.withDependencies(dependency1, dependency2);

      // Assert
      expect(builder.dependencyNames).toEqual(dependencyNames);
      expect(result).toEqual(builder);
    });

    it('throws an error on duplicate dependency names', () => {
      // Setup
      let dependency1 = 'dependency1';
      let dependency2 = 'dependency2';

      // Execute
      try {
        builder.withDependencies(dependency1, dependency2, dependency1);
      } catch (error) {
        // Assert
        expect(error.message).toEqual('Dependency names cannot contain duplicates');
        return;
      }
      throw new Error('Expect an error');
    });

  });

  describe('withFilter()', () => {

    it('correctly sets the profiles provided', () => {
      // Setup
      let filter = new PreInjectionFilter();

      // Execute
      let result = builder.withFilter(filter);

      // Assert
      expect(builder.filter).toEqual(filter);
      expect(result).toEqual(builder);
    });

  });

  describe('withProfiles()', () => {

    it('correctly sets the profiles provided', () => {
      // Setup
      let profile1 = 'profile1';
      let profile2 = 'profile2';
      let profiles = [profile1, profile2];

      // Execute
      let result = builder.withProfiles(profile1, profile2);

      // Assert
      expect(builder.profileNames).toEqual(profiles);
      expect(result).toEqual(builder);
    });

  });

  describe('done()', () => {

    it('correctly sets the dependencies provided', () => {
      // Setup
      let singleton = true;
      let profile1 = 'profile1';
      let profile2 = 'profile2';
      let profiles = [profile1, profile2];
      let dependency1 = 'dependency1';
      let dependency2 = 'dependency2';
      let dependencyNames = [dependency1, dependency2];

      // Execute
      builder
        .withDependencies(dependency1, dependency2)
        .withProfiles(profile1, profile2)
        .isSingleton(singleton);

      builder.resolver = new InjectableResolver();
      builder.done();

      // Assert
      let injectableEntry = container.injectableManager.injectableEntries[0];
      expect(injectableEntry).not.toBeUndefined();
      expect(injectableEntry).not.toBeNull();
      expect(injectableEntry.name).toEqual(name);
      expect(injectableEntry.singleton).toEqual(singleton);
      expect(injectableEntry.dependencyNames).toEqual(dependencyNames);
      expect(injectableEntry.profileNames).toEqual(profiles);
    });

    it('throws an error when no resolver provided', () => {
      // Setup
      let singleton = true;
      let profile1 = 'profile1';
      let profile2 = 'profile2';
      let dependency1 = 'dependency1';
      let dependency2 = 'dependency2';

      // Execute
      builder
        .withDependencies(dependency1, dependency2)
        .withProfiles(profile1, profile2)
        .isSingleton(singleton);

      // Assert
      try {
        builder.done();
      } catch (e) {
        expect(e.message).toEqual('No module specified: name=test');
        return;
      }
      throw new Error('Expect an error');
    });

  });

});
