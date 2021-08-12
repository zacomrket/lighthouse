import Result from '../../types/lhr';

declare global {
  interface Window {
    __LIGHTHOUSE_JSON__: Result.FlowResult;
    __initLighthouseFlowReport__: () => void;
  }
}

export {};
