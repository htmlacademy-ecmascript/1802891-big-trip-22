import { FilterType } from '../const';
import { isDateFuture, isDatePast, isDatePresent } from './date';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isDateFuture(point.startDate)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isDatePresent(point.startDate, point.endDate)),
  [FilterType.PAST]: (points) => points.filter((point) => isDatePast(point.endDate)),
};

export { filter };
