import { humanizeOrderData } from '../utils/date.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { FormatTime } from '../const.js';
import flatpickr from 'flatpickr';
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
  return `<option value="${title}" data-id="${id}">${title}</option>`;
}

function createPointEditComponent({typePoint, destinationId, offers, startDate, endDate, price, offersByType, allDestinations, isDeleting, isDisabled, isSaving}) {
  const startFormatDate = humanizeOrderData(startDate, FormatTime.YEAR_MONTH_DAY_TIME);
  const selectDestination = allDestinations.find((destination) => destination.id === destinationId);
  const selectType = offersByType.find((offer) => offer.type === typePoint ? offer : '');
  const checkedOffers = selectType?.offers.filter((item) => offers.find((id) => item.id === id));
  const endFormatDate = humanizeOrderData(endDate, FormatTime.YEAR_MONTH_DAY_TIME);
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
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${selectDestination !== undefined ? selectDestination.name : ''}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
            <datalist id="destination-list-1">
              ${allDestinations.map((destination) => createTitleDestinationsTemplate(destination.name, destination.id)).join('')}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${he.encode(startFormatDate)}" ${isDisabled ? 'disabled' : ''}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${he.encode(endFormatDate)}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price ? price : ''}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isSaving ? 'disabled' : ''}>
            ${isSaving ? 'Saving' : 'Save'}
          </button>
          <button class="event__reset-btn" type="reset" ${isDeleting ? 'disabled' : ''}>
            ${isDeleting ? 'Deleting' : 'Delete'}
          </button>
          <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${selectType.offers.length !== 0 ? `
            <section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>
              <div class="event__available-offers">
                ${selectType.offers.map((offer) => createTemplateOffer(offer, checkedOffers, isDisabled)).join('')}
              </div>
            </section>` : ''}

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

export default class EditPointView extends AbstractStatefulView {
  #handlerSaveFormClick = null;
  #destinations = null;
  #selectDestination = null;
  #handlerCloseFormClick = null;
  #handelDeletePointSubmit = null;

  #datePicker = null;

  constructor({point, allOffers, destinations, onFormSubmit, onCloseEditClick, onDeletePointSubmit }) {
    super();
    this.#destinations = destinations;
    this._setState(EditPointView.parsePointToState(point, allOffers, destinations));
    this.#handlerSaveFormClick = onFormSubmit;
    this.#handlerCloseFormClick = onCloseEditClick;
    this.#handelDeletePointSubmit = onDeletePointSubmit;


    this._restoreHandlers();
  }

  get template() {
    return createPointEditComponent(this._state);
  }

  _restoreHandlers() {
    const selectType = this._state.offersByType.find((offer) => offer.type === this._state.typePoint ? offer : '');
    this.element.querySelector('.event').addEventListener('submit', this.#onSaveEditPointSubmit);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#onDeletePointSubmit);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onClosePointClick);
    this.element.querySelector('.event__type-wrapper').addEventListener('click', this.#onSelectTypePointClick);
    this.element.querySelector('.event__input').addEventListener('change', this.#onSelectDestinationsClick);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#onInputPriceKey);
    if (selectType.offers.length !== 0) {
      this.element.querySelector('.event__available-offers').addEventListener('change', this.#onSelectOfferClick);
    }
    this.#setStartDatePicker();
    this.#setEndDatePicker();
  }

  reset({point, offers, destinations}) {
    this.updateElement(
      EditPointView.parsePointToState(point, offers, destinations)
    );
  }

  removeElement() {
    super.removeElement();

    if (this.#datePicker) {
      this.#datePicker.destroy();
      this.#datePicker = null;
    }
  }

  #selectingDestinations(name) {
    this.#selectDestination = this.#destinations.find((destination) => destination.name === name);
  }

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

  #onSelectTypePointClick = (evt) => {
    if (evt.target.closest('.event__type-label')) {
      this.updateElement({
        typePoint: evt.target.textContent,
        offers: []
      });
    }
  };

  #onSelectDestinationsClick = (evt) => {
    this.#selectingDestinations(evt.target.value);
    this.updateElement({
      destinationId: this.#selectDestination !== undefined ? this.#selectDestination.id : null
    });
  };

  #onSelectOfferClick = (evt) => {
    const indexSelectOffer = [...this._state.offers].findIndex((id) => id === evt.target.dataset.id);
    if (indexSelectOffer === -1) {
      this._state.offers.push(evt.target.dataset.id);
      return;
    }

    this._state.offers = [...this._state.offers.slice(0,indexSelectOffer),...this._state.offers.slice(indexSelectOffer + 1)];
  };

  #onInputPriceKey = (evt) => {
    this._state.price = +evt.target.value;
  };

  #onSaveEditPointSubmit = (evt) => {
    evt.preventDefault();
    this.#handlerSaveFormClick(EditPointView.parseStateToPoint(this._state));
  };

  #onDeletePointSubmit = (evt) => {
    evt.preventDefault();
    this.#handelDeletePointSubmit(EditPointView.parseStateToPoint(this._state));
  };

  #onClosePointClick = () => {
    this.#handlerCloseFormClick();
  };

  static parsePointToState(point, offers, destinations) {
    return {...point,
      offersByType: offers,
      allDestinations: destinations,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};

    delete point.offersByType;
    delete point.allDestinations;
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }
}
