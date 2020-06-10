import { BehaviorSubject, from, of } from 'rxjs';
import { concatMap, delay, mergeMap, switchMap } from 'rxjs/operators';
import { getAsyncMessage, MessageTimeout } from './mocks/async-data';
import clock = jasmine.clock;

describe('get data from async observables', () => {
  const COUNTER = 3;
  const streamMessages = new BehaviorSubject(0);
  const testCallbacks = {
    subscribeCounter: () => {},
    getCounterRange: (length: number): number[] => [...Array(length).keys()],
    pushStreamMessage: () => {
      testCallbacks.getCounterRange(COUNTER).forEach((index: number) => {
        streamMessages.next(index);
      });
    }
  };

  beforeEach(() => {
    clock().install();
    spyOn(testCallbacks, 'subscribeCounter');
  });

  afterEach(() => {
    clock().uninstall();
  });

  it('merge with counter', () => {
    from(testCallbacks.getCounterRange(COUNTER)).pipe(
      mergeMap((value: number) => getAsyncMessage(value.toString()))
    ).subscribe((resultMap: string) => {
      expect(resultMap).toContain('retrieved new data from external resource');
      testCallbacks.subscribeCounter();
    });

    clock().tick(MessageTimeout);
    expect(testCallbacks.subscribeCounter).toHaveBeenCalledTimes(COUNTER);
  });

  it('concat with counter', () => {
    from(testCallbacks.getCounterRange(COUNTER)).pipe(
      concatMap((value: number) => getAsyncMessage(value.toString()))
    ).subscribe((resultMap: string) => {
      expect(resultMap).toContain('retrieved new data from external resource');
      testCallbacks.subscribeCounter();
    });

    clock().tick(MessageTimeout);
    expect(testCallbacks.subscribeCounter).toHaveBeenCalledTimes(COUNTER);
  });

  it('switch with counter', () => {
    let testLastStream = '';
    streamMessages.pipe(
      switchMap((value: number) => getAsyncMessage(value.toString()))
    ).subscribe((resultMap: string) => {
      testLastStream = resultMap;
      testCallbacks.subscribeCounter();
    });
    testCallbacks.pushStreamMessage(); // init stream broadcast
    clock().tick(MessageTimeout);
    expect(testCallbacks.subscribeCounter).toHaveBeenCalledTimes(1);
    expect(testLastStream).toContain('retrieved new data from external resource 2');
  });

  it('test', () => {
    let testLastStream = '';
    let counterStream = 0;
    const filters = ['brand=porsche', 'model=911', 'horsepower=389', 'color=red'];
    const activeFilters = new BehaviorSubject('');
    const getData = (params: string) => {
      return of(`retrieved new data with params ${params}`).pipe(
        delay(10)
      );
    };
    const applyFilters = () => {
      filters.forEach((filter, index) => {

        let newFilters = activeFilters.value;
        if (index === 0) {
          newFilters = `?${filter}`;
        } else {
          newFilters = `${newFilters}&${filter}`;
        }

        activeFilters.next(newFilters);
      });
    };

    activeFilters.pipe(
      switchMap(param => getData(param))
    ).subscribe(val => {
      counterStream++;
      testLastStream = val;
    });
    applyFilters();

    clock().tick(MessageTimeout);
    expect(counterStream).toEqual(1); // just subscribes once, because switchMap
    expect(testLastStream).toEqual('retrieved new data with params ?brand=porsche&model=911&horsepower=389&color=red'); // but gets all data, from last subscription
  });
});
