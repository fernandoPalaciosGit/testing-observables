import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

export const getAsyncMessage = (message: string) =>
  of(`retrieved new data from external resource ${message}`).pipe(delay(10));

export const MessageTimeout = 999999;

export const mergeMapResultCounter =
  '0 : 0' +
  '0 : 1' +
  '0 : 2' +
  '1 : 0' +
  '0 : 3' +
  '1 : 1' +
  '1 : 2' +
  '2 : 0' +
  '1 : 3' +
  '2 : 1' +
  '2 : 2' +
  '3 : 0' +
  '2 : 3' +
  '3 : 1' +
  '3 : 2' +
  '3 : 3';

export const switchMapResultCounter =
  '0 : 0' +
  '1 : 0' +
  '2 : 0' +
  '3 : 0' +
  '3 : 1' +
  '3 : 2' +
  '3 : 3';
