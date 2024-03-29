import { humanizeOrderData, dateSubtract } from '../utils/date.js';
import { FormatTime } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createTemplateOffer(offer) {
  return `
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>
  `;
}


function createOrderTemplate(point, offers, destination) {
  const {typePoint, startDate, endDate, price, isFavourite} = point;
  const formatStartTime = humanizeOrderData(startDate, FormatTime.TIME_FORMAT_H_M);
  const formatEndTime = humanizeOrderData(endDate, FormatTime.TIME_FORMAT_H_M);

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${startDate !== null ? startDate : ''}">${humanizeOrderData(startDate)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${typePoint.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${typePoint} ${destination !== null ? destination.name : ''}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startDate !== null ? startDate : ''}">${formatStartTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${endDate !== null ? endDate : ''}">${formatEndTime}</time>
          </p>
          <p class="event__duration">${dateSubtract(endDate, startDate)}</p>
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

export default class PointView extends AbstractView{
  #point = null;
  #checkedOffers = null;
  #destination = null;
  #handlerEditClick = null;
  #handlerChangeFavoriteClick = null;

  constructor({point, checkedOffers, destination, onEditPointClick, onFavoriteChangeClick}) {
    super();
    this.#point = point;
    this.#checkedOffers = checkedOffers;
    this.#destination = destination;
    this.#handlerEditClick = onEditPointClick;
    this.#handlerChangeFavoriteClick = onFavoriteChangeClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onEditPointClick);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#onFavoriteChangeClick);
  }

  get template() {
    return createOrderTemplate(this.#point, this.#checkedOffers, this.#destination);
  }

  #onEditPointClick = (evt) => {
    evt.preventDefault();
    this.#handlerEditClick();
  };

  #onFavoriteChangeClick = (evt) => {
    evt.preventDefault();
    this.#handlerChangeFavoriteClick();
  };


}
