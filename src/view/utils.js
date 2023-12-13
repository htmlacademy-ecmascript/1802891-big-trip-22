import Dayjs from 'dayjs';
import { DATA_FORMAT } from './const.js';

function getRandomArrayElement(item) {
  return item[Math.floor(Math.random() * item.length)];
}
function humanizeOrderData(data, format = DATA_FORMAT){
  return data ? Dayjs(data).format(format) : '';
}


export { getRandomArrayElement, humanizeOrderData };
