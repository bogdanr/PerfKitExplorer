/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @fileoverview Tests for the configService.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.application.module');
goog.require('p3rf.perfkit.explorer.components.config.ConfigService');


describe('configService', function() {
  var explorer = p3rf.perfkit.explorer;
  var svc;
  var httpBackend;

  beforeEach(module('explorer'));

  beforeEach(inject(function(configService, $httpBackend) {
        svc = configService;
        httpBackend = $httpBackend;
      }));

  it('should initialize the appropriate objects.', function() {
    expect(svc.default_project).not.toBeNull();
  });
});
