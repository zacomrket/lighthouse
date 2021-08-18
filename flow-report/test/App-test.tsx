/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import mockHooks from './util/mock-hooks';
import fs from 'fs';
import {App} from '../App';
import {render} from '@testing-library/preact';
import {LH_ROOT} from '../../root';

const flowResult = JSON.parse(
  fs.readFileSync(
    `${LH_ROOT}/lighthouse-core/test/fixtures/fraggle-rock/reports/sample-lhrs.json`,
    'utf-8'
  )
);

beforeEach(() => {
  mockHooks.reset();
});

it('Renders a standalone report with summary', async () => {
  mockHooks.mockUseCurrentStep.mockReturnValue(null);
  const root = render(<App flowResult={flowResult}/>);

  const summary = await root.findByTestId('Summary');
  expect(summary.textContent).toEqual('SUMMARY');
});

it('Renders the navigation step', async () => {
  mockHooks.mockUseCurrentStep.mockReturnValue(0);
  const root = render(<App flowResult={flowResult}/>);

  expect(root.queryByTestId('Report')).toBeTruthy();

  const link = await root.findByText(/https:/);
  expect(link.textContent).toEqual('https://www.mikescerealshack.co/');

  const scores = root.getAllByText(/^\S+: [0-9.]+/);
  expect(scores.map(s => s.textContent)).toEqual([
    'performance: 0.99',
    'accessibility: 1',
    'best-practices: 1',
    'seo: 1',
    'pwa: 0.3',
  ]);
});

it('Renders the timespan step', async () => {
  mockHooks.mockUseCurrentStep.mockReturnValue(1);
  const root = render(<App flowResult={flowResult}/>);

  expect(root.queryByTestId('Report')).toBeTruthy();

  const link = await root.findByText(/https:/);
  expect(link.textContent).toEqual('https://www.mikescerealshack.co/search?q=call+of+duty');

  const scores = root.getAllByText(/^\S+: [0-9.]+/);
  expect(scores.map(s => s.textContent)).toEqual([
    'performance: 0.97',
    'best-practices: 0.71',
    'seo: 0',
    'pwa: 1',
  ]);
});

it('Renders the snapshot step', async () => {
  mockHooks.mockUseCurrentStep.mockReturnValue(2);
  const root = render(<App flowResult={flowResult}/>);

  expect(root.queryByTestId('Report')).toBeTruthy();

  const link = await root.findByText(/https:/);
  expect(link.textContent).toEqual('https://www.mikescerealshack.co/search?q=call+of+duty');

  const scores = root.getAllByText(/^\S+: [0-9.]+/);
  expect(scores.map(s => s.textContent)).toEqual([
    'performance: 0',
    'accessibility: 0.9',
    'best-practices: 0.88',
    'seo: 0.85',
    'pwa: 1',
  ]);
});
