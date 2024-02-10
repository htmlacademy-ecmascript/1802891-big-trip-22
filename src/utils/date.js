import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { FormatTime } from '../const.js';

dayjs.extend(utc);

function humanizeOrderData(date, format = FormatTime.MONTH_DATA_FORMA) {
  return date ? dayjs.utc(date).format(format) : '';
}
/**
 * Метод для рассчета времени
 * @param {dateEnd} — дата окончания мероприятия
 * @param {dateStart} — дата начала мероприятия
 * @return {string} — возращает подсчитанное время в днях,часах,минутах
 */
function dateSubtract(dateEnd, dateStart) {
  const day = humanizeOrderData((dayjs(dateEnd).diff(dayjs(dateStart), 'day')), 'DD');
  const hour = humanizeOrderData((dayjs(dateEnd).diff(dayjs(dateStart))), FormatTime.TIME_FORMAT_H);
  const minute = humanizeOrderData((dayjs(dateEnd).diff(dayjs(dateStart))), FormatTime.TIME_FORMAT_M);
  const totalData = `${day !== '' ? `${day}D` : ''}
  ${day !== '' || hour !== '00' ? `${hour}H` : ''}
  ${day > 0 || hour > 0 || minute !== '00' ? `${minute}M` : ''}`;
  return totalData;
}

const isDateFuture = (start) => dayjs().isBefore(start);
const isDatePresent = (start, end) => dayjs().isAfter(start) && dayjs().isBefore(end);
const isDatePast = (end) => dayjs().isAfter(end);

function isDatesEqual(dateA, dateB) {
  return (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, FormatTime.YEAR_MONTH_DAY);
}

export { humanizeOrderData, dateSubtract, isDatesEqual, isDateFuture, isDatePast, isDatePresent };
