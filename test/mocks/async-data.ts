import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

export const getAsyncMessage = (message: string) =>
  of(`retrieved new data from external resource ${message}`).pipe(delay(1000))
