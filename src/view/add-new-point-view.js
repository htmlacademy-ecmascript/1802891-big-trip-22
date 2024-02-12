import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import { FormatTime } from '../const.js';
import { humanizeOrderData } from '../utils/date.js';
import he from 'he';

import 'flatpickr/dist/flatpickr.min.css';

function createTemplateListType(type, isDisabled) {
  return `
    <div class="event__type-item">
      <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.toLowerCase()}" ${isDisabled ? 'disabled' : ''}>
      <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
    </div>`;
}

function createTemplateOffer(offer, checkedOffers, isDisabled) {
  const checkedOffer = checkedOffers?.map((allOffer) => allOffer.id === offer.id);
  return `
  <div class="event__offer-selector">
    <input class="event__offer-checkbox visually-hidden" data-id="${he.encode(offer.id)}" id="event-offer-${he.encode(offer.id)}" type="checkbox" name="event-offer-luggage" ${checkedOffer?.map((isOffer) => isOffer === true ? 'checked ' : '').join('')} ${isDisabled ? 'disabled' : ''}>
    <label class="event__offer-label" data-id="${he.encode(offer.id)}" for="event-offer-${he.encode(offer.id)}">
      <span class="event__offer-title" data-id="${he.encode(offer.id)}">${he.encode(offer.title)}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price" data-id="${he.encode(offer.id)}">$${offer.price}</span>
    </label>
  </div>`;
}

function createPicturesDestinationsTemplate(picture) {
  return `<img class="event__photo" src="${picture.src}" alt="${he.encode(picture.description)}">`;
}

function createTitleDestinationsTemplate(title, id) {
  return `<option value="${he.encode(title)}" data-id="${he.encode(id)}">${he.encode(title)}</option>`;
}

function createListEvents({ typePoint, offers, destinationId, startDate, endDate, price, offersByType, allDestinations, isDisabled, isSaving}) {
  const selectDestination = allDestinations.find((selectedDestination) => selectedDestination.id === destinationId);
  const selectType = offersByType.find((offer) => offer.type === typePoint.toLowerCase() ? offer : '');
  const checkedOffers = selectType?.offers.filter((item) => offers?.find((id) => item.id === id));
  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${typePoint.toLowerCase()}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${offersByType.map((offerType) => createTemplateListType(offerType.type, isDisabled)).join('')}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${he.encode(typePoint)}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationId !== null ? selectDestination.name : ''}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
            <datalist id="destination-list-1">
              ${allDestinations.map((selectedDestination) => createTitleDestinationsTemplate(selectedDestination.name, selectedDestination.id)).join('')}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate !== null ? startDate : ''}" ${isDisabled ? 'disabled' : ''}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate !== null ? endDate : ''}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isSaving ? 'disabled' : ''}>
            ${isSaving ? 'Saving' : 'Save'}
          </button>
          <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>Cancel</button>
        </header>
        <section class="event__details">
            <section class="event__section  event__section--offers">
              ${selectType.offers.length !== 0 ? `
                <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                <div class="event__available-offers">
                  ${selectType.offers.map((offer) => createTemplateOffer(offer, checkedOffers, isDisabled)).join('')}
                </div>
              ` : ''}
            </section>
            <section class="event__section  event__section--destination">
              ${selectDestination !== undefined ? `
                ${selectDestination.description.length !== 0 ? `
                  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                  <p class="event__destination-description">${he.encode(selectDestination.description)}</p>
                  ${selectDestination.pictures.length !== 0 ? `
                    <div class="event__photos-container">
                      <div class="event__photos-tape">
                        ${selectDestination.pictures.map((picture) => createPicturesDestinationsTemplate(picture)).join('')}
                      </div>
                    </div>` : ''}
                  ` : ''}
              ` : ''}
            </section>
        </section>
      </form>
  </li>
  `;
}


export default class addNewPointView extends AbstractStatefulView{
  #destinations = null;
  #selectDestination = null;
  #handlerSaveNewPointClick = null;
  #handlerClosePointClick = null;
  #datePicker = null;
  #newPointButton = document.querySelector('.trip-main__event-add-btn');

  constructor({offers, destinations, handlerClosePointClick, onFormSubmit }) {
    super();
    this.#destinations = destinations;
    this._setState(addNewPointView.parsePointToState(offers, destinations));
    this.#handlerClosePointClick = handlerClosePointClick;
    this.#handlerSaveNewPointClick = onFormSubmit;

    this._restoreHandlers();
  }

  get template() {
    return createListEvents(this._state);
  }

  _restoreHandlers() {
    const selectType = this._state.offersByType.find((offer) => offer.type === this._state.typePoint ? offer : '');
    this.element.querySelector('.event').addEventListener('submit', this.#onSavePointSubmit);
    this.element.querySelector('.event__type-wrapper').addEventListener('click', this.#onSelectTypePointClick);
    this.element.querySelector('.event__input').addEventListener('change', this.#onSelectDestinationsClick);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#onClosePointClick);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#onInputPriceKey);
    if (selectType.offers.length !== 0) {
      this.element.querySelector('.event__available-offers').addEventListener('change', this.#onSelectOfferClick);
    }
    this.#setStartDatePicker();
    this.#setEndDatePicker();
  }

  reset({offers, destinations}) {
    this.updateElement(
      addNewPointView.parsePointToState(offers, destinations)
    );
  }

  #selectingDestinations(name) {
    this.#selectDestination = this.#destinations.find((destination) => destination.name === name);
  }

  #onSelectTypePointClick = (evt) => {
    if (evt.target.closest('.event__type-label')) {
      this.updateElement({
        typePoint: evt.target.textContent
      });
    }
  };

  #onSelectDestinationsClick = (evt) => {
    this.#selectingDestinations(evt.target.value);
    this.updateElement({
      destinationId: this.#selectDestination ? this.#selectDestination.id : null
    });
  };

  #onInputPriceKey = (evt) => {
    this._state.price = +evt.target.value;
  };

  #onSavePointSubmit = (evt) => {
    evt.preventDefault();
    this.#handlerSaveNewPointClick(addNewPointView.parseStateToPoint(this._state));
    this.#newPointButton.disabled = false;
  };

  #onClosePointClick = (evt) => {
    evt.preventDefault();
    this.#handlerClosePointClick();
    this.#newPointButton.disabled = false;
  };

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

  #setStartDatePicker() {
    this.#datePicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        maxDate: this._state.endDate,
        defaultDate: humanizeOrderData(this._state.startDate, FormatTime.YEAR_MONTH_DAY_TIME),
        onChange: this.#onStartDateChange,
      },
    );
  }

  #setEndDatePicker() {
    this.#datePicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        minDate: this._state.startDate,
        defaultDate: humanizeOrderData(this._state.endDate, FormatTime.YEAR_MONTH_DAY_TIME),
        onChange: this.#onEndDateChange,
      },
    );
  }

  #onSelectOfferClick = (evt) => {
    const indexSelectOffer = [...this._state.offers].findIndex((id) => id === evt.target.dataset.id);
    if (indexSelectOffer === -1) {
      this._state.offers.push(evt.target.dataset.id);
      return;
    }

    this._state.offers = [...this._state.offers.slice(0,indexSelectOffer),...this._state.offers.slice(indexSelectOffer + 1)];
  };

  static parsePointToState(offers, destinations) {
    return {
      typePoint: 'flight',
      startDate: null,
      endDate: null,
      price: 0,
      destinationId: null,
      isFavourite: false,
      offers: [],
      offersByType: offers,
      allDestinations: destinations,
      isDisabled: false,
      isSaving: false,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};

    delete point.checkedOffers;
    delete point.offersByType;
    delete point.allDestinations;
    delete point.isDisabled;
    delete point.isSaving;

    return point;
  }
}
