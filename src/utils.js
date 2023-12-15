import Dayjs from 'dayjs';
import Flatpickr from 'flatpickr';

function getRandomArrayElement(item) {
  return item[Math.floor(Math.random() * item.length)];
}
function humanizeOrderData(data, format){
  return data ? Dayjs(data).format(format) : '';
}


export { getRandomArrayElement, humanizeOrderData };
