import * as RxOperators from 'rxjs/operators';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { getAsyncMessage } from './mocks/async-data';

describe('get data from async observables', () => {
  const COUNTER = 3;
  const testCallbacks = {
    subscribeCounter: () => {},
    getCounterRange: (length: number): number[] => [...Array(length).keys()]
  };

  beforeEach(() => {
    spyOn(RxOperators, 'delay').and.returnValue((value: any) => value);
    spyOn(testCallbacks, 'subscribeCounter');
  });

  it('merge with counter', (done) => {
    from(testCallbacks.getCounterRange(COUNTER)).pipe(
      mergeMap((value: number) => getAsyncMessage(value.toString()))
    ).subscribe((resultMap: string) => {
      expect(resultMap).toContain('retrieved new data from external resource');
      testCallbacks.subscribeCounter();
      done();
    });
    expect(testCallbacks.subscribeCounter).toHaveBeenCalledTimes(COUNTER);
  });
});
