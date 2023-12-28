import { humanizeOrderData } from '../utils/date.js';
import { TYPE_ROUTES, YEAR_MONTH_DAY } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function listType() {
  return `
  <fieldset class="event__type-group">
    <legend class="visually-hidden">Event type</legend>
    ${TYPE_ROUTES.map((type) => `
      <div class="event__type-item">
        <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.toLowerCase()}">
        <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
      </div>
    `).join('')}
  </fieldset>
`;
}
function createTemplateOffers(offer, checkedOffers) {
  const checkedOffer = checkedOffers.map((allOffer) => allOffer.id === offer.id);
  return `
  <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${offer.id}" type="checkbox" name="event-offer-luggage" ${checkedOffer.map((isOffer) => isOffer === true ? 'checked ' : '').join('')}>
    <label class="event__offer-label" for="event-offer-luggage-${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">$${offer.price}</span>
    </label>
  </div>`;
}

function editingPoint(point, checkedOffers, offers, destinations) {
  const { typePoints, title, startDate, endDate, price } = point;
  const { description } = destinations;
  const startFormatDate = humanizeOrderData(startDate, YEAR_MONTH_DAY);
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
            ${listType()}
           </div>
         </div>

         <div class="event__field-group  event__field-group--destination">
           <label class="event__label  event__type-output" for="event-destination-1">
           ${typePoints}
           </label>
           <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${title}" list="destination-list-1">
           <datalist id="destination-list-1">
             <option value="Amsterdam"></option>
             <option value="Geneva"></option>
             <option value="Chamonix"></option>
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
             ${offers.offers.map((offer) => createTemplateOffers(offer, checkedOffers)).join('')}
           </div>
         </section>

         <section class="event__section  event__section--destination">
           <h3 class="event__section-title  event__section-title--destination">Destination</h3>
           <p class="event__destination-description">${description}</p>
         </section>
       </section>
     </form>
  </li>
  `;
}

export default class EventEditView extends AbstractView{
  #point = null;
  #checkedOffers = null;
  #destinations = null;
  #offers = null;
  #handlerCloseFormClick = null;

  constructor({point, checkedOffers, offers, destinations, onFormSubmit }) {
    super();
    this.#point = point;
    this.#checkedOffers = checkedOffers;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handlerCloseFormClick = onFormSubmit;

    this.element.querySelector('.event__save-btn').addEventListener('click', this.#onEditPointSubmit);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onEditPointSubmit);
  }

  get template() {
    return editingPoint(this.#point, this.#checkedOffers, this.#offers, this.#destinations);
  }

  #onEditPointSubmit = (evt) => {
    evt.preventDefault();
    this.#handlerCloseFormClick();
  };
}
