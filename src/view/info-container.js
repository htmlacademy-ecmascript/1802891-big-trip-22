import {createElement} from '../render.js';

function createContainer() {
  return `
    <section class="trip-main__trip-info  trip-info"></section>
  `;
}

export default class InfoContainer {
  getTemplate() {
    return createContainer();
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
