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
import {act} from 'preact/test-utils';

const flowResult: LH.FlowResult = JSON.parse(
  fs.readFileSync(
    `${LH_ROOT}/lighthouse-core/test/fixtures/fraggle-rock/reports/sample-lhrs.json`,
    'utf-8'
  )
);

describe('useCurrentLhr', () => {
  let wrapper: FunctionComponent;

  beforeEach(() => {
    window.location.hash = '';
    wrapper = ({children}) => (
      <FlowResultContext.Provider value={flowResult}>{children}</FlowResultContext.Provider>
    );
  });

  it('gets current lhr index from url', () => {
    window.location.hash = '#1';
    const {result} = renderHook(() => useCurrentLhr(), {wrapper});
    expect(result.current).toEqual({
      index: 1,
      value: flowResult.lhrs[1],
    });
  });

  it('changes on navigation', async () => {
    window.location.hash = '#1';
    const render = renderHook(() => useCurrentLhr(), {wrapper});

    expect(render.result.current).toEqual({
      index: 1,
      value: flowResult.lhrs[1],
    });

    await act(() => {
      window.location.hash = '#2';
    });
    await render.waitForNextUpdate();

    expect(render.result.current).toEqual({
      index: 2,
      value: flowResult.lhrs[2],
    });
  });

  it('return null if lhr index is unset', () => {
    const {result} = renderHook(() => useCurrentLhr(), {wrapper});
    expect(result.current).toBeNull();
  });

  it('return null if lhr index is out of bounds', () => {
    window.location.hash = '#5';
    const {result} = renderHook(() => useCurrentLhr(), {wrapper});
    expect(result.current).toBeNull();
  });

  it('returns null for invalid value', () => {
    window.location.hash = '#OHNO';
    const {result} = renderHook(() => useCurrentLhr(), {wrapper});
    expect(result.current).toBeNull();
  });
});
