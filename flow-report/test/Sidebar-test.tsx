/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import fs from 'fs';
import {SidebarFlow, SidebarHeader, SidebarSummary} from '../src/sidebar';
import {render} from '@testing-library/preact';
import {LH_ROOT} from '../../root';
import {FunctionComponent} from 'preact';
import {FlowResultContext} from '../src/util';

const flowResult = JSON.parse(
  fs.readFileSync(
    `${LH_ROOT}/lighthouse-core/test/fixtures/fraggle-rock/reports/sample-lhrs.json`,
    'utf-8'
  )
);

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

describe('SidebarHeader', () => {
  it('renders title content', async () => {
    const title = 'Lighthouse flow report';
    const date = '2021-08-03T18:28:13.296Z';
    const root = render(<SidebarHeader title={title} date={date}/>, {wrapper});

    await expect(root.findByText(title)).resolves.toBeTruthy();
    await expect(root.findByText('Aug 3, 2021, 6:28 PM UTC')).resolves.toBeTruthy();
  });
});

describe('SidebarSummary', () => {
  it('highlighted by default', async () => {
    const root = render(<SidebarSummary/>, {wrapper});
    const link = await root.findByRole('link') as HTMLAnchorElement;

    expect(link.href).toEqual('file:///Users/example/report.html');
    expect(link.classList).toContain('Sidebar--current');
  });
});

describe('SidebarFlow', () => {
  it('renders flow steps', async () => {
    const root = render(<SidebarFlow/>, {wrapper});

    const navigation = await root.findByText('Navigation (1)');
    const timespan = await root.findByText('Timespan (1)');
    const snapshot = await root.findByText('Snapshot (1)');

    const links = await root.findAllByRole('link') as HTMLAnchorElement[];
    expect(links.map(a => a.textContent)).toEqual([
      navigation.textContent,
      timespan.textContent,
      snapshot.textContent,
    ]);
    expect(links.map(a => a.href)).toEqual([
      'file:///Users/example/report.html#index=0',
      'file:///Users/example/report.html#index=1',
      'file:///Users/example/report.html#index=2',
    ]);
  });

  it('no steps highlighted on summary page', async () => {
    const root = render(<SidebarFlow/>, {wrapper});

    const links = await root.findAllByRole('link');
    const highlighted = links.filter(h => h.classList.contains('Sidebar--current'));

    expect(highlighted).toHaveLength(0);
  });

  it('highlight current step', async () => {
    mockLocation.hash = '#index=1';
    const root = render(<SidebarFlow/>, {wrapper});

    const links = await root.findAllByRole('link');
    const highlighted = links.filter(h => h.classList.contains('Sidebar--current'));

    expect(highlighted).toHaveLength(1);
    expect(links[1]).toEqual(highlighted[0]);
  });
});
