import { TestScheduler } from 'rxjs/testing';
import { throttleTime } from 'rxjs/operators';
// https://rxjs.dev/guide/testing/marble-testing

const testScheduler = new TestScheduler((actual, expected) => {
  expect(actual).toEqual(expected);
});


describe('A suite is just a function', () => {
  it('generate the stream correctly', () => {
    testScheduler.run(helpers => {
      const { cold, expectObservable, expectSubscriptions } = helpers;
      const e1 =  cold('-a--b--c---|');
      const subs =     '^----------!';
      const expected = '-a-----c---|';

      expectObservable(e1.pipe(throttleTime(3, testScheduler))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
    });
  });
})
