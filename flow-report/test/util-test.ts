/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {useCurrentStep} from '../util';
import {renderHook} from '@testing-library/preact-hooks';

describe('useCurrentStep', () => {
  let mockLocation: URL;

  beforeEach(() => {
    mockLocation = new URL('file:///Users/example/report.html');
    Object.defineProperty(window, 'location', {
      get: () => mockLocation,
    });
  });

  it('gets step from url', () => {
    mockLocation.searchParams.set('step', '1');
    const {result} = renderHook(() => useCurrentStep());
    expect(result.current).toEqual(1);
  });

  it('return null if step is unset', () => {
    const {result} = renderHook(() => useCurrentStep());
    expect(result.current).toBeNull();
  });

  it('throws for invalid value', () => {
    mockLocation.searchParams.set('step', 'OHNO');
    const {result} = renderHook(() => useCurrentStep());
    expect(result.error).toBeTruthy();
  });
});
