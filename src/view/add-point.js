import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

function listType(type) {
  return `
  <fieldset class="event__type-group">
    <legend class="visually-hidden">Event type</legend>
      <div class="event__type-item">
        <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.toLowerCase()}">
        <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
      </div>
  </fieldset>`;
}

function createTemplateOffer(offer) {
  return `
  <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${offer.id}" type="checkbox" name="event-offer-luggage">
    <label class="event__offer-label" for="event-offer-luggage-${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">$${offer.price}</span>
    </label>
  </div>`;
}

function createPicturesDestinationsTemplate(picture) {
  return `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
}

function createTitleDestinationsTemplate(title, id) {
  return `<option value="${title}" data-id="${id}">${title}</option>`;
}

function createListEvents({ typePoints, destinations, startDate, endDate, offersByType, allDestinations}) {
  const selectDestinations = allDestinations.find((destination) => destination.id === destinations);
  const selectType = offersByType.find((offer) => offer.type === typePoints ? offer : '');
  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${typePoints !== null ? typePoints.toLowerCase() : 'Taxi'}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              ${offersByType.map((offerType) => listType(offerType.type)).join('')}
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${typePoints !== null ? typePoints : 'Taxi'}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinations !== null ? selectDestinations.name : ''}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${allDestinations.map((destination) => createTitleDestinationsTemplate(destination.name, destination.id)).join('')}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate !== null ? startDate : ''}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate !== null ? endDate : ''}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        </header>

        <section class="event__details">
            ${typePoints !== null ? `
              <section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>

              <div class="event__available-offers">
                ${selectType.offers.map((offer) => createTemplateOffer(offer)).join('')}
              </div>` : ''}
          </section>
          ${destinations !== null ? `
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${selectDestinations.description}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${selectDestinations.pictures.map((picture) => createPicturesDestinationsTemplate(picture))}
              </div>
            </div>
          </section>` : ''}
        </section>
      </form>
  </li>
  `;
}


export default class TripEventsListView extends AbstractStatefulView{
  #destinations = null;
  #selectDestination = null;
  #handlerCloseFormClick = null;
  #handlerClosePointClick = null;
  #datePicker = null;

  constructor({offers, destinations, handlerClosePointClick, onFormSubmit }) {
    super();
    this.#destinations = destinations;
    this._setState(TripEventsListView.parsePointToState(offers, destinations));
    this.#handlerClosePointClick = handlerClosePointClick;
    this.#handlerCloseFormClick = onFormSubmit;
    this.#setStartDatePicker();
    this.#setEndDatePicker();

    this._restoreHandlers();
  }

  get template() {
    return createListEvents(this._state);
  }

  _restoreHandlers() {
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#onEditPointSubmit);
    this.element.addEventListener('click', this.#onSelectTypePointClick);
    this.element.querySelector('.event__input').addEventListener('change', this.#onSelectDestinationsClick);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#onClosePointClick);
  }

  static parsePointToState(offers, destinations) {
    return {
      typePoints: null,
      title: null,
      startDate: null,
      endDate: null,
      price: null,
      destinations: null,
      offersByType: offers,
      allDestinations: destinations,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};

    delete point.checkedOffers;
    delete point.offersByType;
    delete point.destinations;

    return point;
  }

  reset(point) {
    this.updateElement(
      TripEventsListView.parsePointToState(point)
    );
  }

  #selectingDestinations(name) {
    this.#selectDestination = this.#destinations.find((destination) => destination.name === name);
  }

  #onSelectTypePointClick = (evt) => {
    if (evt.target.closest('.event__type-label')) {
      this.updateElement({
        typePoints: this._state.typePoints = evt.target.textContent
      });
    }
  };

  #onSelectDestinationsClick = (evt) => {
    this.#selectingDestinations(evt.target.value);
    this.updateElement({
      destinations: this._state.destinations = this.#selectDestination.id
    });
  };

  #onEditPointSubmit = (evt) => {
    evt.preventDefault();
    this.#handlerCloseFormClick();
  };

  #onClosePointClick = (evt) => {
    evt.preventDefault();
    this.#handlerClosePointClick();
  };

  #setStartDatePicker() {
    this.#datePicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'y/m/d h:i',
        enableTime: true,
        defaultDate: this._state.startDate,
        onChange: this.#onStartDateChange,
      },
    );
  }

  #setEndDatePicker() {
    this.#datePicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        //altInput: true,
        // altFormat: 'y/m/d h:i',
        dateFormat: 'y/m/d h:i',
        enableTime: true,
        defaultDate: this._state.endDate,
        onChange: this.#onEndDateChange,
      },
    );
  }

  #onStartDateChange = ([date]) => {
    this.updateElement({
      startDate: date,
    });
  };

  #onEndDateChange = ([date]) => {
    this.updateElement({
      endDate: date,
    });
  };
}
