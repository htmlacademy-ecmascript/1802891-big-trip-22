import AbstractView from '../framework/view/abstract-view.js';

function createTitle() {
  return `
    <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>
  `;
}

export default class InfoTitleView extends AbstractView{
  get template() {
    return createTitle();
  }
}
