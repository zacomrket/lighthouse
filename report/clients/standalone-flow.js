/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
  * @fileoverview The entry point for rendering the Lighthouse report for the HTML
  * file created by ReportGenerator.
  * The renderer code is bundled and injected into the report HTML along with the JSON report.
  */

import {render} from 'preact';
import {html} from 'htm/preact';
import {useEffect, useRef, useState, useMemo} from 'preact/hooks';
import {DOM} from '../renderer/dom';
import {ReportRenderer} from '../renderer/report-renderer';

/* global window document */

/** @type {preact.FunctionComponent<{lhr: LH.Result, hidden: boolean}>} */
const Report = ({lhr, hidden}) => {
  const root = useRef(/** @type {HTMLDivElement|null} */ (null));
  const renderer = useMemo(() => {
    const dom = new DOM(document, false);
    return new ReportRenderer(dom);
  }, []);
  useEffect(() => {
    if (root.current) {
      renderer.renderReport(lhr, root.current);
    }
  }, [root.current]);
  return html`
    <div ref=${root} hidden=${hidden}/>
  `;
};

/** @type {preact.FunctionComponent<{flow: LH.FlowResult}>} */
const App = ({flow}) => {
  const [currentLhr, setCurrentLhr] = useState(0);
  console.log(flow);
  return html`
    <select onInput=${/** @param {any} e */ e => setCurrentLhr(Number(e.target.value))}>
      ${flow.lhrs.map((lhr, i) => html`
        <option key=${i} value=${i}>(${lhr.gatherMode}) ${lhr.finalUrl}</option>
      `)}
    </select>
    <div>
      ${flow.lhrs.map((lhr, i) => html`
        <${Report} key=${i} hidden=${currentLhr !== i} lhr=${lhr}/>
      `)}
    </div>
  `;
};

// Used by standalone-flow.html
function __initLighthouseFlowReport__() {
  render(
    // @ts-expect-error
    html`<${App} flow=${window.__LIGHTHOUSE_JSON__} />`,
    document.body.querySelector('main')
  );
}

// @ts-expect-error
window.__initLighthouseFlowReport__ = __initLighthouseFlowReport__;
