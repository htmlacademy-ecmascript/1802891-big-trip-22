import { humanizeOrderData } from '../utils.js';
import { MONTH_DATA_FORMAT, TIME_FORMAT, YEAR_MONTH_DAY } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createTemplateOffer(offer) {
  return `
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.id}</span>
    </li>
  `;
}


function createOrderTemplate(point, offers, destination) {
  const {typePoints, title, startData, endData, price, isFavourite} = point;
  const dataFormat = humanizeOrderData(startData, MONTH_DATA_FORMAT);
  const formatStartTime = humanizeOrderData(startData, TIME_FORMAT);
  const formatEndTime = humanizeOrderData(endData, TIME_FORMAT);

  const totalTime = humanizeOrderData((endData - startData), YEAR_MONTH_DAY);

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${startData}">${dataFormat}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${typePoints.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${typePoints} ${title}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startData}">${formatStartTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${endData}">${formatEndTime}</time>
          </p>
          <p class="event__duration">${totalTime}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offers.map((offer) => createTemplateOffer(offer)).join('')}
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

export default class PointComponent extends AbstractView{
  #point = null;
  #checkedOffers = null;
  #destinations = null;

  constructor({point, checkedOffers, destinations}) {
    super();
    this.#point = point;
    this.#checkedOffers = checkedOffers;
    this.#destinations = destinations;
  }

  get template() {
    return createOrderTemplate(this.#point, this.#checkedOffers, this.#destinations);
  }
}
