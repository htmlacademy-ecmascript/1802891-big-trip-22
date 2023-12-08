import {createElement} from '../render.js';

function createData() {
  return `
    <p class="trip-info__dates">18&nbsp;&mdash;&nbsp;20 Mar</p>
  `;
}

export default class InfoText {
  getTemplate() {
    return createData();
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
