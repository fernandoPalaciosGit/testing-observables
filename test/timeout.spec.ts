import { map, mergeMap, take, timeout } from 'rxjs/operators';
import { interval } from 'rxjs';
import clock = jasmine.clock;
import { mergeMapResultCounter, MessageTimeout } from './mocks/async-data';

describe('test tiemouts with numeric streams', () => {
  let testResultLastStream = '';
  const testCallbacks = {
    subscribeCounter: () => {}
  };
  const iterationStreams = 4;
  const longStream = interval(1000).pipe(take(iterationStreams));
  const shortStream = interval(500).pipe(take(iterationStreams));

  beforeEach(() => {
    clock().install();
    spyOn(testCallbacks, 'subscribeCounter');
  });

  afterEach(() => {
    clock().uninstall();
  });

  // se resolverán todos los observables, pero en sin respetar el orden de llegada (el quien llega antes se resuelve)
  it('combine stream with merge map', () => {
    longStream.pipe(
      mergeMap((long: number) => shortStream.pipe(map((short: number) => `${long} : ${short}`)))
    ).subscribe((resultMap: string) => {
      testResultLastStream += resultMap;
      testCallbacks.subscribeCounter();
    });
    clock().tick(MessageTimeout);
    expect(testCallbacks.subscribeCounter).toHaveBeenCalledTimes(iterationStreams * iterationStreams);
    expect(testResultLastStream.trim()).toEqual(mergeMapResultCounter.trim());
  });
});


