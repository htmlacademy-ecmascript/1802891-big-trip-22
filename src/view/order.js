import {createElement} from '../render.js';
import { humanizeOrderData } from './utils.js';
import { DATA_FORMAT, TIME_FORMAT } from './const.js';

function createOrderTemplate(order) {
  const {dueData, typeOrders, title, startTime, endTime, price, services, isFavourite} = order;
  const data = humanizeOrderData(dueData);
  const sTime = humanizeOrderData(startTime, TIME_FORMAT);
  const eTime = humanizeOrderData(endTime, TIME_FORMAT);
  //const totalTime = parseFloat(eTime.replace(':', '.')) - parseFloat(sTime.replace(':', '.'));
  //console.log(parseFloat(sTime.replace(':', '.')), parseFloat(eTime.replace(':', '.')));
  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dueData}">${data}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${typeOrders}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${typeOrders} ${title}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startTime}">${sTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${endTime}">${eTime}</time>
          </p>
          <p class="event__duration">30</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          <li class="event__offer">
            <span class="event__offer-title">Order Uber</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">20</span>
          </li>
        </ul>
        <button class="event__favorite-btn ${isFavourite ? 'event__favorite-btn--active' : ''}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `;
}

export default class TripEvents {
  constructor({order}) {
    this.order = order;
  }

  getTemplate() {
    return createOrderTemplate(this.order);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
