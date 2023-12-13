import {createElement} from '../render.js';
import { humanizeOrderData } from './utils.js';
import { typeRoutes, TIME_FORMAT } from './const.js';

function selectType() {
  return `
  <fieldset class="event__type-group">
    <legend class="visually-hidden">Event type</legend>
    ${typeRoutes.map((type) => `
      <div class="event__type-item">
        <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.toLowerCase()}">
        <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
      </div>
    `).join('')}
  </fieldset>
`;
}

function editingEvent(order) {
  const { dueData, title, startTime, endTime, typeOrders, price, offers } = order;
  const data = humanizeOrderData(dueData);
  const sTime = humanizeOrderData(startTime, TIME_FORMAT);
  const eTime = humanizeOrderData(endTime, TIME_FORMAT);
  return `
    <li class="trip-events__item">
     <form class="event event--edit" action="#" method="post">
       <header class="event__header">
         <div class="event__type-wrapper">
           <label class="event__type  event__type-btn" for="event-type-toggle-1">
             <span class="visually-hidden">Choose event type</span>
             <img class="event__type-icon" width="17" height="17" src="img/icons/${typeOrders}.png" alt="Event type icon">
           </label>
           <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

           <div class="event__type-list">
            ${selectType()}
           </div>
         </div>

         <div class="event__field-group  event__field-group--destination">
           <label class="event__label  event__type-output" for="event-destination-1">
           ${typeOrders}
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
           <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${data} ${sTime}">
           &mdash;
           <label class="visually-hidden" for="event-end-time-1">To</label>
           <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${data} ${eTime}">
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
             <div class="event__offer-selector">
               <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" ${offers[0].isActive ? 'checked' : ''}>
               <label class="event__offer-label" for="event-offer-luggage-1">
                 <span class="event__offer-title">${offers[0].title}</span>
                 &plus;&euro;&nbsp;
                 <span class="event__offer-price">${offers[0].price}</span>
               </label>
             </div>
           </div>
         </section>

         <section class="event__section  event__section--destination">
           <h3 class="event__section-title  event__section-title--destination">Destination</h3>
           <p class="event__destination-description">Chamonix-Mont-Blanc (usually shortened to Chamonix) is a resort area near the junction of France, Switzerland and Italy. At the base of Mont Blanc, the highest summit in the Alps, it's renowned for its skiing.</p>
         </section>
       </section>
     </form>
  </li>
  `;
}

export default class EventEdit {
  constructor({order}) {
    this.order = order;
  }

  getTemplate() {
    return editingEvent(this.order);
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
