const YEAR_MONTH_DAY = 'YYYY/M/D HH:mm';
const MONTH_DATA_FORMAT = 'MMM D';
const TIME_FORMAT_H_M = 'HH:mm';
const TIME_FORMAT_M = 'mm';
const TIME_FORMAT_H = 'HH';
const TIME_FORMAT_D = 'DD';

const POINT_COUNT = 3;

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const NoTasksTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

export { UserAction, UpdateType, MONTH_DATA_FORMAT, YEAR_MONTH_DAY, TIME_FORMAT_H_M, POINT_COUNT, TIME_FORMAT_M, TIME_FORMAT_H, TIME_FORMAT_D, SortType, FilterType, NoTasksTextType };
