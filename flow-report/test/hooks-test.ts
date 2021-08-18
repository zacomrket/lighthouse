import {useCurrentStep} from '../hooks';
import {renderHook} from '@testing-library/preact-hooks';

describe('useCurrentStep', () => {
  let mockLocation: URL;

  beforeEach(() => {
    mockLocation = new URL('file:///Users/example/report.html');
    Object.defineProperty(window, 'location', {
      get: () => mockLocation,
    });
  });

  it('gets step from url', () => {
    mockLocation.searchParams.set('step', '1');
    const {result} = renderHook(() => useCurrentStep());
    expect(result.current).toEqual(1);
  });

  it('return null if step is unset', () => {
    const {result} = renderHook(() => useCurrentStep());
    expect(result.current).toBeNull();
  });

  it('throws for invalid value', () => {
    mockLocation.searchParams.set('step', 'OHNO');
    const {result} = renderHook(() => useCurrentStep());
    expect(result.error).toBeTruthy();
  });
});
