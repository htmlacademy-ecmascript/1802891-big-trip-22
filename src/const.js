const FormatTime = {
  YEAR_MONTH_DAY: 'YYYY/M/D HH:mm',
  YEAR_MONTH_DAY_TIME: 'D/M/YY HH:mm',
  MONTH_DATA_FORMA: 'MMM D',
  TIME_FORMAT_H_M: 'HH:mm',
  TIME_FORMAT_M: 'mm',
  TIME_FORMAT_H: 'HH',
  TIME_FORMAT_D: 'DD',
  TIME_FORMAT_MMM: 'MMM',
  TIME_FORMAT_MMM_DD: 'DD MMM',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const CountPoint = {
  THREE: 3,
  TWO: 2,
  ONE: 1,
  ZERO: 0,
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

export { UserAction, UpdateType, FormatTime, SortType, FilterType, NoTasksTextType, CountPoint};
