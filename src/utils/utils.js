import Dayjs from 'dayjs';
import Flatpickr from 'flatpickr';

function humanizeOrderData(data, format){
  return data ? Dayjs(data).format(format) : '';
}

function dateSubtract(dateEnd, dateStart, format) {
  //const totalData = (Dayjs(dateEnd).subtract(dateStart, format)).startOf(format);
  const totalData = humanizeOrderData((Dayjs(dateEnd).diff(Dayjs(dateStart))), format);
  return totalData;
}

export { humanizeOrderData, dateSubtract };
