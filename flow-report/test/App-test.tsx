/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {App} from '../App';
import {render} from '@testing-library/preact';

const flow = require('../../lighthouse-core/test/fixtures/fraggle-rock/reports/sample-lhrs.json');

it('Renders a standalone report', () => {
  const root = render(<App flow={flow}/>);
  expect(root.baseElement.outerHTML).toMatchInlineSnapshot(`"<body><div><select><option value=\\"0\\">[2021-08-03T18:28:13.296Z] [navigation] https://www.mikescerealshack.co/</option><option value=\\"1\\">[2021-08-03T18:28:31.789Z] [timespan] https://www.mikescerealshack.co/search?q=call+of+duty</option><option value=\\"2\\">[2021-08-03T18:28:36.856Z] [snapshot] https://www.mikescerealshack.co/search?q=call+of+duty</option></select><div><div><h1>https://www.mikescerealshack.co/</h1><h2>performance: 0.99</h2><h2>accessibility: 1</h2><h2>best-practices: 1</h2><h2>seo: 1</h2><h2>pwa: 0.3</h2></div></div></div></body>"`);
});
