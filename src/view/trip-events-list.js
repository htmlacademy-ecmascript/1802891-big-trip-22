import {createElement} from '../render.js';

function createListEvents() {
  return `
  <ul class="trip-events__list"></ul>
  `;
}


export default class TripEventsList {
  getTemplate() {
    return createListEvents();
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
