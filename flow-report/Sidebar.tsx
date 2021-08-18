/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {FunctionComponent} from 'preact';
import {useMemo} from 'preact/hooks';
import {useCurrentStep} from './hooks';

export const Separator: FunctionComponent = () => {
  return <div className="Separator" role="separator"></div>;
};

export const FlowStepIcon: FunctionComponent<{mode: LH.Gatherer.GatherMode}> = ({mode}) => {
  return <div className={`FlowStepIcon ${mode}`}></div>;
};

export const SidebarSummary: FunctionComponent = () => {
  const currentStep = useCurrentStep();
  const url = new URL(location.href);
  url.searchParams.delete('step');
  return (
    <a
      href={url.href}
      className={`SidebarSummary ${currentStep === null ? 'Sidebar_current' : ''}`}
      data-testid="SidebarSummary"
    >
      <div className="SidebarSummary_icon"></div>
      <div className="SidebarSummary_label">Summary</div>
    </a>
  );
};

export const SidebarFlowStep: FunctionComponent<{
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

export const SidebarFlow: FunctionComponent<{flowResult: LH.FlowResult}> = ({flowResult}) => {
  let numNavigation = 1;
  let numTimespan = 1;
  let numSnapshot = 1;
  const steps = flowResult.lhrs.map((lhr, index) => {
    let name;
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
    const currentStep = useCurrentStep();
    return (
      <SidebarFlowStep
        key={lhr.fetchTime}
        mode={lhr.gatherMode}
        href={url.href}
        label={name}
        hideTopLine={index === 0}
        hideBottomLine={index === flowResult.lhrs.length - 1}
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

export const Sidebar: FunctionComponent<{flowResult: LH.FlowResult}> = ({flowResult}) => {
  return (
    <div className="Sidebar">
      <SidebarHeader title="Lighthouse User Flow Report" date={flowResult.lhrs[0].fetchTime}/>
      <SidebarSectionTitle>RUNTIME SETTINGS</SidebarSectionTitle>
      <Separator/>
      <SidebarRuntimeSettings settings={flowResult.lhrs[0].configSettings}/>
      <Separator/>
      <SidebarSectionTitle>USER FLOW</SidebarSectionTitle>
      <Separator/>
      <SidebarSummary/>
      <Separator/>
      <SidebarFlow flowResult={flowResult}/>
    </div>
  );
};
