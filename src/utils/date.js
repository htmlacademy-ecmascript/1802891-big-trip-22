import Dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { MONTH_DATA_FORMAT, TIME_FORMAT_M, TIME_FORMAT_H, TIME_FORMAT_D, YEAR_MONTH_DAY } from '../const.js';

Dayjs.extend(utc);

function humanizeOrderData(date, format = MONTH_DATA_FORMAT) {
  return date ? Dayjs.utc(date).format(format) : '';
}
/**
 * Метод для рассчета времени
 * @param {data} — дата окончания мероприятия
 * @param {data} — дата начала мероприятия
 * @return {string} — возращает подсчитанное время в днях,часах,минутах
 */
function dateSubtract(dateEnd, dateStart) {
  const totalData = `${humanizeOrderData((Dayjs(dateEnd).diff(Dayjs(dateStart))), TIME_FORMAT_D)}D
  ${humanizeOrderData((Dayjs(dateEnd).diff(Dayjs(dateStart))), TIME_FORMAT_H)}H
  ${humanizeOrderData((Dayjs(dateEnd).diff(Dayjs(dateStart))), TIME_FORMAT_M)}M`;
  return totalData;
}

function isDatesEqual(dateA, dateB) {
  return (dateA === null && dateB === null) || Dayjs(dateA).isSame(dateB, YEAR_MONTH_DAY);
}

export { humanizeOrderData, dateSubtract, isDatesEqual };
