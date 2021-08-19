import {FunctionComponent} from 'preact';
import {classNames, useCurrentLhr, useFlowResult} from '../util';

const FlowStepIcon: FunctionComponent<{mode: LH.Gatherer.GatherMode}> = ({mode}) => {
  return <div className={`FlowStepIcon FlowStepIcon--${mode}`}></div>;
};

const SidebarFlowStep: FunctionComponent<{
  mode: LH.Gatherer.GatherMode,
  href: string,
  label: string,
  hideTopLine: boolean,
  hideBottomLine: boolean,
  isCurrent: boolean,
}> = ({href, label, mode, hideTopLine, hideBottomLine, isCurrent}) => {
  return (
    <a
      className={classNames('SidebarFlowStep', {'Sidebar--current': isCurrent})}
      href={href}
    >
      <div className="SidebarFlowStep__icon">
        <div
          className="SidebarFlowStep__icon--line"
          style={hideTopLine ? {background: 'transparent'} : undefined}
        />
        <FlowStepIcon mode={mode}/>
        <div
          className="SidebarFlowStep__icon--line"
          style={hideBottomLine ? {background: 'transparent'} : undefined}
        />
      </div>
      <div className={`SidebarFlowStep__label SidebarFlowStep__label--${mode}`}>{label}</div>
    </a>
  );
};

export const SidebarFlow: FunctionComponent = () => {
  const flowResult = useFlowResult();
  const currentLhr = useCurrentLhr();

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
    url.hash = `#index=${index}`;
    return (
      <SidebarFlowStep
        key={lhr.fetchTime}
        mode={lhr.gatherMode}
        href={url.href}
        label={name}
        hideTopLine={index === 0}
        hideBottomLine={index === flowResult.lhrs.length - 1}
        isCurrent={index === (currentLhr && currentLhr.index)}
      />
    );
  });
  return (
    <>
      {steps}
    </>
  );
};
