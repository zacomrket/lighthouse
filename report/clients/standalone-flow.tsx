/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @fileoverview The entry point for rendering the Lighthouse report for the HTML file created by ReportGenerator.
 * The renderer code is bundled and injected into the report HTML along with the JSON report.
 */

import {render, FunctionComponent} from 'preact';

/* global window document location */

function getCurrentStep():number|null {
  const searchParams = new URLSearchParams(location.search);
  const step = searchParams.get('step');
  if (step === null) return null;
  return Number(step);
}

// eslint-disable-next-line no-undef
const Report:FunctionComponent<{lhr: LH.Result}> = ({lhr}) => {
  // TODO(FR-COMPAT): Render an actual report here.
  return (
    <div>
      <h1>{lhr.finalUrl}</h1>
      {
        Object.values(lhr.categories).map((category) =>
          <h2 key={category.id}>{category.id}: {category.score}</h2>
        )
      }
    </div>
  );
};

const Summary:FunctionComponent = () => {
  // TODO(FR-COMPAT): Design summary page.
  return <h1>SUMMARY</h1>;
};

const Hbar:FunctionComponent = () => {
  return <div className="Hbar"></div>;
};

// eslint-disable-next-line no-undef
const FlowStepIcon:FunctionComponent<{mode: LH.Gatherer.GatherMode}> = ({mode}) => {
  return <div className={`FlowStepIcon ${mode}`}></div>;
};

const SidebarSummary:FunctionComponent = () => {
  const currentStep = getCurrentStep();
  const url = new URL(location.href);
  url.searchParams.delete('step');
  return (
    <a
      href={url.href}
      className={`SidebarSummary ${currentStep === null ? 'Sidebar_current' : ''}`}
    >
      <div className="SidebarSummary_icon">☰</div>
      <div className="SidebarSummary_label">Summary</div>
    </a>
  );
};

const SidebarFlowStep:FunctionComponent<{
  // eslint-disable-next-line no-undef
  mode: LH.Gatherer.GatherMode,
  href: string,
  label: string,
  hideTopLine: boolean,
  hideBottomLine: boolean,
  row: number,
  current: boolean,
}> = ({href, label, mode, row, hideTopLine, hideBottomLine, current}) => {
  return (
    <>
      <a
        className={`SidebarFlowStep_link ${current ? 'Sidebar_current' : ''}`}
        href={href} style={{gridRow: row}}
      />
      <div className="SidebarFlowStep_icon" style={{gridRow: row}}>
        <div
          className="SidebarFlowStep_icon_line"
          style={hideTopLine ? {background: 'transparent'} : undefined}
        />
        <FlowStepIcon mode={mode}/>
        <div
          className="SidebarFlowStep_icon_line"
          style={hideBottomLine ? {background: 'transparent'} : undefined}
        />
      </div>
      <div className={`SidebarFlowStep_label ${mode}`} style={{gridRow: row}}>{label}</div>
    </>
  );
};

// eslint-disable-next-line no-undef
const SidebarFlow:FunctionComponent<{flow: LH.FlowResult}> = ({flow}) => {
  let numNavigation = 1;
  let numTimespan = 1;
  let numSnapshot = 1;
  const steps = flow.lhrs.map((lhr, index) => {
    let name = '?';
    switch (lhr.gatherMode) {
      case 'navigation':
        name = `Navigation (${numNavigation++})`;
        break;
      case 'timespan':
        name = `Timespan (${numTimespan++})`;
        break;
      case 'snapshot':
        name = `Snapshot (${numSnapshot++}}`;
        break;
    }
    const url = new URL(location.href);
    url.searchParams.set('step', String(index));
    const currentStep = getCurrentStep();
    return (
      <SidebarFlowStep
        key={lhr.fetchTime}
        mode={lhr.gatherMode}
        href={url.href}
        label={name}
        row={index + 1}
        hideTopLine={index === 0}
        hideBottomLine={index === flow.lhrs.length - 1}
        current={index === currentStep}
      />
    );
  });
  return (
    <div className="SidebarFlow">
      {steps}
    </div>
  );
};

const SidebarTitle:FunctionComponent = ({children}) => {
  return <div className="SidebarTitle">{children}</div>;
};

const SidebarSectionTitle:FunctionComponent = ({children}) => {
  return <div className="SidebarSectionTitle">{children}</div>;
};

// eslint-disable-next-line no-undef
const Sidebar:FunctionComponent<{flow: LH.FlowResult}> = ({flow}) => {
  return (
    <div className="Sidebar">
      <SidebarTitle>Lighthouse User Flow Report</SidebarTitle>
      <Hbar/>
      <SidebarSectionTitle>USER FLOW</SidebarSectionTitle>
      <Hbar/>
      <SidebarSummary/>
      <Hbar/>
      <SidebarFlow flow={flow}/>
    </div>
  );
};

// eslint-disable-next-line no-undef
const App:FunctionComponent<{flow: LH.FlowResult}> = ({flow}) => {
  const currentStep = getCurrentStep();
  // TODO: Remove this, just want to see multiple navigations strung together.
  flow.lhrs = flow.lhrs.concat(
    // Unique ID
    flow.lhrs.map(lhr => ({...lhr, fetchTime: lhr.fetchTime.concat('###')}))
  );
  return (
    <div className="App">
      <Sidebar flow={flow}/>
      {
        currentStep === null ?
          <Summary/> :
          <Report lhr={flow.lhrs[currentStep]}/>
      }
    </div>
  );
};

// Used by standalone-flow.html
function __initLighthouseFlowReport__() {
  render(
    // @ts-expect-error
    <App flow={window.__LIGHTHOUSE_JSON__} />,
    // @ts-expect-error
    document.body.querySelector('main')
  );
}

// @ts-expect-error
window.__initLighthouseFlowReport__ = __initLighthouseFlowReport__;
