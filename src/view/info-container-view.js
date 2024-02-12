import AbstractView from '../framework/view/abstract-view.js';

function createContainer() {
  return `
    <section class="trip-main__trip-info  trip-info"></section>
  `;
}

export default class InfoContainerView extends AbstractView{
  get template() {
    return createContainer();
  }
}
