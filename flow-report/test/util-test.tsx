/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import fs from 'fs';
import {FlowResultContext, useCurrentLhr} from '../util';
import {renderHook} from '@testing-library/preact-hooks';
import {LH_ROOT} from '../../root';
import {FunctionComponent} from 'preact';

const flowResult: LH.FlowResult = JSON.parse(
  fs.readFileSync(
    `${LH_ROOT}/lighthouse-core/test/fixtures/fraggle-rock/reports/sample-lhrs.json`,
    'utf-8'
  )
);

describe('useCurrentLhr', () => {
  let mockLocation: URL;
  let wrapper: FunctionComponent;

  beforeEach(() => {
    mockLocation = new URL('file:///Users/example/report.html');
    Object.defineProperty(window, 'location', {
      get: () => mockLocation,
    });
    wrapper = ({children}) => (
      <FlowResultContext.Provider value={flowResult}>{children}</FlowResultContext.Provider>
    );
  });

  it('gets current lhr index from url', () => {
    mockLocation.searchParams.set('step', '1');
    const {result} = renderHook(() => useCurrentLhr(), {wrapper});
    expect(result.current).toEqual({
      index: 1,
      value: flowResult.lhrs[1],
    });
  });

  it('return null if lhr index is unset', () => {
    const {result} = renderHook(() => useCurrentLhr(), {wrapper});
    expect(result.current).toBeNull();
  });

  it('return null if lhr index is out of bounds', () => {
    mockLocation.searchParams.set('step', '5');
    const {result} = renderHook(() => useCurrentLhr(), {wrapper});
    expect(result.current).toBeNull();
  });

  it('returns null for invalid value', () => {
    mockLocation.searchParams.set('step', 'OHNO');
    const {result} = renderHook(() => useCurrentLhr(), {wrapper});
    expect(result.current).toBeNull();
  });
});
