/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {FunctionComponent} from 'preact';
import {useMemo} from 'preact/hooks';

function getCurrentStep(): number|null {
  const searchParams = new URLSearchParams(location.search);
  const step = searchParams.get('step');
  if (step === null) return null;
  return Number(step);
}

// eslint-disable-next-line no-undef
export const Report: FunctionComponent<{lhr: LH.Result}> = ({lhr}) => {
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

export const Summary: FunctionComponent = () => {
  // TODO(FR-COMPAT): Design summary page.
  return <h1>SUMMARY</h1>;
};

export const Hbar: FunctionComponent = () => {
  return <div className="Hbar"></div>;
};

// eslint-disable-next-line no-undef
export const FlowStepIcon: FunctionComponent<{mode: LH.Gatherer.GatherMode}> = ({mode}) => {
  return <div className={`FlowStepIcon ${mode}`}></div>;
};

export const SidebarSummary: FunctionComponent = () => {
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

export const SidebarFlowStep: FunctionComponent<{
  // eslint-disable-next-line no-undef
  mode: LH.Gatherer.GatherMode,
  href: string,
  label: string,
  hideTopLine: boolean,
  hideBottomLine: boolean,
  isCurrent: boolean,
}> = ({href, label, mode, hideTopLine, hideBottomLine, isCurrent}) => {
  return (
    <a
      className={`SidebarFlowStep ${isCurrent ? 'Sidebar_current' : ''}`}
      href={href}
    >
      <div className="SidebarFlowStep_icon">
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
      <div className={`SidebarFlowStep_label ${mode}`}>{label}</div>
    </a>
  );
};

// eslint-disable-next-line no-undef
export const SidebarFlow: FunctionComponent<{flow: LH.FlowResult}> = ({flow}) => {
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
        name = `Snapshot (${numSnapshot++})`;
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
        hideTopLine={index === 0}
        hideBottomLine={index === flow.lhrs.length - 1}
        isCurrent={index === currentStep}
      />
    );
  });
  return (
    <>
      {steps}
    </>
  );
};

// eslint-disable-next-line no-undef
export const SidebarRuntimeSettings: FunctionComponent<{settings: LH.Config.Settings}> =
({settings}) => {
  return (
    <details className="SidebarRuntimeSettings">
      <summary>
        {
          `${settings.screenEmulation.height}x${settings.screenEmulation.width}px | ` +
          `${settings.formFactor}`
        }
      </summary>
      <div>Emulated user agent: {settings.emulatedUserAgent}</div>
      <div>Channel: {settings.channel}</div>
    </details>
  );
};

export const SidebarHeader: FunctionComponent<{title: string, date: string}> = ({title, date}) => {
  const formatter = useMemo(() => {
    const options:Intl.DateTimeFormatOptions = {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: 'numeric', timeZoneName: 'short',
    };
    return new Intl.DateTimeFormat('en-US', options);
  }, []);
  const dateString = useMemo(() => formatter.format(new Date(date)), [date]);
  return (
    <div className="SidebarHeader">
      <div className="SidebarHeader_title">{title}</div>
      <div className="SidebarHeader_date">{dateString}</div>
    </div>
  );
};

export const SidebarSectionTitle: FunctionComponent = ({children}) => {
  return <div className="SidebarSectionTitle">{children}</div>;
};

// eslint-disable-next-line no-undef
export const Sidebar: FunctionComponent<{flow: LH.FlowResult}> = ({flow}) => {
  return (
    <div className="Sidebar">
      <SidebarHeader title="Lighthouse User Flow Report" date={flow.lhrs[0].fetchTime}/>
      <SidebarSectionTitle>RUNTIME SETTINGS</SidebarSectionTitle>
      <Hbar/>
      <SidebarRuntimeSettings settings={flow.lhrs[0].configSettings}/>
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
export const App: FunctionComponent<{flow: LH.FlowResult}> = ({flow}) => {
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
