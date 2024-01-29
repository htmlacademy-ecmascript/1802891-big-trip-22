import { humanizeOrderData } from '../utils/date.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { YEAR_MONTH_DAY } from '../const.js';

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

function createTemplateOffer(offer, checkedOffers) {
  const checkedOffer = checkedOffers.map((allOffer) => allOffer.id === offer.id);
  return `
  <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-${offer.id}" type="checkbox" name="event-offer-luggage" ${checkedOffer.map((isOffer) => isOffer === true ? 'checked ' : '').join('')}>
    <label class="event__offer-label" for="event-offer-luggage-${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">$${offer.price}</span>
    </label>
  </div>`;
}

function createTitleDestinationsTemplate(title, id) {
  return `<option value="${title}" data-id="${id}">${title}</option>`;
}

function createPointEditComponent({typePoints, destinations, startDate, endDate, price, checkedOffers, offersByType, allDestinations}) {
  const startFormatDate = humanizeOrderData(startDate, YEAR_MONTH_DAY);
  const selectDestinations = allDestinations.find((destination) => destination.id === destinations);
  const selectOffer = offersByType.find((offer) => offer.type === typePoints ? offer : '');
  const endFormatDate = humanizeOrderData(endDate, YEAR_MONTH_DAY);
  return `
    <li class="trip-events__item">
     <form class="event event--edit" action="#" method="post">
       <header class="event__header">
         <div class="event__type-wrapper">
           <label class="event__type  event__type-btn" for="event-type-toggle-1">
             <span class="visually-hidden">Choose event type</span>
             <img class="event__type-icon" width="17" height="17" src="img/icons/${typePoints.toLowerCase()}.png" alt="Event type icon">
           </label>
           <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

           <div class="event__type-list">
            ${offersByType.map((offerType) => listType(offerType.type)).join('')}
           </div>
         </div>

         <div class="event__field-group  event__field-group--destination">
           <label class="event__label  event__type-output" for="event-destination-1">
            ${typePoints}
           </label>
           <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${selectDestinations.name}" list="destination-list-1">
           <datalist id="destination-list-1">
            ${allDestinations.map((destination) => createTitleDestinationsTemplate(destination.name, destination.id)).join('')}
           </datalist>
         </div>

         <div class="event__field-group  event__field-group--time">
           <label class="visually-hidden" for="event-start-time-1">From</label>
           <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startFormatDate}">
           &mdash;
           <label class="visually-hidden" for="event-end-time-1">To</label>
           <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endFormatDate}">
         </div>

         <div class="event__field-group  event__field-group--price">
           <label class="event__label" for="event-price-1">
             <span class="visually-hidden">Price</span>
             &euro;
           </label>
           <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
         </div>

         <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
         <button class="event__reset-btn" type="reset">Delete</button>
         <button class="event__rollup-btn" type="button">
           <span class="visually-hidden">Open event</span>
         </button>
       </header>
       <section class="event__details">
         <section class="event__section  event__section--offers">
           <h3 class="event__section-title  event__section-title--offers">Offers</h3>

           <div class="event__available-offers">
             ${selectOffer.offers.map((offer) => createTemplateOffer(offer, checkedOffers)).join('')}
           </div>
         </section>

         ${destinations !== null ? `
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${selectDestinations.description}</p>
          </section>` : ''}

       </section>
     </form>
  </li>
  `;
}

export default class EventEditView extends AbstractStatefulView {
  #handlerSaveFormClick = null;
  #destinations = null;
  #selectDestination = null;
  #handlerCloseFormClick = null;

  constructor({point, checkedOffers, offers, destinations, onFormSubmit, onCloseEditClick }) {
    super();
    this.#destinations = destinations;
    this._setState(EventEditView.parsePointToState(point, checkedOffers, offers, destinations));
    this.#handlerSaveFormClick = onFormSubmit;
    this.#handlerCloseFormClick = onCloseEditClick;

    this._restoreHandlers();
  }

  get template() {
    return createPointEditComponent(this._state);
  }

  _restoreHandlers() {
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#onEditPointSubmit);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onClosePointClick);
    this.element.addEventListener('click', this.#onSelectTypePointClick);
    this.element.querySelector('.event__input').addEventListener('change', this.#onSelectDestinationsClick);
  }

  static parsePointToState(point, checkedOffers, offers, destinations) {
    return {...point,
      checkedOffers: checkedOffers,
      offersByType: offers,
      allDestinations: destinations,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};

    delete point.checkedOffers;
    delete point.offersByType;
    delete point.allDestinations;

    return point;
  }

  reset(point) {
    this.updateElement(
      EventEditView.parsePointToState(point)
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
    this.#handlerSaveFormClick();
  };

  #onClosePointClick = (evt) => {
    evt.preventDefault();
    this.#handlerCloseFormClick();
  };
}
