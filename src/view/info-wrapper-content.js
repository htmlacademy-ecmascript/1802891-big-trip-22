import {createElement} from '../render.js';

function createWrapperContent() {
  return `
  <div class="trip-info__main"></div>
  `;
}

export default class InfoWrapperContent {
  getTemplate() {
    return createWrapperContent();
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
