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

/* global window document location */

/** @type {preact.FunctionComponent<{lhr: LH.Result}>} */
const Report = ({lhr}) => {
  // TODO(FR-COMPAT): Render an actual report here.
  return html`
    <div>
      <h1>${lhr.finalUrl}</h1>
      ${Object.values(lhr.categories).map((category) => html`
        <h2>${category.id}: ${category.score}</h2>
      `)}
    </div>
  `;
};

/** @type {preact.FunctionComponent<{mode: LH.Gatherer.GatherMode, href: string, label: string}>} */
const SidebarFlowStep = ({href, label, mode}) => {
  return html`
    <div className="SidebarStep ${mode}">
      <a href=${href}>${label}</a>
    </div>
  `;
};

/** @type {preact.FunctionComponent<{title: string}>} */
const SidebarSection = ({children, title}) => {
  return html`
    <div className="SidebarSection">
      <div className="SidebarSection_title">${title}</div>
      <div className="SidebarSection_content">
        ${children}
      </div>
    </div>
  `;
};

/** @type {preact.FunctionComponent<{flow: LH.FlowResult, minimized: boolean}>} */
const Sidebar = ({flow}) => {
  let numNavigation = 1;
  let numTimespan = 1;
  let numSnapshot = 1;
  const links = flow.lhrs.map((lhr, index) => {
    let name = '?';
    switch (lhr.gatherMode) {
      case 'navigation':
        name = `Navigation ${numNavigation++}`;
        break;
      case 'timespan':
        name = `Timespan ${numTimespan++}`;
        break;
      case 'snapshot':
        name = `Snapshot ${numSnapshot++}`;
        break;
    }
    const url = new URL(location.href);
    url.searchParams.set('step', String(index));
    return html`
      <${SidebarFlowStep} mode=${lhr.gatherMode} href=${url.href} label=${name} />
    `;
  });
  return html`
    <div className="Sidebar">
      <${SidebarSection} title="User flow">
        ${links}
      <//>
    </div>
  `;
};

/** @type {preact.FunctionComponent<{flow: LH.FlowResult}>} */
const App = ({flow}) => {
  const searchParams = new URLSearchParams(location.search);
  const currentLhr = Number(searchParams.get('step') || 0);
  return html`
    <div className="App">
      <${Sidebar} flow=${flow}/>
      <${Report} lhr=${flow.lhrs[currentLhr]}/>
    </div>
  `;
};

// Used by standalone-flow.html
function __initLighthouseFlowReport__() {
  render(
    // @ts-expect-error
    html`<${App} flow=${window.__LIGHTHOUSE_JSON__} />`,
    // @ts-expect-error
    document.body.querySelector('main')
  );
}

// @ts-expect-error
window.__initLighthouseFlowReport__ = __initLighthouseFlowReport__;
