import { concatMap, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { interval } from 'rxjs';
import clock = jasmine.clock;
import {
  concatMapResultCounter,
  mergeMapResultCounter,
  MessageTimeout,
  switchMapResultCounter
} from './mocks/async-data';

describe('test timeouts with numeric streams', () => {
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
    testResultLastStream = '';
  });

  // se resolverán todos los observables, pero en sin respetar el orden de llegada (el quien llega antes se resuelve)
  it('combine stream with mergeMap', () => {
    longStream.pipe(
      mergeMap((long: number) => shortStream.pipe(map((short: number) => `${long} : ${short}`)))
    ).subscribe((resultMap: string) => {
      testResultLastStream += resultMap;
      testCallbacks.subscribeCounter();
    });
    clock().tick(MessageTimeout);
    expect(testCallbacks.subscribeCounter).toHaveBeenCalledTimes(16); // iterationStreams * iterationStreams
    expect(testResultLastStream.trim()).toEqual(mergeMapResultCounter.trim());
  });

  // de cada iteración solo se resolverán si el ciclo corto (el interno, el segundo: longStream) no se ve interrumpido po un nuevo ciclo largo
  it('combine stream with switchMap', () => {
    longStream.pipe(
      switchMap((long: number) => shortStream.pipe(map((short: number) => `${long} : ${short}`)))
    ).subscribe((resultMap: string) => {
      testResultLastStream += resultMap;
      testCallbacks.subscribeCounter();
    });
    clock().tick(MessageTimeout);
    expect(testCallbacks.subscribeCounter).toHaveBeenCalledTimes(7); // iterationStreams * 2
    expect(testResultLastStream.trim()).toEqual(switchMapResultCounter.trim());
  });

  // se resolverán todos los observables, pero respetando los tiempos t el orden de llegada al resolver las iteraciones de cada observable.
  it('combine stream with concatMap', () => {
    longStream.pipe(
      concatMap((long: number) => shortStream.pipe(map((short: number) => `${long} : ${short}`)))
    ).subscribe((resultMap: string) => {
      testResultLastStream += resultMap;
      testCallbacks.subscribeCounter();
    });
    clock().tick(MessageTimeout);
    expect(testCallbacks.subscribeCounter).toHaveBeenCalledTimes(16); // iterationStreams * iterationStreams
    expect(testResultLastStream.trim()).toEqual(concatMapResultCounter.trim());
  });
});
