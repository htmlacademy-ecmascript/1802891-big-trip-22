import AbstractView from '../framework/view/abstract-view.js';

function createWrapperContent() {
  return `
  <div class="trip-info__main"></div>
  `;
}

export default class InfoWrapperContent extends AbstractView{
  get template() {
    return createWrapperContent();
  }
}
