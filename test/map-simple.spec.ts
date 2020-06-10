import { map, concatAll, toArray, filter } from 'rxjs/operators';
import { Car, cars } from './mocks/cold-data';

describe('transform streams by mapping', () => {

  describe('transform data by map() operator', () => {
    describe('should stringify data', () => {
      const expected = (resultMap: string[]) => {
        expect(resultMap).toEqual(['porsche 911', 'porsche macan']);
      };

      it('map(Array)', () => {
        cars.pipe(
          map((carList: Car[]) => carList.map((car: Car) => `${car.brand} ${car.model}`))
        ).subscribe(expected);
      });

      it('flat map + to array', () => {
        cars.pipe(
          concatAll(),
          map((car: Car) => `${car.brand} ${car.model}`),
          toArray()
        ).subscribe(expected);
      });

      it('flat map + filter + to array', () => {
        cars.pipe(
          concatAll(),
          filter((car: Car) => car.model === 'macan'),
          map((car: Car) => `${car.brand} ${car.model}`),
        ).subscribe((resultMap: string) => expect(resultMap).toEqual('porsche macan'));
      });
    });
  });
});
