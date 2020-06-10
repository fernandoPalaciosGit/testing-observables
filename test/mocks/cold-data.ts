import { Observable, of } from 'rxjs';

export interface Car {
  brand: string;
  model: string
}

export const cars: Observable<Car[]> = of([
  {
    brand: 'porsche',
    model: '911'
  },
  {
    brand: 'porsche',
    model: 'macan'
  }
]);
