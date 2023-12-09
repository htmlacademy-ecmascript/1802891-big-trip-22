import {createElement} from '../render.js';

function createTitle() {
  return `
    <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>
  `;
}

export default class InfoTitle {
  getTemplate() {
    return createTitle();
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
